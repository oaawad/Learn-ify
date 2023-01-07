const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { protect, admin } = require('../middlewares/auth');
const {
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
} = require('../controllers/corporate.controllers');

router
  .route('/')
  .post(protect, admin, catchAsync(createCorporate))
  .get(protect, admin, catchAsync(getCorporates));
// router.get('/students', protect, admin, catchAsync(getStudents));
router.route('/check').post(protect, admin, catchAsync(checkEmail));
router.post('/student-register', protect, catchAsync(registerStudent));
router.get('/courseRequests', protect, admin, catchAsync(getRequests));
router
  .route('/request')
  .get(protect, admin, catchAsync(getRequests))
  .post(protect, catchAsync(createRequest));

router.put('/request/:id', protect, admin, catchAsync(updateRequest));

router
  .route('/:id')
  .put(protect, admin, catchAsync(updateCorporate))
  .delete(protect, admin, catchAsync(deleteCorporate))
  .post(protect, admin, catchAsync(inviteStudents));

module.exports = router;
