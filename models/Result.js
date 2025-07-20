const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  status: { type: String, required: true },
  report: { type: String, required: true },
  date: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  category: { type: String },
  findings: { type: String },
  impression: { type: String },
  results: [
    {
      parameter: String,
      value: String,
      unit: String,
      range: String,
      status: String,
    }
  ],
});

module.exports = mongoose.models.Result || mongoose.model("Result", ResultSchema);
