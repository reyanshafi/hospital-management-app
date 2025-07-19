import { NextResponse } from "next/server"
const { connectToDatabase } = require("@/lib/mongoose")
const Patient = require("@/models/Patient")

export async function GET(req: Request) {
  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get("patientId")
  if (!patientId) return NextResponse.json({ error: "Missing patientId" }, { status: 400 })
  const patient = await Patient.findById(patientId)
  return NextResponse.json(patient)
}
