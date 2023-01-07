const models = require('mongoose');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Promotion = require('../models/promotion.model');
const Subject = require('../models/subject.model');
const fetch = require('node-fetch');
const Stripe = require('stripe');
require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_KEY);

const getAll = async (req, res) => {
  const courses = await Course.find({ status: 'public' })
    .populate('instructor', {
      password: 0,
    })
    .populate('promotion')
    .populate('subject');
  if (courses) {
    res.status(200).json(courses);
  }
};
const getAllNames = async (req, res) => {
  const courses = await Course.find({ status: 'public' }).select('title _id');
  if (courses) {
    const names = courses.map((course) => {
      return {
        label: course.title,
        value: course._id,
      };
    });
    return res.status(200).json(names);
  }
  res.status(400).json({ message: 'No courses found' });
};
const getTrendingCourses = async (req, res) => {
  const courses = await Course.find({})
    .sort({ studentsCount: -1 })
    .limit(10)
    .populate('promotion')
    .populate('subject');
  if (courses) {
    res.status(200).json(courses);
  }
};

const getTopRatedCourses = async (req, res) => {
  const courses = await Course.find({})
    .sort({ rating: -1 })
    .limit(10)
    .populate('promotion')
    .populate('subject');
  if (courses) {
    res.status(200).json(courses);
  }
};

const viewCourse = async (req, res) => {
  const id = req.params.id;
  if (!models.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course id' });
  }
  const course = await Course.findById(id)
    .populate('instructor', {
      password: 0,
    })
    .populate('promotion')
    .populate('subject');
  if (!course || course.status !== 'public') {
    return res.status(400).json({ message: 'Course not found' });
  } else {
    return res.status(200).json(course);
  }
};

const viewPrivateCourse = async (req, res) => {
  const id = req.params.id;
  if (!models.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid course id' });
  }
  const course = await Course.findById(id)
    .populate('instructor', {
      password: 0,
    })
    .populate('promotion')
    .populate('subject');
  if (!course) {
    return res.status(400).json({ message: 'Course not found' });
  } else {
    return res.status(200).json(course);
  }
};

const createCourse = async (req, res) => {
  let course = req.body;
  if (!course) {
    return res.status(400).json({ message: 'Please add all fields' });
  }
  let duration = 0;
  // for every video in lessons array of each subtitle, get the video duration from youtube
  for (let i = 0; i < course.subtitles.length; i++) {
    for (let j = 0; j < course.subtitles[i].lessons.length; j++) {
      if (course.subtitles[i].lessons[j].video) {
        const videoId = course.subtitles[i].lessons[j].video.url;
        const vidDuration = await getVideoDuration(videoId);
        course.subtitles[i].lessons[j].video.duration = vidDuration;
        duration += vidDuration;
      }
    }
  }

  const newCourse = await Course.create({
    title: course.title,
    instructor: req.user._id,
    description: course.description,
    subject: course.subject,
    price: course.price,
    subtitles: course.subtitles,
    preview: course.preview,
    status: course.status,
    level: course.level,
    duration,
  });
  if (newCourse) {
    const user = await User.findById(req.user._id);
    user.courses.push(newCourse._id);
    user.subjects.includes(course.subject) ? null : user.subjects.push(course.subject);
    await user.save();
    res.status(201).json(user.courses);
  }
};
const createPromotion = async (req, res) => {
  const { amount, expireAt } = req.body;
  if (!amount || !expireAt) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  const course = await Course.findById(req.params.id).populate('instructor', '_id');
  if (!course) {
    res.status(400);
    throw new Error('This course not found');
  }
  if (course.instructor._id.toString() !== req.user._id.toString()) {
    res.status(400);
    throw new Error('You are not the instructor of this course');
  }
  const coupons = await stripe.coupons.list();
  let coupon = coupons.data.find((coupon) => coupon.percent_off === amount);
  if (!coupon) {
    coupon = await stripe.coupons.create({
      percent_off: amount,
      duration: 'forever',
      name: `Promotion ${amount}%`,
    });
  }
  const promotion = await Promotion.create({
    amount,
    course: req.params.id,
    expireAt,
    createdBy: req.user._id,
    coupon: coupon.id,
  });
  if (promotion) {
    course.promotion = promotion._id;
    await course.save();
    res.status(201).json(promotion);
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
};
const deletePromotion = async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', '_id');
  if (!course) {
    res.status(400);
    throw new Error('This course not found');
  }
  if (
    req.user.type !== 'administrator' &&
    course.instructor._id.toString() !== req.user._id.toString()
  ) {
    res.status(400);
    throw new Error('You are not the instructor of this course');
  }
  const promotion = await Promotion.findById(course.promotion);
  if (promotion) {
    promotion.status = 'inactive';
    await promotion.save();
    course.promotion = null;
    await course.save();
    res.status(200).json({ message: 'Promotion deleted' });
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
};

const editCourse = async (req, res) => {
  const id = req.params.id;
  const course = req.body;
  if (!course) {
    return res.status(400).json({ message: 'Please add all fields' });
  }
  const updatedCourse = await Course.findByIdAndUpdate(id, course, {
    new: true,
  });
  if (updatedCourse) {
    return res.status(200).json(updatedCourse);
  } else {
    return res.status(400).json({ message: 'Course not found' });
  }
};

const deleteCourse = async (req, res) => {
  const id = req.params.id;
  const course = await Course.findById(id);
  if (!course) {
    return res.status(400).json({ message: 'Course not found' });
  }
  if (req.user._id.toString() !== course.instructor.toString()) {
    return res.status(400).json({ message: 'You are not the instructor of this course' });
  }
  const deletedCourse = await Course.findByIdAndDelete(id);
  const instructor = await User.findById(req.user._id).populate('courses._id subject');
  instructor.courses = instructor.courses.filter((course) => course._id.toString() !== id);
  instructor.subjects =
    instructor.courses.length > 0
      ? instructor.courses
          .map((course) => course._id.subject)
          .filter((value, index, self) => self.indexOf(value) === index)
      : [];
  if (deletedCourse) {
    return res.status(200).json({ message: 'Course deleted' });
  } else {
    return res.status(400).json({ message: 'Course not found' });
  }
};

const getSubjects = async (req, res) => {
  const subjects = await Subject.find({});
  if (subjects) {
    return res.status(200).json(subjects);
  }
  res.status(400).json({ message: 'Subjects not found' });
};

const getVideoDuration = async (id) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos/?id=${id}&key=${process.env.Youtube_API_KEY}&part=contentDetails`
  );
  const data = await response.json();

  const duration = data.items[0].contentDetails.duration; //PT30M30S
  const time = duration.replace('PT', '').replace('H', ':').replace('M', ':').replace('S', '');
  const timeArray = time.split(':');
  let seconds = 0;
  if (timeArray.length === 3) {
    seconds = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]);
  } else if (timeArray.length === 2) {
    seconds = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
  } else {
    seconds = parseInt(timeArray[0]);
  }
  return seconds;
};

const getPromotions = async (req, res) => {
  const promotions = await Promotion.find({ status: 'active' })
    .populate('course', 'title _id')
    .populate('createdBy', 'type');
  if (!promotions) {
    return res.status(400).json({ message: 'Promotions not found' });
  }
  const rows = promotions.map((promotion) => {
    return {
      id: promotion._id,
      courseName: promotion.course.title,
      courseId: promotion.course._id,
      amount: promotion.amount,
      date: promotion.expireAt,
      creator: promotion.createdBy.type,
    };
  });
  res.status(200).json(rows);
};
const adminPromotion = async (req, res) => {
  let { courses, amount, expireDate } = req.body;
  courses = courses.map((course) => course.value);
  const foundCourses = await Course.find({ _id: { $in: courses } });
  foundCourses.forEach(async (course) => {
    const coupons = await stripe.coupons.list();
    let coupon = coupons.data.find((coupon) => coupon.percent_off === amount);
    if (!coupon) {
      coupon = await stripe.coupons.create({
        percent_off: amount,
        duration: 'forever',
        name: `Promotion ${amount}%`,
      });
    }
    const promotion = await Promotion.create({
      amount,
      course: course._id,
      expireAt: expireDate,
      createdBy: req.user._id,
      coupon: coupon.id,
    });
    if (promotion) {
      const deleted = await Promotion.findByIdAndDelete(course.promotion);
      course.promotion = promotion._id;
      await course.save();
    }
  });
  res.status(201).json({ message: 'Promotions created' });
};
module.exports = {
  getAll,
  getAllNames,
  getTopRatedCourses,
  getTrendingCourses,
  createCourse,
  viewCourse,
  createPromotion,
  deletePromotion,
  viewPrivateCourse,
  editCourse,
  deleteCourse,
  getSubjects,
  getPromotions,
  adminPromotion,
};
