const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  specialty: { type: String },
});

module.exports = mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
