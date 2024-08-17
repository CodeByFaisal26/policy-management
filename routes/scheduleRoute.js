const express = require('express');
const { scheduleMessage } = require('../controllers/scheduleController');

const router = express.Router();

// Route to schedule a message
router.post('/schedule', scheduleMessage);

module.exports = router;
