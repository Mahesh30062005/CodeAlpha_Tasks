const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String, required: true }, // Path to the file
  status: {
    type: String,
    enum: ['pending', 'interview', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

// Prevent duplicate applications for the same job
appSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', appSchema);