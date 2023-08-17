const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async function sendEmail(mailOptions) {
  mailOptions.from = process.env.Mail;
  const resp = await wrappedSendMail(mailOptions);
  return resp;
};
async function wrappedSendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.Mail,
        pass: process.env.Pass,
      },
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      } else {
        resolve(true);
      }
    });
  });
}
