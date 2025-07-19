import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Appointment = require("@/models/Appointment");

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    // Optionally filter by doctor name if provided
    const url = new URL(req.url);
    const doctorName = url.searchParams.get("doctorName");
    const query = doctorName ? { doctor: doctorName } : {};
    const appointments = await Appointment.find(query).populate({
      path: "patient",
      select: "firstName lastName"
    });
    // Add patientName field for convenience
    const appointmentsWithPatientName = appointments.map((appt: any) => ({
      ...appt.toObject(),
      patientName: appt.patient ? `${appt.patient.firstName} ${appt.patient.lastName}` : "Patient"
    }));
    return NextResponse.json({ appointments: appointmentsWithPatientName });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
