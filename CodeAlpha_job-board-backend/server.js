require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Create uploads folder if missing
if (!fs.existsSync('./uploads')){
    fs.mkdirSync('./uploads');
}

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Make resume files public/downloadable

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/api', require('./routes/api'));

// ADD THIS PART:
app.get('/', (req, res) => {
  res.send('Job Board Backend is Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServer Running! Access it here: http://localhost:${PORT}`);
});