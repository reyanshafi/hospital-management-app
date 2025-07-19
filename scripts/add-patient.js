const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './.env.local' });
const Patient = require('../models/Patient');

async function addPatient({ firstName, lastName, age, gender, phone, doctor, bed, email, password }) {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await Patient.findOne({ email });
  if (existing) {
    console.log('Patient already exists:', email);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const patient = new Patient({ firstName, lastName, age, gender, phone, doctor, bed, email, password: hashedPassword });
  await patient.save();
  console.log('Patient created:', { firstName, lastName, email });
  process.exit(0);
}

// Change these values as needed
addPatient({
  firstName: 'John',
  lastName: 'Doe',
  age: 30,
  gender: 'Male',
  phone: '+1234567890',
  doctor: 'Dr. Smith',
  bed: 'A-101',
  email: 'john.doe@example.com',
  password: 'patient123', // Change to a secure password
}).catch((err) => {
  console.error('Error creating patient:', err);
  process.exit(1);
});
