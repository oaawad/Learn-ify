const User = require('../models/user.model');
const Course = require('../models/course.model');
const Payment = require('../models/payment.model');

const Stripe = require('stripe');
require('dotenv').config();
const stripe = Stripe(process.env.STRIPE_KEY);

const checkoutInit = async (req, res) => {
  const { course, currency } = req.body;
  let amount = course.promotion
    ? Math.round(((course.price * (100 - course.promotion.amount)) / 100) * currency.rate * 100)
    : Math.round(course.price * currency.rate * 100);

  const user = await User.findById(req.user._id);
  let wallet = Math.round(req.user.wallet * currency.rate * 100);
  const customer = await stripe.customers.create({
    metadata: {
      user: req.user._id.toString(),
      course: course._id,
      total: course.promotion
        ? (course.price * (100 - course.promotion.amount)) / 100
        : course.price,
      promotion: course.promotion ? course.promotion.amount : null,
    },
  });
  if (wallet > 0) {
    if (wallet < amount) {
      console.log(wallet, amount);
      wallet = await stripe.coupons.create({
        amount_off: wallet,
        currency: currency.currency,
        duration: 'once',
        name: `Paid from wallet`,
      });
    } else {
      console.log('there');
      wallet = await stripe.coupons.create({
        amount_off: Math.round(amount - 50 * currency.rate),
        currency: currency.currency,
        duration: 'once',
        name: `Paid from wallet`,
      });
    }
  }
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: currency.currency,
          product_data: {
            name: course.title,
            images: [`https://img.youtube.com/vi/${course.preview}/hqdefault.jpg`],
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    payment_method_types: ['card'],
    mode: 'payment',
    customer: customer.id,
    discounts: [{ coupon: wallet !== 0 ? wallet.id : course.promotion?.coupon }],
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/courses`,
  });

  res.send({ url: session.url });
};

const handlePayment = async (metadata) => {
  const user = await User.findById(metadata.user);
  const course = await Course.findById(metadata.course);
  const instructor = await User.findById(course.instructor);
  const payment = await Payment.create({
    user: user._id,
    course: course._id,
    amount: metadata.total,
    promotion: metadata.promotion,
  });
  user.payments.push(payment._id);
  user.courses.push(course._id);
  await user.save();
  course.students.push(user._id);
  course.payments.push(payment._id);
  course.studentsCount = course.studentsCount + 1;
  await course.save();
  instructor.payments.push(payment._id);
  await instructor.save();
};
const webhookCheckout = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  // let event;
  // try {
  //   event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  // } catch (err) {
  //   console.log(`⚠️  Webhook signature verification failed:  ${err}`);
  //   res.sendStatus(400);
  //   return;
  // }
  // Handle the event
  if (req.body.type === 'checkout.session.completed') {
    const customer = await stripe.customers.retrieve(req.body.data.object.customer);
    handlePayment(customer.metadata);
  }

  // Return a 200 res to acknowledge receipt of the event
  res.send();
};

const getMyPayments = async (req, res) => {
  const payments = await Payment.find({ user: req.user._id }).populate('course', 'title');
  const rows = payments.map((payment) => {
    const { course, amount, promotion, createdAt, status } = payment;
    return {
      courseName: course.title,
      paymentTotal: amount,
      status,
      date: createdAt,
    };
  });
  res.status(200).json(rows);
};

module.exports = {
  checkoutInit,
  webhookCheckout,
  getMyPayments,
};
