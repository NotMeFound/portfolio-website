exports.getAllProjects = (req, res) => {
  try {
    const projects = require('../data/projects.json');
    res.json({ ok: true, projects });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Could not load projects.' });
  }
};
