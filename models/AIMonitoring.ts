import mongoose, { Schema, model, models } from 'mongoose';

const AIMonitoringSchema = new Schema({
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: { type: String, required: true },
  heartRate: { type: Number, required: true },
  spo2: { type: Number, required: true },
  temperature: { type: Number, required: true },
  status: { type: String, enum: ['normal', 'warning', 'critical'], default: 'normal' },
  timestamp: { type: Date, default: Date.now },
});

export default models.AIMonitoring || model('AIMonitoring', AIMonitoringSchema); 