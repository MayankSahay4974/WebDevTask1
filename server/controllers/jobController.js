const Job = require('../models/Job');

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Employer)
exports.createJob = async (req, res) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({ message: 'Only employers can post jobs' });
    }
    try {
        const job = new Job({ ...req.body, employer: req.user.id });
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    const { keyword } = req.query;
    try {
        const query = {};
        if (keyword) {
            query.title = { $regex: keyword, $options: 'i' };
        }
        const jobs = await Job.find(query).populate('employer', 'name companyName').sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employer', 'name companyName');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
