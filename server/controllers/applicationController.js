const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
exports.applyForJob = async (req, res) => {
    if (req.user.role !== 'candidate') {
        return res.status(403).json({ message: 'Only candidates can apply for jobs' });
    }
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const existingApplication = await Application.findOne({ job: req.params.jobId, candidate: req.user.id });
        if (existingApplication) return res.status(400).json({ message: 'You have already applied for this job' });

        const application = new Application({
            job: req.params.jobId,
            candidate: req.user.id,
            resume: req.body.resume,
            coverLetter: req.body.coverLetter
        });
        await application.save();

        // Mock Email Notification
        console.log(`Sending email to employer about new application for job ${job.title} from ${req.user.email}`);

        res.status(201).json(application);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get applications for a job (Employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
exports.getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.employer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view these applications' });
        }

        const applications = await Application.find({ job: req.params.jobId }).populate('candidate', 'name email resume skills');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get my applications (Candidate)
// @route   GET /api/applications/my
// @access  Private (Candidate)
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ candidate: req.user.id }).populate('job', 'title company location');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
