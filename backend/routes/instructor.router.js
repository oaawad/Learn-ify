const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { protect, admin } = require('../middlewares/auth');
const { getInstructorReviews } = require('../controllers/review.controllers');
const {
  getOneInstructor,
  getAllInstructors,
  editInstructor,
  getPrivateCourses,
  getRevenue,
  inviteInstructor,
  InstructorRegister,
} = require('../controllers/instructor.controllers');
router.get('/', protect, catchAsync(getAllInstructors));
router.post('/', protect, catchAsync(InstructorRegister));
router.get('/revenue', protect, catchAsync(getRevenue));
router.post('/invite', protect, admin, catchAsync(inviteInstructor));
router.get('/:id', catchAsync(getOneInstructor));
router.patch('/:id', catchAsync(editInstructor));
router.get('/:id/private', protect, catchAsync(getPrivateCourses));
router.get('/:id/reviews', catchAsync(getInstructorReviews));

module.exports = router;
