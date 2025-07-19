const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  message: { type: String, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  patientName: { type: String },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
  isCritical: { type: Boolean, default: false },
});

module.exports = mongoose.models.Alert || mongoose.model("Alert", AlertSchema);
