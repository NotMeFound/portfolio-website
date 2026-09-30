// Uses Gmail SMTP with an App Password. Enable 2FA on the Gmail account, generate an App Password, and paste it into SMTP_PASS. See README.
const nodemailer = require('nodemailer');

exports.sendContactMail = async ({ name, email, subject, message }) => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const receiver = process.env.CONTACT_RECEIVER || user || 'chhetrikaran.147@gmail.com';

  const isConfigured = Boolean(
    user &&
    pass &&
    !user.includes('example.com') &&
    pass !== 'your-16-char-app-password' &&
    pass.trim().length > 0
  );

  if (!isConfigured) {
    console.log('[mailer] SMTP not configured with live credentials. Inbound message saved to logs:', { name, email, subject });
    return { sent: false, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user,
        pass
      }
    });

    const info = await transporter.sendMail({
      from: `"Karan Oli Portfolio" <${user}>`,
      to: receiver,
      replyTo: email,
      subject: `[Portfolio Contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`
    });

    console.log('[mailer] Email delivered successfully:', info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('[mailer] SMTP transmission error:', err.message);
    return { sent: false, error: err.message };
  }
};
