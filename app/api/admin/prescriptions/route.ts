import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Prescription = require("@/models/Prescription");
// @ts-ignore
const Patient = require("@/models/Patient");
// @ts-ignore
const Doctor = require("@/models/Doctor");

export async function GET() {
  await connectToDatabase();
  const prescriptions = await Prescription.find({}).populate("patient").populate("doctor").sort({ expires: -1 });
  return NextResponse.json({ prescriptions });
}

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { patient, doctor, medication, dosage, refills, expires, status } = await req.json();
    if (!patient || !doctor || !medication || !dosage || !refills || !expires) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const prescription = await Prescription.create({ patient, doctor, medication, dosage, refills, expires, status: status || "active" });
    return NextResponse.json({ message: "Prescription created", prescription });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
} 