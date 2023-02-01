const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { protect, admin, enrolled } = require('../middlewares/auth');
const {
  loginUser,
  registerUser,
  getMe,
  getAll,
  createAdmin,
  setCountry,
  myCourses,
  addWatchedLesson,
  changePass,
  changeEmail,
  sendMail,
  resetPass,
  getEmail,
  downloadNotes,
  downloadCertificate,
  lastCheckoutSession,
} = require('../controllers/user.controllers');

router.post('/downloadNotes', protect, catchAsync(downloadNotes));
router.get('/me/last-checkout-session', protect, catchAsync(lastCheckoutSession));
router.get('/me/course/:courseId/downloadCertificate', protect, catchAsync(downloadCertificate));
router.post('/login', catchAsync(loginUser));
router.post('/', catchAsync(registerUser));
router.post('/admins', protect, admin, catchAsync(createAdmin));
router.get('/', protect, admin, catchAsync(getAll));
router.get('/courses', protect, catchAsync(myCourses));
router.post('/forgotPass', catchAsync(sendMail));

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
