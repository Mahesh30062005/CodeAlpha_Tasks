const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const event = require('../controllers/eventController');
const reg = require('../controllers/regController');
const jwt = require('jsonwebtoken');

// Import Middleware
const verifyAdmin = require('../middleware/roleMiddleware');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token required');
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) { return res.status(401).send('Invalid Token'); }
};

// --- ROUTES ---

// Auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// Events
router.get('/events', event.getEvents);
router.post('/events', verifyToken, verifyAdmin, event.createEvent);
router.put('/events/:id', verifyToken, verifyAdmin, event.updateEvent); // NEW
router.delete('/events/:id', verifyToken, verifyAdmin, event.deleteEvent);

// Registrations
router.post('/registrations', verifyToken, reg.registerForEvent);
router.get('/my-registrations', verifyToken, reg.getMyRegistrations);
router.delete('/registrations/:id', verifyToken, reg.cancelRegistration);

module.exports = router;