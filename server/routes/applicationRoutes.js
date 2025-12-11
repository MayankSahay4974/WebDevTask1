const express = require('express');
const { applyForJob, getJobApplications, getMyApplications } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:jobId', protect, applyForJob);
router.get('/job/:jobId', protect, getJobApplications); // Employer
router.get('/my', protect, getMyApplications); // Candidate

module.exports = router;
