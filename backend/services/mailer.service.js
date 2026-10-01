// Uses Gmail SMTP with an App Password. Enable 2FA on the Gmail account, generate an App Password, and paste it into SMTP_PASS. See README.
const nodemailer = require('nodemailer');

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

exports.sendContactMail = async ({ name, email, subject, message }) => {
  const user = (process.env.SMTP_USER || '').trim();
  const rawPass = (process.env.SMTP_PASS || '').trim();
  const pass = rawPass.replace(/\s+/g, ''); // Strip spaces from Google 16-char app password
  const receiver = (process.env.CONTACT_RECEIVER || user || 'chhetrikaran.147@gmail.com').trim();

  // Active check: must have user, app password of at least 8 chars, and not be default placeholder
  const isConfigured = Boolean(
    user &&
    pass &&
    // user.includes('chhetrikaran.147@gmail.com') &&
    pass !== 'your-16-char-app-password' &&
    pass !== 'abcdefghijklmnop' &&
    pass.length >= 8
  );

  if (!isConfigured) {
    console.warn('[mailer] SMTP not configured with live credentials on server.');
    console.warn('[mailer] Please add SMTP_USER and SMTP_PASS to Vercel Environment Variables.');
    console.log('[mailer] Inbound message preserved in backup logs for:', receiver, { name, email, subject });
    return { sent: false, reason: 'smtp_unconfigured' };
  }

  try {
    // For Gmail, service: 'gmail' automatically uses port 465 SSL without STARTTLS blocking on serverless hosts
    const isCustomHost = Boolean(process.env.SMTP_HOST && process.env.SMTP_HOST !== 'smtp.gmail.com');
    const transporter = isCustomHost
      ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user, pass },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000
        })
      : nodemailer.createTransport({
          service: 'gmail',
          auth: { user, pass },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000
        });

    const info = await transporter.sendMail({
      from: `"Karan Oli Portfolio" <${user}>`,
      to: receiver,
      replyTo: email,
      subject: `[Portfolio Contact] ${subject}`,
      text: `From: ${name} <${email}>\n\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #18181b; color: #fff; padding: 16px 20px;">
            <h2 style="margin: 0; font-size: 1.15rem; font-weight: 600;">New Contact Form Message</h2>
            <p style="margin: 4px 0 0; font-size: 0.85rem; color: #a1a1aa;">Received from your portfolio website</p>
          </div>
          <div style="padding: 20px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
              <tr>
                <td style="padding: 6px 0; color: #71717a; width: 80px; font-weight: 600; font-size: 0.875rem;">Name:</td>
                <td style="padding: 6px 0; color: #18181b; font-weight: 500;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-weight: 600; font-size: 0.875rem;">Email:</td>
                <td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #2563eb; text-decoration: underline;">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #71717a; font-weight: 600; font-size: 0.875rem;">Subject:</td>
                <td style="padding: 6px 0; color: #18181b; font-weight: 500;">${escapeHtml(subject)}</td>
              </tr>
            </table>
            <div style="background-color: #f4f4f5; border-radius: 6px; padding: 16px; border: 1px solid #e4e4e7; margin-top: 8px;">
              <p style="margin: 0 0 8px; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: #71717a; letter-spacing: 0.05em;">Message</p>
              <div style="white-space: pre-wrap; color: #27272a; font-size: 0.95rem;">${escapeHtml(message)}</div>
            </div>
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f4f4f5;">
              <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent('Re: ' + subject)}" style="display: inline-block; background-color: #27272a; color: #ffffff; padding: 8px 16px; text-decoration: none; border-radius: 6px; font-size: 0.875rem; font-weight: 600;">Reply to ${escapeHtml(name)}</a>
            </div>
          </div>
        </div>
      `
    });

    console.log('[mailer] Email delivered successfully to', receiver, 'MessageId:', info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('[mailer] SMTP transmission error:', err.message);
    if (err.message && err.message.includes('535')) {
      console.error('[mailer] Google Authentication Failed: Make sure to use a 16-character App Password (not your Gmail login password).');
    }
    return { sent: false, error: err.message };
  }
};
