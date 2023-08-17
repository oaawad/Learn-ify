const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const CorporateStudent = require('../models/corporateStudent.model');

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        req.user = await CorporateStudent.findById(decoded.id).select('-password');
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.type === 'administrator') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an administrator');
  }
};
const enrolled = (req, res, next) => {
  const { courseId } = req.params;
  let enrolled = false;
  if (req.user) {
    req.user.courses.map((course) => {
      if (course._id.toString() === courseId) {
        enrolled = true;
      }
    });
    if (enrolled) {
      next();
    } else {
      res.status(401).json({ message: 'You are not enrolled in this course' });
    }
  }
};
const reviewOwner = (req, res, next) => {
  const { id } = req.params;
  if (req.user) {
    req.user.reviews.map((review) => {
      if (review._id.toString() === id) {
        next();
      } else {
        res.status(401);
        throw new Error('You are not the owner of this review');
      }
    });
  }
};

module.exports = { protect, admin, enrolled, reviewOwner };
