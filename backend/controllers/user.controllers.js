const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const pdf = require('pdf-creator-node');
const moment = require('moment'); // require
const fs = require('fs');
const path = require('path');
const models = require('mongoose');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const CorporateStudent = require('../models/corporateStudent.model');
const sendMails = require('../utils/sendEmail');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password, firstName, lastName, terms } = req.body;
  if (!terms) {
    res.status(400);
    throw new Error('Please accept the terms and conditions');
  }

  if (!username || !email || !password || !firstName || !lastName) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('This Email Address is already used');
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create user
  const user = await User.create({
    username,
    email,
    lastName,
    firstName,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      type: 'individual',
      courses: [],
      wallet: 0,
      token: generateToken(user._id, '30d'),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check for user email
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.type === 'individual') {
      return res.status(200).json({
        _id: user.id,
        type: 'individual',
        courses: user.courses,
        wallet: user.wallet || 0,
        token: generateToken(user._id, '30d'),
      });
    } else {
      return res.status(200).json({
        _id: user.id,
        type: user.type,
        courses: user.courses,
        token: generateToken(user._id, '30d'),
      });
    }
  } else {
    const student = await CorporateStudent.findOne({ username }).populate(
      'requests',
      'course status'
    );
    if (student && (await bcrypt.compare(password, student.password))) {
      return res.status(200).json({
        _id: student.id,
        type: 'corporate',
        courses: student.courses,
        requests: student.requests,
        token: generateToken(student._id, '30d'),
      });
    } else {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json(req.user);
};

//@desc     add lesson to watchedLessons
//@route    PUT /api/users/mycourses/:courseId/:lessonUrl
//@access   Private
const addWatchedLesson = async (req, res) => {
  const { courseId, videoId, exerciseId } = req.params;
  const course = await Course.findById(courseId).populate('instructor', 'firstName lastName');
  const subtitles = course.subtitles;
  let duration = 0;
  let lessonsNo = 0;
  let lessonId = '';
  let completed = '';
  if (videoId) {
    lessonId = videoId;
  } else {
    lessonId = exerciseId;
  }

  subtitles.map((subtitle) => {
    lessonsNo += subtitle.lessons.length;
    if (videoId) {
      subtitle.lessons.map((lesson) => {
        if (lesson.video && lesson.video.id === lessonId) {
          duration = lesson.video.duration;
        }
      });
    }
  });

  const { user } = req;
  let watchedDuration = 0;
  user.courses.map((c) => {
    if (c._id.toString() === courseId) {
      if (!c.watchedLessons.includes(lessonId)) {
        c.watchedLessons.push(lessonId);
        if (videoId) {
          c.watchedDuration += duration;
        }
        watchedDuration = c.watchedDuration;
        if (c.watchedLessons.length === lessonsNo) {
          c.completed = moment().format('DD MMMM, YYYY');
          completed = c.completed;
        }
      } else {
        return res.status(400).json({ message: 'Lesson already watched' });
      }
    }
  });
  await user.save();
  if (completed !== '') {
    //send email
    const data = {
      name: user.firstName + ' ' + user.lastName,
      course: course.title,
      date: completed,
      instructor: course.instructor.firstName + ' ' + course.instructor.lastName,
      duration: formateDuration(course.duration),
    };
    const mailOptions = {
      to: user.email,
      subject: 'Coures Completed!',
      html: `<h1>Hi ${user.firstName} ${user.lastName}</h1>
            <h3>Congratulations! You have completed the course ${course.title}.</h3>
            <h3>You can find your certificate in the attachements</h3>
            <p>Best regards,</p>
            <p>Team Learnify</p>`,
      attachments: [
        {
          filename: 'certificate.pdf',
          path: path.resolve(__dirname, '../output/certificate.pdf'),
        },
      ],
    };
    createCertif(data).then(async () => {
      await sendMails(mailOptions);
    });
  }
  res.status(200).json({
    watchedDuration,
    courses: user.courses,
  });
};

const getAll = async (req, res) => {
  let money;
  const users = await User.find({}).populate('payments', 'amount');
  //{name,email,type,money spent or gained, date joined}
  let individuals = [];
  let noOfUsers = 0;
  let noOfInstructors = 0;
  let usersThisMonth = 0;
  let usersLastMonth = 0;
  let instructors = [];
  let InstructorsThisMonth = 0;
  let InstructorsLastMonth = 0;
  let userPercentageChange = 0;
  let instructorPercentageChange = 0;
  const data = users.map((user) => {
    if (user.type === 'individual' || user.type === 'instructor') {
      money = user.payments.reduce((acc, payment) => {
        return acc + payment.amount;
      }, 0);
    } else {
      money = 0;
    }
    if (user.type === 'individual') {
      if (!user.firstName) return;
      individuals.push({
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        type: user.type,
        money,
        date: moment(user.createdAt).format('DD MMMM, YYYY'),
      });
      noOfUsers++;
      if (moment(user.createdAt).isSame(moment(), 'month')) {
        usersThisMonth++;
      }
      if (moment(user.createdAt).isSame(moment().subtract(1, 'month'), 'month')) {
        usersLastMonth++;
      }
    } else if (user.type === 'instructor') {
      if (!user.firstName) return;
      instructors.push({
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        type: user.type,
        money,
        date: moment(user.createdAt).format('DD MMMM, YYYY'),
      });
      noOfInstructors++;
      if (moment(user.createdAt).isSame(moment(), 'month')) {
        InstructorsThisMonth++;
      }
      if (moment(user.createdAt).isSame(moment().subtract(1, 'month'), 'month')) {
        InstructorsLastMonth++;
      }
    }

    userPercentageChange =
      usersLastMonth === 0
        ? ((usersThisMonth - usersLastMonth) / 1) * 100
        : ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100;

    instructorPercentageChange =
      InstructorsLastMonth === 0
        ? ((InstructorsThisMonth - InstructorsLastMonth) / 1) * 100
        : ((InstructorsThisMonth - InstructorsLastMonth) / InstructorsLastMonth) * 100;

    return {
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      type: user.type,
      money,
      date: moment(user.createdAt).format('DD MMMM, YYYY'),
    };
  });
  res.status(200).json({
    individuals: {
      rows: individuals,
      number: noOfUsers,
      percentageChange: userPercentageChange,
    },
    instructors: {
      rows: instructors,
      number: noOfInstructors,
      percentageChange: instructorPercentageChange,
    },
  });
};

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

// @desc    Create a new admin account
// @route   GET /api/users/admins
// @access  Admin
const createAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ message: 'Please add all fields' });
  }
  // Check if user exists
  const userExists = await User.findOne({ username });
  const emailExists = await User.findOne({ email });
  if (userExists || emailExists) {
    res.status(400).json({ message: 'User already exists' });
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create user
  let user = new User({
    username,
    email,
    password: hashedPassword,
    type: 'administrator',
  });
  user = await user.save();
  if (user) {
    res.status(201).json({ message: 'Admin created successfully' });
  } else {
    res.status(400).json({ message: 'Something went wrong' });
  }
};

//@desc     set user's Country
//@route    PUT /api/users/me/country
//@access   Private
const setCountry = async (req, res) => {
  const { country } = req.body;
  if (!country) {
    return res.status(400).json({ message: 'Please add all fields' });
  }
  const user = await User.findById(req.user._id);
  if (user) {
    const rate = await getRate(country.currency);
    country.currency.rate = rate;
    user.country = country.name;
    await user.save();
    return res.status(200).json(country);
  }
  const student = await CorporateStudent.findById(req.user._id);
  if (student) {
    const rate = await getRate(country.currency);
    country.currency.rate = rate;
    return res.status(200).json(country);
  }
  res.status(404).json({ message: 'User not found' });
};

const myCourses = async (req, res) => {
  let student = null;
  student = await User.findById(req.user._id).populate({
    path: 'courses._id',
    populate: {
      path: 'instructor',
      select: 'firstName lastName',
    },
  });
  if (!student) {
    student = await CorporateStudent.findById(req.user._id).populate({
      path: 'courses._id',
      populate: {
        path: 'instructor',
        select: 'firstName lastName',
      },
    });
  }

  if (student) {
    const courses = student.courses.map(
      (course) =>
        course._id && {
          _id: course._id._id,
          title: course._id.title,
          instructor: course._id.instructor,
          preview: course._id.preview,
          progress: Math.round((course.watchedDuration / course._id.duration) * 100) || 0,
        }
    );
    res.status(200).json(courses);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Generate JWT
const generateToken = (id, expIn) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expIn,
  });
};
const getRate = async (currency) => {
  const response = await fetch(
    `https://api.exchangerate.host/convert?from=USD&to=${currency.code}`
  );
  const data = await response.json();
  return data.info.rate;
};

//@desc     change user's password
//@route    PUT /api/users/changePass
//@access   Private
const sendMail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400);
    throw new Error('Please Enter Email');
  } else {
    const user = await User.findOne({ email });
    if (user) {
      // Send Email
      const mailOptions = {
        to: user.email,
        subject: 'Password Reset',
        html: `<h1>Hi ${user.firstName} ${user.lastName}</h1>
              <p>You have requested to reset your password.</p>
              <p>Click on the link below to reset your password.</p>
              <a href="${process.env.CLIENT_URL}/ResetPassword/${generateToken(user._id, '15m')}/${
          user.email
        }">Reset Password</a>
              <p>Best regards,</p>
              <p>Team Learnify</p>`,
      };
      await sendMails(mailOptions);
      return res.status(200).json({ message: 'Email Sent' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }
};

const resetPass = async (req, res) => {
  const { password, password2 } = req.body;
  const { token, email } = req.params;

  if (!password || !password2) {
    res.status(400);
    throw new Error('Please Fill All Fields');
  }
  if (password != password2) {
    res.status(400);
    throw new Error("Password Don't Match!");
  } else {
    const user = await User.findOne({ email });
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json(user + ' + ' + token + ' + ' + email);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  }
};

// @desc    Get user's Email
// @route   GET /api/users/changeEmail
// @access  Private
const changeEmail = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Please Fill All Fields' });
  } else {
    const user = await User.findById(req.user._id);
    if (user && (await bcrypt.compare(password, user.password))) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400);
        throw new Error('This Email Address is already used');
      }
      user.email = email;
      await user.save();
      res.sendStatus(200);
    } else {
      res.status(401);
      throw new Error('Wrong password');
    }
  }
};

//@desc     change user's password
//@route    PUT /api/users/changePass
//@access   Private
const changePass = async (req, res) => {
  const { oldPassword, password, password2 } = req.body;
  if (!oldPassword || !password || !password2) {
    res.status(400).json({ message: 'Please Fill All Fields' });
  } else if (password != password2) {
    res.status(400);
    throw new Error("Passwords Don't Match");
  } else {
    const user = await User.findById(req.user._id);
    if (user) {
      const success = await bcrypt.compare(oldPassword, user.password);
      if (success) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        const updatedUser = await user.save();

        res.status(200).json(updatedUser.password);
      } else {
        res.status(401);
        throw new Error('Wrong password');
      }
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  }
};

//@desc     get user's email
//@route    GET /api/users/:id
//@access   Private
const getEmail = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).json(user.email);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

//@desc     download user's notes as pdf
//@route    POST /api/users/downloadNotes
//@access   Private
const downloadNotes = async (req, res) => {
  const { notes, id } = req.body;
  const directory = path.resolve(__dirname, '../utils/noteTemplate.html');
  const html = fs.readFileSync(directory, 'utf8');
  const course = await Course.findById(id);
  const user = req.user;
  var options = {
    format: 'A4',
    orientation: 'portrait',
    border: '10mm',
    footer: {
      height: '15mm',
      contents: {
        default: `<span style="color: #444;">Created By ${
          user.firstName + ' ' + user.lastName
        }   </span>`,
      },
    },
  };
  var document = {
    html: html,
    data: {
      course: course.title,
      notes: notes,
    },
    path: path.resolve(__dirname, '../output/notes.pdf'),
  };
  pdf
    .create(document, options)
    .then((response) => {
      return res.status(200).download(path.resolve(__dirname, '../output/notes.pdf'));
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

// @desc    Send Certificate by email
// @route   POST /api/users/:id/course/:courseId/mailCertificate
// @access  Private
const downloadCertificate = async (req, res) => {
  const { courseId } = req.params;
  const user = req.user;
  const course = await Course.findById(courseId).populate('instructor', ['firstName', 'lastName']);
  const completed = user.courses.find((course) => course._id.toString() === courseId).completed;
  const duration = formateDuration(course.duration);

  const data = {
    name: user.firstName + ' ' + user.lastName,
    course: course.title,
    date: completed,
    instructor: course.instructor.firstName + ' ' + course.instructor.lastName,
    duration,
  };
  createCertif(data).then(() => {
    return res.status(200).download(path.resolve(__dirname, '../output/certificate.pdf'));
  });
};

const formateDuration = (duration) => {
  const hours = Math.floor(duration / (60 * 60));
  const minutes = Math.floor(duration / 60);
  return `${hours}hr ${minutes}m`;
};
const createCertif = async (data) => {
  const directory = path.resolve(__dirname, '../utils/certTemplate.html');
  const html = fs.readFileSync(directory, 'utf8');
  var options = {
    format: 'A4',
    orientation: 'landscape',
  };
  var document = {
    html: html,
    pageRange: '1',
    data: data,
    path: path.resolve(__dirname, '../output/certificate.pdf'),
    type: 'pdf',
  };
  await pdf.create(document, options);
};

// @desc    Get last checkout session
// @route   GET /api/users/me/lastCheckoutSession
// @access  Private
const lastCheckoutSession = async (req, res) => {
  setTimeout(async () => {
    const user = await User.findById(req.user._id).populate('payments');
    const lastPayment = user.payments.sort((a, b) => b.createdAt - a.createdAt)[0];
    res.status(200).json({ courses: user.courses });
  }, 1000);
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

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAll,
  getAllInstructors,
  getOneInstructor,
  createAdmin,
  setCountry,
  myCourses,
  addWatchedLesson,
  getPrivateCourses,
  editInstructor,
  changePass,
  changeEmail,
  sendMail,
  resetPass,
  getEmail,
  downloadNotes,
  downloadCertificate,
  lastCheckoutSession,
  getRevenue,
  inviteInstructor,
  InstructorRegister,
};
