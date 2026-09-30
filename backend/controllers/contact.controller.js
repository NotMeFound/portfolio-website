const fs = require('fs');
const path = require('path');
const { sendContactMail } = require('../services/mailer.service');

const logFilePath = path.join(__dirname, '..', 'logs', 'contact.log');

exports.sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Append to backup log file asynchronously
  const timestamp = new Date().toISOString();
  const snippet = message.replace(/\r?\n/g, ' ').slice(0, 100);
  const logLine = `[${timestamp}] FROM ${email} (${name}) — ${subject} — ${snippet}\n`;

  try {
    fs.appendFile(logFilePath, logLine, (err) => {
      if (err) console.error('[contact log]', err.message);
    });
  } catch (logErr) {
    console.error('[contact log]', logErr.message);
  }

  try {
    await sendContactMail({ name, email, subject, message });
    return res.status(200).json({ ok: true, message: 'Message sent. I will reply soon.' });
  } catch (err) {
    console.error('[contact]', err);
    return res.status(500).json({ ok: false, error: 'Could not send message. Please email directly.' });
  }
};
