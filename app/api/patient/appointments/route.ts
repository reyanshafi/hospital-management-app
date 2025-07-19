import { NextResponse } from "next/server"
const { connectToDatabase } = require("@/lib/mongoose")
const Appointment = require("@/models/Appointment")

export async function GET(req: Request) {
  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get("patientId")
  if (!patientId) return NextResponse.json({ error: "Missing patientId" }, { status: 400 })
  const appointments = await Appointment.find({ patient: patientId }).sort({ date: 1 })
  return NextResponse.json(appointments)
}

export async function POST(req: Request) {
  await connectToDatabase()
  try {
    const { patient, doctor, date, time, type } = await req.json()
    if (!patient || !doctor || !date || !time || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const appointment = await Appointment.create({
      patient,
      doctor,
      date,
      time,
      type,
      status: "pending"
    })
    return NextResponse.json({ message: "Appointment request sent for admin approval", appointment }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Server error" }, { status: 500 })
  }
}
