const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  doctor: { type: String },
  bed: { type: String },
  status: { type: String, default: "Admitted" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
