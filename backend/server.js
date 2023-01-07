//Require Dependences
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
//Require utils
const mongoConnect = require('./utils/mongoConnect');
const ExpressError = require('./utils/ExpressError');

//Require Routes
const userRouter = require('./routes/user.router');
const courseRouter = require('./routes/course.router');
const reviewRouter = require('./routes/review.router');
const paymentRouter = require('./routes/payment.router');
const corporateRouter = require('./routes/corporate.router');
const ticketRouter = require('./routes/ticket.router');

const app = express();
const db = mongoConnect('mongodb+srv://omar:1234@cluster0.mpn2cso.mongodb.net/?retryWrites=true&w=majority');

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('dist'));
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/corporate', corporateRouter);
app.use('/api/ticket', ticketRouter);

app.all('*', (req, res, next) => {
    res.sendFile('index.html', { root: './dist' });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode ? err.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
  });
});
app.listen(5555, () => {
  console.log(`Server is up on Port ${process.env.PORT}`);
});
