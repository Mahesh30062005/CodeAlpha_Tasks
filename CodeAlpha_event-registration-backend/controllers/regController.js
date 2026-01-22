const Registration = require('../models/Registration');
const Event = require('../models/Event');

// ... (Keep registerForEvent as it was in the previous step) ...
exports.registerForEvent = async (req, res) => {
    // PASTE YOUR PREVIOUS LOGIC HERE (Checking capacity)
    // Ensure you use the code from the previous "Sold Out" step
    try {
        const { eventId } = req.body;
        const userId = req.user.id; 
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const registeredCount = await Registration.countDocuments({ event: eventId });
        if (registeredCount >= event.capacity) return res.status(400).json({ message: 'Event is Sold Out!' });

        await Registration.create({ user: userId, event: eventId });
        res.status(201).json({ message: 'Registered successfully' });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: 'Already registered' });
        res.status(500).json({ error: error.message });
    }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await Registration.find({ user: userId }).populate('event');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NEW: Cancel Registration
exports.cancelRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id;
    const userId = req.user.id;
    
    // Ensure the registration belongs to the user trying to delete it
    const deleted = await Registration.findOneAndDelete({ _id: registrationId, user: userId });
    
    if (!deleted) return res.status(404).json({ message: 'Registration not found' });
    
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};