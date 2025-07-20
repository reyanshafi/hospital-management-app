import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { connectToDatabase } from "@/lib/mongoose";
const Alert = require("@/models/Alert");
const Patient = require("@/models/Patient");
const Doctor = require("@/models/Doctor");

const criticalKeywords = [
  "chest pain", "heart attack", "can't breathe", "bleeding", "unconscious",
  "stroke", "seizure", "overdose", "suicide", "emergency", "help me",
  "dying", "severe pain", "allergic reaction", "choking", "falling",
  "broken bone", "car accident", "fire", "poisoning"
];

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }
    const { message, patientId } = await req.json();
    if (!message || !patientId) {
      return NextResponse.json({ error: 'Missing message or patientId' }, { status: 400 });
    }
    // Find patient and assigned doctor
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    const assignedDoctor = patient.doctor ? await Doctor.findOne({ name: patient.doctor }) : null;
    // Check for critical keywords
    const lowerText = message.toLowerCase();
    const isCritical = criticalKeywords.some((keyword) => lowerText.includes(keyword));
    // Create alert
    const alert = await Alert.create({
      message,
      active: true,
      createdAt: new Date(),
      patient: patient._id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctor: assignedDoctor ? assignedDoctor._id : null,
      isCritical,
    });
    // Send WhatsApp if critical
    if (isCritical && assignedDoctor && assignedDoctor.phone) {
      console.log('Attempting to send WhatsApp message to (phone):', assignedDoctor.phone);
      try {
        await sendWhatsAppMessage({
          to: assignedDoctor.phone,
          body: `CRITICAL ALERT for patient ${patient.firstName} ${patient.lastName}: ${message}`
        });
        console.log('WhatsApp message sent successfully');
      } catch (err) {
        console.error('WhatsApp send error:', err);
      }
    } else {
      if (!isCritical) console.log('Alert is not critical, WhatsApp not sent.');
      if (!assignedDoctor) console.log('No assigned doctor found, WhatsApp not sent.');
      if (assignedDoctor && !assignedDoctor.phone) console.log('Assigned doctor has no phone field, WhatsApp not sent.');
    }
    return NextResponse.json({ success: true, alert });
  } catch (e: any) {
    console.error('API error:', e);
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 