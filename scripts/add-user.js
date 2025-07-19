const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env.local' });
const User = require('../models/User');

async function addUser({ name, email, password, role }) {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email, role });
  if (existing) {
    console.log('User already exists:', email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, role });
  await user.save();
  console.log('User created:', { name, email, role });
  process.exit(0);
}

// Change these values as needed
addUser({
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123', // Change to a secure password
  role: 'admin', // 'admin', 'doctor', or 'patient'
}).catch((err) => {
  console.error('Error creating user:', err);
  process.exit(1);
});
