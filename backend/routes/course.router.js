const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { protect, admin } = require('../middlewares/auth');
const {
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
} = require('../controllers/course.controllers');
const { getCourseReviews } = require('../controllers/review.controllers');

router.get('/', catchAsync(getAll)); // Render User Profile   R
router.get('/names', catchAsync(getAllNames)); // Render User Profile   R
router.post('/', protect, catchAsync(createCourse));
router.get('/toprated', catchAsync(getTopRatedCourses));
router.get('/trending', catchAsync(getTrendingCourses));
router.get('/subjects', catchAsync(getSubjects));
router.get('/draft/:id', catchAsync(viewPrivateCourse));
router.post('/promotion', protect, admin, catchAsync(adminPromotion)); // Render Course Page   R
router.get('/promotion', protect, admin, catchAsync(getPromotions)); // Render Course Page   R
router
  .route('/:id')
  .get(catchAsync(viewCourse))
  .patch(protect, catchAsync(editCourse))
  .delete(protect, catchAsync(deleteCourse));
router.get('/:id/reviews', catchAsync(getCourseReviews));
router
  .route('/:id/promotion')
  .post(protect, catchAsync(createPromotion))
  .delete(protect, catchAsync(deletePromotion));

module.exports = router;
