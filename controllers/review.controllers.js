const models = require('mongoose');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Review = require('../models/review.model');

const createReview = async (req, res) => {
  if (req.body.course) {
    createCourseReview(req, res);
  } else if (req.body.instructor) {
    createInstructorReview(req, res);
  }
};
const createCourseReview = async (req, res) => {
  const { rating, course, body } = req.body;
  if (!rating || !course) {
    return res.status(400).json({ message: 'Please provide a rating and course ID' });
  }
  if (!models.Types.ObjectId.isValid(course)) {
    return res.status(400).json({ message: 'Invalid course id' });
  }
  const user = await User.findById(req.user._id);
  const enrolled = user.courses.find((c) => c._id.toString() === course);
  if (!enrolled) {
    return res.status(400).json({ message: 'You are not enrolled in this course' });
  }

  const courseFound = await Course.findById(course);
  if (!courseFound) {
    return res.status(400).json({ message: 'Course not found' });
  }
  //check if user already reviewed this course
  const reviewed = await Review.findOne({
    user: user._id,
    course: courseFound._id,
  });
  if (reviewed) {
    return res.status(400).json({ message: 'You already reviewed this course' });
  }
  const review = await Review.create({
    rating,
    course,
    user: req.user._id,
    body,
  });
  if (review) {
    courseFound.reviews.push(review._id);
    user.reviews.push(review._id);
    courseFound.rating = await getCourseAverageRating(courseFound._id);
    await courseFound.save();
    await user.save();
    await review.save();
    const reviewPopulated = {
      rating,
      course,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      body,
      _id: review._id,
      createdAt: review.createdAt,
    };
    return res.status(201).json({ reviewPopulated });
  } else {
    return res.status(400).json({ message: 'Invalid review data' });
  }
};

const getCourseAverageRating = async (courseId) => {
  const obj = await Review.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  try {
    await Course.findByIdAndUpdate(courseId, {
      rating: obj[0].averageRating,
    });
  } catch (err) {}
};

const createInstructorReview = async (req, res) => {
  const { rating, instructor, body } = req.body;
  if (!rating || !instructor) {
    res.status(400).json({ message: 'Please provide a rating and instructor ID' });
  }
  if (!models.Types.ObjectId.isValid(instructor)) {
    return res.status(400).json({ message: 'Invalid instructor id' });
  }
  const user = req.user;
  const instructorFound = await User.findById(instructor);
  if (!instructorFound) {
    return res.status(400).json({ message: 'Instructor not found' });
  }
  const userCourses = user.courses.map((c) => c._id.toString());
  const instructorCourses = instructorFound.courses.map((c) => c._id.toString());
  const enrolled = userCourses.find((c) => instructorCourses.includes(c));
  if (!enrolled) {
    return res.status(400).json({ message: 'You are not enrolled in this course' });
  }
  //check if user already reviewed this instructor
  const reviewed = await Review.findOne({
    user: user._id,
    instructor: instructorFound._id,
  });
  if (reviewed) {
    return res.status(400).json({ message: 'You already reviewed this instructor' });
  }

  const review = await Review.create({
    rating,
    instructor,
    user: req.user._id,
    body,
  });
  if (review) {
    instructorFound.reviews.push(review._id);
    user.reviews.push(review._id);
    instructorFound.rating = await getInstructorAverageRating(instructorFound._id);
    await instructorFound.save();
    await user.save();
    await review.save();
    const reviewPopulated = {
      rating,
      instructor,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      body,
      createdAt: review.createdAt,
      _id: review._id,
    };
    return res.status(201).json({ reviewPopulated });
  } else {
    return res.status(400).json({ message: 'Invalid review data' });
  }
};

const getInstructorAverageRating = async (instructorId) => {
  const obj = await Review.aggregate([
    {
      $match: { instructor: instructorId },
    },
    {
      $group: {
        _id: '$instructor',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  try {
    await User.findByIdAndUpdate(instructorId, {
      rating: obj[0].averageRating,
    });
  } catch (err) {
    console.log(err);
  }
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    return res.status(400).json({ message: 'Review not found' });
  }
  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized to delete this review' });
  }
  if (review.course) {
    const course = await Course.findById(review.course);
    course.rating = await getCourseAverageRating(course._id);
    await course.save();
  }
  if (review.instructor) {
    const instructor = await User.findById(review.instructor);
    instructor.rating = await getInstructorAverageRating(instructor._id);
    await instructor.save();
  }
  await review.remove();
  res.status(200).json({ success: true, data: {} });
};

const getCourseReviews = async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate({
    path: 'reviews',
    populate: {
      path: 'user',
      select: 'firstName lastName',
    },
  });
  if (!course) {
    return res.status(400).json({ message: 'Course not found' });
  }
  res.status(200).json(course.reviews);
};
const getInstructorReviews = async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.find({ instructor: id }).populate('user', 'firstName lastName _id');

  if (!reviews) {
    return res.status(200).json([]);
  }
  res.status(200).json(reviews);
};

module.exports = {
  createReview,
  deleteReview,
  getCourseReviews,
  getInstructorReviews,
};
