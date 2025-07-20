const mongoose = require("mongoose");

const BedSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  available: { type: Boolean, default: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  ward: { type: String, default: "General" }, // New field for ward assignment
});

module.exports = mongoose.models.Bed || mongoose.model("Bed", BedSchema);
