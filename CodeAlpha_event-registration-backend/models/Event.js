const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true }, // Max people allowed
  // We can add an 'organizer' field later if admins are specific users
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);