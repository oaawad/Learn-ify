const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { protect } = require('../middlewares/auth');

const {
  checkoutInit,
  webhookCheckout,
  getMyPayments,
} = require('../controllers/payment.controllers');
router.get('/me', protect, catchAsync(getMyPayments));
router.post('/create-checkout-session', protect, catchAsync(checkoutInit));
router.post('/webhook', express.json({ type: 'application/json' }), catchAsync(webhookCheckout));

module.exports = router;
