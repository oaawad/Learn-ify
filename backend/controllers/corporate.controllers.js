const Corporate = require('../models/corporate.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const CorporateStudent = require('../models/corporateStudent.model');
const sendEmail = require('../utils/sendEmail');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CourseRequest = require('../models/courseRequest.model');

// @desc    Create a corporate
// @route   POST /api/corporate/
// @access  Private/Admin
const createCorporate = async (req, res) => {
  const { name, accountsLimit, coursesLimit } = req.body;
  if (!name || !accountsLimit || !coursesLimit) {
    res.status(400).json({ message: 'Please fill all fields' });
  }
  const corporateExists = await Corporate.findOne({ name });
  if (corporateExists) {
    res.status(400).json({ message: 'Corporate already exists ' });
  }
  const corporate = await Corporate.create({
    name,
    accountsLimit,
    coursesLimit,
  });
  if (corporate) {
    res.status(201).json({
      name: corporate.name,
      accountsLimit: corporate.accountsLimit,
      coursesLimit: corporate.coursesLimit,
      accountsNumber: corporate.accounts.length,
      coursesNumber: corporate.courses.length,
      _id: corporate._id,
    });
  } else {
    res.status(400).json({ message: 'Invalid corporate data' });
  }
};

// @desc    Get all corporates
// @route   GET /api/corporate/
// @access  Private/Admin
const getCorporates = async (req, res) => {
  let corporates = await Corporate.find({});
  let corporatesThisMonth = 0;
  let corporatesLastMonth = 0;
  let totalAccounts = 0;
  corporates = corporates.map((corporate) => {
    if (moment(corporate.createdAt).isSame(moment(), 'month')) {
      corporatesThisMonth++;
    }
    if (moment(corporate.createdAt).isSame(moment().subtract(1, 'month'), 'month')) {
      corporatesLastMonth++;
    }

    totalAccounts += corporate.accounts.length;
    return {
      name: corporate.name,
      accountsLimit: corporate.accountsLimit,
      coursesLimit: corporate.coursesLimit,
      accountsNumber: corporate.accounts.length,
      coursesNumber: corporate.coursesNumber,
      _id: corporate._id,
    };
  });

  let corporatesPercentageChange =
    corporatesLastMonth === 0
      ? ((corporatesThisMonth - corporatesLastMonth) / 1) * 100
      : ((corporatesThisMonth - corporatesLastMonth) / corporatesLastMonth) * 100;
  res.status(200).json({ corporates, corporatesPercentageChange, totalAccounts });
};

// @desc    Update a corporate
// @route   PUT /api/corporate/:id
// @access  Private/Admin
const updateCorporate = async (req, res) => {
  const { accountsLimit } = req.body;
  if (!accountsLimit) {
    res.status(400).json({ message: 'Please enter new accounts limit' });
  }
  const corporateExists = await Corporate.findOne({ _id: req.params.id });
  if (!corporateExists) {
    res.status(400).json({ message: 'Corporate does not exist' });
  }
  const corporate = await Corporate.findByIdAndUpdate(
    req.params.id,
    { accountsLimit },
    { new: true }
  );
  if (corporate) {
    res.status(201).json({
      name: corporate.name,
      accountsLimit: corporate.accountsLimit,
      accountsNumber: corporate.accounts.length,
      coursesNumber: corporate.courses.length,
    });
  } else {
    res.status(400).json({ message: 'Invalid corporate data' });
  }
};

// @desc    Delete a corporate
// @route   DELETE /api/corporate/:id
// @access  Private/Admin
const deleteCorporate = async (req, res) => {
  const corporateExists = await Corporate.findOne({ _id: req.params.id });
  if (!corporateExists) {
    res.status(400).json({ message: 'Corporate does not exist' });
  }
  const corporate = await Corporate.findByIdAndDelete(req.params.id);
  if (corporate) {
    res.status(201).json({ message: 'Corporate deleted' });
  } else {
    res.status(400).json({ message: 'Invalid corporate data' });
  }
};

// @desc    Create a student
// @route   POST /api/corporate/:id
// @access  Private/Admin
const inviteStudents = async (req, res) => {
  const { emails } = req.body;
  const failedMails = [];
  if (!emails || emails.length === 0) {
    return res.status(400).json({ message: 'Please enter emails' });
  }
  const corporateExists = await Corporate.findOne({ _id: req.params.id });
  if (!corporateExists) {
    return res.status(400).json({ message: 'Corporate does not exist' });
  }
  const corporate = await Corporate.findById(req.params.id);
  if (corporate.accounts.length + emails.length > corporate.accountsLimit) {
    return res.status(400).json({ message: 'Accounts limit exceeded' });
  }

  emails.forEach(async (email) => {
    const corporateStudent = await CorporateStudent.create({
      corporate: req.params.id,
      email,
    });
    corporate.accounts.push(corporateStudent._id);
    const token = generateToken(corporateStudent._id, '7d');
    const url = `${process.env.CLIENT_URL}/corporate/register/${token}`;
    const message = `
    <h1>You have been invited to join the corporate account</h1>
    <p>Please click the link below to register</p>
    <a href=${url} clicktracking=off>${url}</a>
  `;
    const mailOptions = {
      to: email,
      subject: 'Corporate account invitation',
      html: message,
    };
    const mail = await sendEmail(mailOptions);
    if (!mail.success) {
      failedMails.push(email);
    }
  });
  await corporate.save();
  if (failedMails.length > 0) {
    return res.status(400).json({ message: 'Failed to send emails', failedMails });
  }
  res.status(200).json({ message: 'Students created' });
};

// @desc    Get all students
// @route   GET /api/corporate/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  const corporates = await Corporate.find({}).populate('accounts');
  let students = [];
  let studentsThisMonth = 0;
  let studentsLastMonth = 0;
  corporates.forEach((corporate) => {
    students = [...students, ...corporate.accounts];
  });
  students = students.map((student) => {
    if (
      student.createdAt.getMonth() === new Date().getMonth() &&
      student.createdAt.getFullYear() === new Date().getFullYear()
    ) {
      studentsThisMonth++;
    } else if (
      student.createdAt.getMonth() === new Date().getMonth() - 1 &&
      student.createdAt.getFullYear() === new Date().getFullYear()
    ) {
      studentsLastMonth++;
    }
    return {
      name: student.name,
      email: student.email,
      corporate: student.corporate,
      courses: student.courses.length,
      date: moment(student.createdAt).format('DD MMMM, YYYY'),
    };
  });
  let studentsPercentageChange =
    studentsLastMonth === 0
      ? ((studentsThisMonth - studentsLastMonth) / 1) * 100
      : ((studentsThisMonth - studentsLastMonth) / studentsLastMonth) * 100;
  res.status(200).json({ students, studentsPercentageChange });

  res.status(200).json(students);
};

// @desc    Complete registration
// @route   POST /api/corporate/complete-registration
// @access  Private
const registerStudent = async (req, res) => {
  const { firstName, lastName, password, username, terms } = req.body;
  if (!terms) {
    return res.status(400).json({ message: 'Please accept terms and conditions' });
  }
  if (!username || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const student = await CorporateStudent.findByIdAndUpdate(
    req.user._id,
    {
      firstName,
      lastName,
      password,
      username,
      password: hashedPassword,
    },
    { new: true }
  );
  if (student) {
    res.status(201).json({
      _id: student.id,
      type: 'corporate',
      courses: [],
      requests: [],
      token: generateToken(student._id, '30d'),
    });
  } else {
    res.status(400);
    throw new Error('Invalid student data');
  }
};

// @desc    Check if email exists
// @route   POST /api/corporate/check
// @access  Private
const checkEmail = async (req, res) => {
  const { email } = req.body;
  const corporate = await CorporateStudent.findOne({ email });
  if (corporate) {
    return res
      .status(400)
      .json({ message: 'Email already registered in our system please use another email' });
  } else {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: 'Email already registered in our system please use another email' });
    }
    res.status(200).json({ success: true });
  }
};

// @desc    Create a request
// @route   POST /api/corporate/request
// @access  Private
const createRequest = async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(400).json({ message: 'Course does not exist' });
  }
  const student = await CorporateStudent.findById(req.user._id).populate('requests');
  const requests = student.requests.map((request) => {
    return { course: request.course, status: request.status };
  });
  if (student.courses.map((course) => course._id).includes(courseId)) {
    return res.status(400).json({ message: 'Course already Owned' });
  } else if (student.requests.map((request) => request.title).includes(course.title)) {
    return res.status(400).json({ message: 'Request already made' });
  }
  const corporate = await Corporate.findById(req.user.corporate);
  if (corporate.coursesNumber >= corporate.coursesLimit) {
    return res.status(400).json({ message: 'Courses limit exceeded' });
  }
  const request = await CourseRequest.create({
    course: courseId,
    title: course.title,
    user: req.user._id,
    corporate: corporate.name,
  });
  if (request) {
    student.requests.push(request);
    await student.save();
    requests.push({ course: request.course, status: request.status });
    res.status(201).json({ requests: requests });
  } else {
    res.status(400).json({ message: 'Invalid request data' });
  }
};

// @desc    Get all requests
// @route   GET /api/corporate/requests
// @access  Private/Admin
const getRequests = async (req, res) => {
  const requests = await CourseRequest.find({ status: 'pending' }).populate('user', 'email');
  const filteredRequests = [];
  requests.map((request) => {
    filteredRequests.push({
      email: request.user.email,
      corporate: request.corporate,
      course: request.title,
      status: request.status,
      date: moment(request.createdAt).format('DD MMMM, YYYY'),
      _id: request._id,
    });
  });
  res.status(200).json(filteredRequests);
};

// @desc    Update request
// @route   PUT /api/corporate/requests/:id
// @access  Private/Admin
const updateRequest = async (req, res) => {
  const { status } = req.body;
  const request = await CourseRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (status === 'approved') {
    const student = await CorporateStudent.findById(request.user);
    const course = await Course.findById(request.course);
    student.courses.push({ _id: course._id });
    student.requests = student.requests.filter((request) => request._id !== req.params.id);
    await student.save();
    const corporate = await Corporate.findById(student.corporate);
    corporate.coursesNumber += 1;
    await corporate.save();
  }
  if (request) {
    res.status(200).json({ message: 'Request updated' });
  } else {
    res.status(400).json({ message: 'Invalid request data' });
  }
};

const generateToken = (id, expIn) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expIn,
  });
};
module.exports = {
  createCorporate,
  getCorporates,
  updateCorporate,
  deleteCorporate,
  inviteStudents,
  getStudents,
  registerStudent,
  checkEmail,
  createRequest,
  getRequests,
  updateRequest,
};
