// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');

const seedDB = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // 2. Clear existing data (Optional: starts fresh every time)
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});

    // 3. Create a Test Admin/User
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });

    const normalUser = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "user"
    });

    console.log('Users created! (Password: 123456)');

    // 4. Create Test Events
    await Event.create([
      {
        title: "Tech Summit 2026",
        description: "The biggest tech meetup in Pune.",
        date: new Date('2026-02-15'),
        location: "SPPU Auditorium",
        capacity: 100
      },
      {
        title: "Java Spring Boot Workshop",
        description: "Hands-on coding session.",
        date: new Date('2026-03-10'),
        location: "Online",
        capacity: 50
      }
    ]);

    console.log('Events created!');
    
    // 5. Exit
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();