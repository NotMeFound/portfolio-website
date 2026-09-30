function validateContact(req, res, next) {
  const { name, email, subject, message } = req.body || {};
  const fields = [];

  const cleanName = typeof name === 'string' ? name.trim() : '';
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const cleanSubject = typeof subject === 'string' ? subject.trim() : '';
  const cleanMessage = typeof message === 'string' ? message.trim() : '';

  if (cleanName.length < 2) {
    fields.push({ field: 'name', message: 'Name must be at least 2 characters long.' });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(cleanEmail)) {
    fields.push({ field: 'email', message: 'Valid email is required.' });
  }

  if (cleanSubject.length < 2) {
    fields.push({ field: 'subject', message: 'Subject must be at least 2 characters long.' });
  }

  if (cleanMessage.length < 5) {
    fields.push({ field: 'message', message: 'Message must be at least 5 characters long.' });
  }

  if (fields.length > 0) {
    return res.status(400).json({ ok: false, error: 'Invalid fields', fields });
  }

  req.body.name = cleanName;
  req.body.email = cleanEmail;
  req.body.subject = cleanSubject;
  req.body.message = cleanMessage;

  next();
}

module.exports = {
  validateContact
};
