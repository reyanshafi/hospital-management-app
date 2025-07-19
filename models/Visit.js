const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  type: { type: String, required: true },
  doctor: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, required: true },
});

module.exports = mongoose.models.Visit || mongoose.model("Visit", VisitSchema);
