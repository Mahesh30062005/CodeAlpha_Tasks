const Application = require('../models/Application');

// Apply for a job (Upload Resume)
exports.applyForJob = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Resume file required' });

    const { jobId } = req.body;
    const userId = req.user.id;

    await Application.create({
      job: jobId,
      candidate: userId,
      resume: req.file.path
    });

    res.status(201).json({ message: 'Application submitted!' });
  } catch (error) {
    if(error.code === 11000) return res.status(400).json({ message: 'Already applied' });
    res.status(500).json({ error: error.message });
  }
};

// Get Applicants for a specific Job (Employer Only)
exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const apps = await Application.find({ job: jobId }).populate('candidate', 'name email');
        res.json(apps);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// NEW: Get applications for the logged-in Candidate
exports.getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        // Populate 'job' so we see the Job Title, not just the ID
        const apps = await Application.find({ candidate: userId }).populate('job');
        res.json(apps);
    } catch (error) { res.status(500).json({ error: error.message }); }
};

// Update Application Status (Accept/Reject)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(app);
    } catch (error) { res.status(500).json({ error: error.message }); }
};