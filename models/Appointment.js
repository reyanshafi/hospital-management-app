const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctor: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
});

module.exports = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
