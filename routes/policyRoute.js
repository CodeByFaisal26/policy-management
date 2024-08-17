const express = require('express');
const {
    searchPolicyByUsername,
    aggregatePoliciesByUser,
} = require('../controllers/policyController');

const router = express.Router();

// Route to search for policies by username
router.get('/search', searchPolicyByUsername);

// Route to aggregate policies by each user
router.get('/aggregate', aggregatePoliciesByUser);

module.exports = router;
