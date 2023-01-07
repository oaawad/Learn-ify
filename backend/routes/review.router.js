const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { protect, admin, enrolled } = require('../middlewares/auth');
const {
  createReview,
  deleteReview,
} = require('../controllers/review.controllers');

router.post('/', protect, catchAsync(createReview));
router.delete('/:id', protect, catchAsync(deleteReview));

module.exports = router;
