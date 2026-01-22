const Job = require('../models/Job');

// Get all jobs (with optional filters)
exports.getJobs = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (search) {
        query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const jobs = await Job.find(query).populate('employer', 'companyName');
    res.json(jobs);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Create a job (Employer Only)
exports.createJob = async (req, res) => {
  try {
    const jobData = { ...req.body, employer: req.user.id };
    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

// Get jobs posted by the logged-in Employer
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id });
        res.json(jobs);
    } catch (error) { res.status(500).json({ error: error.message }); }
};