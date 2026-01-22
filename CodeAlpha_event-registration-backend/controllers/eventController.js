const Event = require('../models/Event');
const Registration = require('../models/Registration');

exports.getEvents = async (req, res) => {
  try {
    // Sort events: Nearest date first
    const events = await Event.find().sort({ date: 1 }).lean(); 

    const eventsWithStats = await Promise.all(events.map(async (event) => {
      const count = await Registration.countDocuments({ event: event._id });
      return { 
        ...event, 
        booked: count,
        isSoldOut: count >= event.capacity,
        isPast: new Date(event.date) < new Date() // Flag to mark old events
      };
    }));

    res.json(eventsWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NEW: Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Registration.deleteMany({ event: id });
    await Event.findByIdAndDelete(id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};