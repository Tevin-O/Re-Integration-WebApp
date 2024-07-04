const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});

exports.sendEmail = functions.https.onCall((data, context) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: data.to,
    subject: data.subject,
    text: data.text
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return { error: error.toString() };
    }
    return { success: true };
  });
});
