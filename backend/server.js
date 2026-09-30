require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { contactLimiter } = require('./middleware/rateLimit');
const contactRoutes = require('./routes/contact.routes');
const projectsRoutes = require('./routes/projects.routes');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');
const frontendPath = path.join(__dirname, '../frontend');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));

// Serve static frontend assets
app.use(express.static(frontendPath));

app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/projects', projectsRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
});

// Fallback for unknown API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ ok: false, error: 'Endpoint not found' });
});

// SPA/Frontend Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('[server error]', err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
