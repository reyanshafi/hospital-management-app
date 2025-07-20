import { NextResponse } from "next/server"
const { connectToDatabase } = require("@/lib/mongoose")
const Patient = require("@/models/Patient")
import bcrypt from "bcryptjs"

export async function GET(req: Request) {
  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get("patientId")
  if (!patientId) return NextResponse.json({ error: "Missing patientId" }, { status: 400 })
  const patient = await Patient.findById(patientId)
  return NextResponse.json(patient)
}

export async function PUT(req: Request) {
  await connectToDatabase()
  try {
    const { patientId, firstName, lastName, phone, email, oldPassword, newPassword } = await req.json()
    if (!patientId) return NextResponse.json({ error: "Missing patientId" }, { status: 400 })
    const patient = await Patient.findById(patientId)
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    // If changing password, verify old password
    if (newPassword) {
      if (!oldPassword) return NextResponse.json({ error: "Old password required" }, { status: 400 })
      const isMatch = await bcrypt.compare(oldPassword, patient.password)
      if (!isMatch) return NextResponse.json({ error: "Old password is incorrect" }, { status: 403 })
      patient.password = await bcrypt.hash(newPassword, 10)
    }
    if (firstName) patient.firstName = firstName
    if (lastName) patient.lastName = lastName
    if (phone) patient.phone = phone
    if (email) patient.email = email
    await patient.save()
    return NextResponse.json({ message: "Profile updated" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}
