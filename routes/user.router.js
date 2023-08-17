const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { protect, admin, enrolled } = require('../middlewares/auth');
const joiSchemas = require('../utils/joiSchemas');
const validate = require('../middlewares/validationMiddleware');
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

router.post('/login', validate(joiSchemas.userLogin, 'body'), catchAsync(loginUser));
router.post('/', validate(joiSchemas.userRegister, 'body'), catchAsync(registerUser));

router.post(
  '/admins',
  validate(joiSchemas.adminCreate, 'body'),
  protect,
  admin,
  catchAsync(createAdmin)
);
router.get('/', protect, admin, catchAsync(getAll));

router.post(
  '/downloadNotes',
  validate(joiSchemas.downloadNotes, 'body'),
  protect,
  catchAsync(downloadNotes)
);
router.get('/me/last-checkout-session', protect, catchAsync(lastCheckoutSession));
router.get('/me/course/:courseId/downloadCertificate', protect, catchAsync(downloadCertificate));

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
