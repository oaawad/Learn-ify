const Ticket = require('../models/ticket.model');
const User = require('../models/user.model');
const Course = require('../models/course.model');
const Payment = require('../models/payment.model');
const ExpressError = require('../utils/ExpressError');

const requestRefund = async (req, res) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  const user = await User.findById(req.user._id).populate('payments').populate('tickets');
  const payment = user.payments.find((payment) => payment.course.toString() === courseId);
  const requestExists = user.tickets.map((ticket) => {
    if (ticket.type === 'refund' && ticket.course.toString() === courseId) {
      return true;
    }
  });

  if (!payment) {
    throw new ExpressError('You have not purchased this course', 400);
  }
  console.log(requestExists);
  if (payment.status === 'refunded' || requestExists.includes(true)) {
    throw new ExpressError('You have already requested a refund for this course', 400);
  }
  console.log(payment);
  const refundTicket = await Ticket.create({
    user: req.user._id,
    course: courseId,
    subject: `Refund for ${course.title} `,
    messages: [
      {
        user: req.user._id,
        message: payment.amount,
        date: Date.now(),
      },
    ],
  });
  user.tickets.push(refundTicket._id);
  await user.save();
  res.status(201).json({ success: true });
};
const getMyRefundRequests = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'tickets',
    populate: {
      path: 'course',
      select: 'title',
    },
  });
  let refundRequests = user.tickets.filter(
    (ticket) =>
      ticket.type === 'refund' && (ticket.status === 'unseen' || ticket.status === 'closed')
  );
  refundRequests = user.tickets.map((ticket) => {
    if (ticket.type === 'refund')
      return {
        courseName: ticket.course.title,
        paymentTotal: parseInt(ticket.messages[0].message),
        status: ticket.status === 'unseen' ? 'Pending' : ticket.status,
        date: ticket.createdAt,
      };
  });
  res.status(200).json(refundRequests);
};
const getRefundRequests = async (req, res) => {
  const tickets = await Ticket.find({ type: 'refund' })
    .populate('course', 'title')
    .populate('user', 'email');
  const refundRequests = tickets.map((ticket) => {
    return {
      _id: ticket._id,
      email: ticket.user.email,
      courseName: ticket.course.title,
      amount: parseInt(ticket.messages[0].message),
      status: ticket.status === 'unseen' ? 'Pending' : ticket.status,
      date: ticket.createdAt,
    };
  });
  res.status(200).json(refundRequests);
};
const handleRefund = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ticket = await Ticket.findById(id);
  if (ticket.status !== 'unseen') {
    throw new ExpressError('This ticket has already been handled', 400);
  }
  if (status === 'rejected') {
    ticket.status = 'closed';
    await ticket.save();
    return res.status(200).json({ success: true });
  } else {
    ticket.status = 'resolved';
    await ticket.save();
    const user = await User.findById(ticket.user);
    user.wallet += parseInt(ticket.messages[0].message);
    const payment = await Payment.findOne({ user: user._id, course: ticket.course });
    payment.status = 'refunded';
    user.courses = user.courses.filter(
      (course) => course._id.toString() !== ticket.course.toString()
    );
    const course = await Course.findById(ticket.course);
    course.students = course.students.filter(
      (student) => student.toString() !== user._id.toString()
    );
    await course.save();
    await payment.save();
    await user.save();
    return res.status(200).json({ success: true });
  }
};
const issueTicket = async (req, res) => {
  let info = req.body;
  const { cid } = req.params;

  if (!info.category || !info.description || !info.subject) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const ticket = await Ticket.create({
    user: req.user._id,
    type: info.category,
    subject: info.subject,
    messages: [
      {
        user: req.user._id,
        message: info.description,
        date: Date.now(),
      },
    ],
    course: cid,
  });

  if (ticket) {
    const user = await User.findById(req.user._id);
    user.tickets.push(ticket._id);
    await user.save();
    return res.status(200).json(ticket);
  }
  res.status(400).json({ message: 'Ticket not created' });
};

const getMyTickets = async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id })
    .populate('course', 'title')
    .populate('messages.user', 'firstName lastName type');

  if (tickets.length == 0) {
    return res.status(204).json({ message: 'No Tickets Found' });
  }
  return res.status(200).json(tickets);
};
const getUnresolvedTickets = async (req, res) => {
  const tickets = await Ticket.find({
    status: { $in: ['unseen', 'pending'] },
    user: { $eq: req.user._id },
  });
  if (tickets.length == 0) {
    res.status(400);
    return res.status(400).json({ message: 'No Tickets Available' });
  }
  res.status(200).json(tickets);
};

const sendMessage = async (req, res) => {
  const { id, message } = req.body;
  const ticket = await Ticket.findById(id);
  if (!ticket || !message) {
    return res.status(400).json('Something went wrong.');
  }
  const sendmessage = { user: req.user._id, message: message, date: Date.now() };
  ticket.messages.push(sendmessage);
  await ticket.save();

  res.status(200).json('success');
};

const getAllTickets = async (req, res) => {
  let problems = await Ticket.find({})
    .populate('user', 'firstName lastName type')
    .populate('course', 'title')
    .populate('messages.user', 'firstName lastName type');
  let totalProblems = 0;
  const filtered = [];
  problems.map((problem) => {
    if (problem.type !== 'refund') {
      totalProblems++;
      filtered.push({
        firstName: problem.user.firstName,
        lastName: problem.user.lastName,
        course: problem.course.title,
        type: problem.type,
        status: problem.status,
        subject: problem.subject,
        createdAt: problem.createdAt,
        _id: problem._id,
      });
    }
  });
  res.status(200).json({ problems: filtered, totalProblems });
};

const getTicket = async (req, res) => {
  const id = req.params.id;
  const problem = await Ticket.findById(id)
    .populate('user', 'firstName lastName type')
    .populate('course', 'title')
    .populate('messages.user', 'firstName lastName type');

  res.status(200).json({ problem });
};
const handleTicket = async (req, res) => {
  const id = req.params.id;
  const change = req.body;
  if (change.status) {
    const updatedProblem = await Ticket.findByIdAndUpdate(id, change.status)
      .populate('user', 'firstName lastName type')
      .populate('course', 'title')
      .populate('messages.user', 'firstName lastName type');
    if (updatedProblem) {
      return res.status(200).json(updatedProblem);
    }
  } else if (change.reply) {
    const updatedProblem = await Ticket.findByIdAndUpdate(id, {
      $push: {
        messages: {
          user: req.user._id,
          message: change.reply,
          date: Date.now(),
        },
      },
    })
      .populate('user', 'firstName lastName type')
      .populate('course', 'title')
      .populate('messages.user', 'firstName lastName type');
    if (updatedProblem) {
      return res.status(200).json(updatedProblem);
    }
  }
  res.status(400).json({ message: 'Problem not found' });
};
module.exports = {
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
};
