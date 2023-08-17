const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { protect, admin, enrolled } = require('../middlewares/auth');
const {
  requestRefund,
  getRefundRequests,
  getMyRefundRequests,
  handleRefund,
  issueTicket,
  getMyTickets,
  getUnresolvedTickets,
  getAllTickets,
  getTicket,
  handleTicket,
  sendMessage,
} = require('../controllers/ticket.controllers');

router.post('/refund', protect, catchAsync(requestRefund));
router.get('/refund', protect, admin, catchAsync(getRefundRequests));
router.get('/myRefund', protect, catchAsync(getMyRefundRequests));
router.patch('/refund/:id', protect, admin, catchAsync(handleRefund));

router.post('/issue/:cid', protect, catchAsync(issueTicket));
router.get('/my-tickets', protect, catchAsync(getMyTickets));
router.get('/my-tickets/unresolved/', protect, catchAsync(getUnresolvedTickets));
router.patch('/sendMessage', protect, catchAsync(sendMessage));

router.get('/', catchAsync(getAllTickets));
router.get('/:id', protect, admin, catchAsync(getTicket));
router.patch('/:id', protect, admin, catchAsync(handleTicket));

module.exports = router;
