import { NextResponse } from "next/server"
const { connectToDatabase } = require("@/lib/mongoose")
const Prescription = require("@/models/Prescription")

export async function GET(req: Request) {
  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get("patientId")
  if (!patientId) return NextResponse.json({ error: "Missing patientId" }, { status: 400 })
  const prescriptions = await Prescription.find({ patient: patientId }).sort({ expires: 1 })
  return NextResponse.json(prescriptions)
}
