const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  medication: { type: String, required: true },
  doctor: { type: String, required: true },
  refills: { type: Number, required: true },
  expires: { type: String, required: true },
});

module.exports = mongoose.models.Prescription || mongoose.model("Prescription", PrescriptionSchema);
