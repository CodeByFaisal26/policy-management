const express = require('express');
const {
    aggregatePoliciesByUser,
    searchPolicyByusername,
} = require('../controllers/policyController');

const router = express.Router();

// Route to search for policies by username
router.get('/search', searchPolicyByusername);

// Route to aggregate policies by each user
router.get('/aggregate', aggregatePoliciesByUser);

module.exports = router;
