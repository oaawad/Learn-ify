const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { protect, admin, enrolled } = require('../middlewares/auth');
const {
  loginUser,
  registerUser,
  getAllInstructors,
  getOneInstructor,
  getMe,
  getAll,
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
} = require('../controllers/user.controllers');
const { getInstructorReviews } = require('../controllers/review.controllers');

router.post('/downloadNotes', protect, catchAsync(downloadNotes));
router.get('/me/last-checkout-session', protect, catchAsync(lastCheckoutSession));
router.get('/me/course/:courseId/downloadCertificate', protect, catchAsync(downloadCertificate));
router.post('/login', catchAsync(loginUser));
router.post('/', catchAsync(registerUser));
router.post('/admins', protect, admin, catchAsync(createAdmin));
router.get('/', catchAsync(getAll));
router.get('/courses', protect, catchAsync(myCourses));
router.post('/forgotPass', catchAsync(sendMail));
router.get('/instructors', protect, catchAsync(getAllInstructors));
router.post('/instructors', protect, catchAsync(InstructorRegister));
router.get('/instructor/revenue', protect, catchAsync(getRevenue));
router.post('/instructors/invite', protect, admin, catchAsync(inviteInstructor));
router.get('/instructors/:id', catchAsync(getOneInstructor));
router.patch('/instructors/:id', catchAsync(editInstructor));

router.get('/instructors/:id/reviews', catchAsync(getInstructorReviews));
router.get('/instructors/:id/private', protect, catchAsync(getPrivateCourses));
router.put(
  '/mycourses/:courseId/lessons/:videoId',
  protect,
  enrolled,
  catchAsync(addWatchedLesson)
);
router.get('/:id', catchAsync(getEmail));
router.route('/:username').post(protect, catchAsync(setCountry)).get(protect, catchAsync(getMe));
router.patch('/changeEmail', protect, catchAsync(changeEmail));
router.patch('/changePass', protect, catchAsync(changePass));
router.patch('/resetPass/:token/:email', protect, catchAsync(resetPass));

module.exports = router;
