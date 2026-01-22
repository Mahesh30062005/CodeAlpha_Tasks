const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');

const auth = require('../controllers/authController');
const job = require('../controllers/jobController');
const appCtrl = require('../controllers/appController');

// --- MULTER SETUP (File Uploads) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

// PDF Only Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// --- MIDDLEWARE ---
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token required');
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) { return res.status(401).send('Invalid Token'); }
};

const verifyEmployer = (req, res, next) => {
    if (req.user.role !== 'employer') return res.status(403).json({ message: 'Employers Only' });
    next();
};

// --- ROUTES ---

// Auth
router.post('/auth/register', auth.register);
router.post('/auth/login', auth.login);

// Jobs
router.get('/jobs', job.getJobs); // Supports ?search=X&category=Y
router.post('/jobs', verifyToken, verifyEmployer, job.createJob);
router.get('/my-posted-jobs', verifyToken, verifyEmployer, job.getMyJobs);

// Applications
router.post('/apply', verifyToken, upload.single('resume'), appCtrl.applyForJob);
router.get('/my-applications', verifyToken, appCtrl.getMyApplications); // NEW ROUTE
router.get('/jobs/:jobId/applications', verifyToken, verifyEmployer, appCtrl.getJobApplications);
router.put('/applications/:id/status', verifyToken, verifyEmployer, appCtrl.updateStatus);

module.exports = router;