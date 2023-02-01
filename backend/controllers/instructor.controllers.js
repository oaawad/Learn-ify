const bcrypt = require('bcrypt');
const moment = require('moment'); // require
const models = require('mongoose');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const Course = require('../models/course.model');

// @desc    Get all instructors data
// @route   GET /api/users/instructors
// @access  Public
const getAllInstructors = async (req, res) => {
  const users = await User.find({ type: 'instructor' }, { password: 0 });
  res.status(200).json(users);
};

// @desc    Get one instructor data
// @route   GET /api/users/instructors/:id
// @access  Public
const getOneInstructor = async (req, res) => {
  const { id } = req.params;
  if (!models.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  let instructor = await User.findById(id, { password: 0, courses: 0 }).populate('subjects');
  const courses = await Course.find({
    instructor: id,
    status: 'public',
  })
    .populate('instructor', 'firstName lastName')
    .populate('promotion')
    .populate('subject');
  if (!instructor) {
    return res.status(404).json({ message: 'Instructor not found' });
  } else {
    res.status(200).json({ instructor, courses });
  }
};

// @desc    Edit instructor's name and bio and profession
// @route   PUT /api/users/instructors/:id
// @access  Private
const editInstructor = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, bio, profession } = req.body;
  if (!firstName || !lastName || !bio || !profession) {
    res.status(400).json({ message: 'Please add all fields' });
  }
  if (!models.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  const instructor = await User.findById(id, { password: 0, courses: 0 });
  if (!instructor) {
    return res.status(404).json({ message: 'Instructor not found' });
  } else {
    instructor.firstName = firstName;
    instructor.lastName = lastName;
    instructor.bio = bio;
    instructor.profession = profession;
    await instructor.save();
    res.status(200).json({ instructor });
  }
};

// @desc    Get Instructor private courses
// @route   GET /api/users/instructors/:id/private
// @access  Private
const getPrivateCourses = async (req, res) => {
  const { id } = req.params;
  if (!models.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  const courses = await Course.find({
    instructor: id,
    status: { $ne: 'public' },
  })
    .populate('instructor', 'firstName lastName')
    .populate('subject');
  if (!courses) {
    return res.status(200).json([]);
  } else {
    res.status(200).json(courses);
  }
};

// @desc    Get revenue
// @route   GET /api/users/revenue
// @access  Private
const getRevenue = async (req, res) => {
  const instructor = await User.findById(req.user._id).populate('payments');
  let month = req.query.month;
  const colors = ['rgb(255, 99, 132)', 'rgb(53, 162, 235)', 'rgb(53, 162, 23)'];
  const courses = await Course.find({ instructor: instructor._id }).populate('payments', [
    'amount',
    'createdAt',
  ]);
  let refund = 0;
  let revenue = 0;
  let currentMonth;
  let prevMonth;
  let nextMonth;
  if (month === 'today') {
    currentMonth = moment().format('YYYY-MM');
  } else {
    month = new Date(month);
    currentMonth = moment(month).format('YYYY-MM');
  }
  const days = month === 'today' ? getDays(month) : getDays(currentMonth);
  const datasets = [];
  let otherPayments = [];

  courses.forEach((course, i) => {
    const data = Array(days.length).fill(0);
    const currentMonthPayments = course.payments.filter((payment) => {
      const date = moment(payment.createdAt).format('YYYY-MM');
      if (
        date.split('-')[0] === currentMonth.split('-')[0] &&
        date.split('-')[1] === currentMonth.split('-')[1]
      ) {
        return payment;
      } else {
        otherPayments.push(payment);
      }
    });
    if (currentMonthPayments.length > 0) {
      currentMonthPayments.forEach((payment) => {
        revenue += payment.amount;
        const day = parseInt(moment(payment.createdAt).format('DD'));
        data[day - 1] += payment.amount;
      });
    } else {
      return;
    }
    datasets.push({
      label: course.title,
      data: data,
      borderColer: colors[i % 3],
      backgroundColor: colors[i % 3],
    });
  });
  const currentMonthRefunds = instructor.payments.filter((payment) => {
    if (payment.status === 'refunded') {
      const date = moment(payment.updatedAt).format('YYYY-MM');
      if (
        date.split('-')[0] === currentMonth.split('-')[0] &&
        date.split('-')[1] === currentMonth.split('-')[1]
      ) {
        return payment;
      }
    }
  });
  if (currentMonthRefunds.length > 0) {
    const data = Array(days.length).fill(0);
    currentMonthRefunds.forEach((payment) => {
      refund += payment.amount;
      const day = parseInt(moment(payment.createdAt).format('DD'));
      data[day - 1] -= payment.amount;
    });
    datasets.push({
      label: 'Refund',
      data: data,
      borderColer: 'rgb(217, 33, 33)',
      backgroundColor: 'rgb(217, 33, 33)',
    });
    revenue -= refund;
  }

  if (otherPayments.length > 0) {
    otherPayments = otherPayments.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    prevMonth = otherPayments.find(
      (payment) => moment(payment.createdAt).format('YYYY-MM') < currentMonth
    )?.createdAt;
    nextMonth = otherPayments.filter(
      (payment) => moment(payment.createdAt).format('YYYY-MM') > currentMonth
    );
    nextMonth = nextMonth?.length > 0 ? nextMonth[nextMonth.length - 1].createdAt : null;
    if (!nextMonth && month !== 'today') {
      nextMonth = new Date();
    }
  }

  prevMonth = prevMonth ? moment(prevMonth).format('MMMM, YYYY') : null;
  nextMonth = nextMonth ? moment(nextMonth).format('MMMM, YYYY') : null;
  const thisMonth = moment(currentMonth).format('MMMM, YYYY');
  res.status(200).json({ labels: days, datasets, revenue, prevMonth, nextMonth, thisMonth });
};

// @desc    Invite Instructor
// @route   POST /api/users/inviteInstructor
// @access  Private
const inviteInstructor = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const userFound = await User.findOne({
    email,
  });
  if (userFound) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = await User.create({
    email,
    username: email,
    type: 'instructor',
  });
  const token = generateToken(user._id, '24h');
  const link = `${process.env.CLIENT_URL}/complete-registration/${token}`;

  //Send Mail
  var transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.Mail,
      pass: process.env.Pass,
    },
  });

  var mailOptions = {
    from: process.env.Mail,
    to: email,
    subject: 'Invitation to join our platform',
    text: `Here is your Invitation link:  ${link}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return res.status(400).json({ message: 'Faild to send the email' });
    } else {
      return res.status(200).json({ success: true });
    }
  });
};

// @desc    Instructor Register
// @route   POST /api/users/instructors
// @access  Private
const InstructorRegister = async (req, res) => {
  const { username, password, firstName, lastName, terms } = req.body;
  if (!terms) {
    res.status(400);
    throw new Error('Please accept the terms and conditions');
  }

  if (!username || !password || !firstName || !lastName) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      username,
      password: hashedPassword,
      firstName,
      lastName,
      type: 'instructor',
    },
    { new: true }
  );
  if (user) {
    res.status(201).json({
      _id: req.user._id,
      type: 'instructor',
      courses: [],
      token: generateToken(user._id, '30d'),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const getDays = (date) => {
  if (date === 'today') {
    const now = new Date();
    const currentDay = now.getDate();
    const days = [];
    for (let i = 0; i < currentDay; i++) {
      days.push(i + 1);
    }
    return days;
  } else {
    const numDays = moment(date, 'YYYY-MM').daysInMonth();
    const days = [];
    for (let i = 0; i < numDays; i++) {
      days.push(i + 1);
    }
    return days;
  }
};
module.exports = {
  getOneInstructor,
  getAllInstructors,
  editInstructor,
  getPrivateCourses,
  getRevenue,
  inviteInstructor,
  InstructorRegister,
};
