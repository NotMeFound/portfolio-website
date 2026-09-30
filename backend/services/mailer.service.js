// Uses Gmail SMTP with an App Password. Enable 2FA on the Gmail account, generate an App Password, and paste it into SMTP_PASS. See README.
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendContactMail = async ({ name, email, subject, message }) => {
  await transporter.sendMail({
    from: '"Karan Oli Portfolio" <' + process.env.SMTP_USER + '>',
    to: process.env.CONTACT_RECEIVER,
    replyTo: email,
    subject: '[Portfolio Contact] ' + subject,
    text: 'From: ' + name + ' <' + email + '>\n\n' + message
  });
};
