const express = require('express');
const { validateContact } = require('../middleware/validate');
const { sendMessage } = require('../controllers/contact.controller');

const router = express.Router();

router.post('/', validateContact, sendMessage);

module.exports = router;
