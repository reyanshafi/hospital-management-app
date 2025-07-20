import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Patient = require("@/models/Patient");
import bcrypt from "bcryptjs";
// @ts-ignore
const Bed = require("@/models/Bed");

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { firstName, lastName, age, gender, phone, doctor, bed, email, password } = await req.json();
    if (!firstName || !lastName || !age || !gender || !phone || !doctor || !bed || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    // Check if patient already exists
    const existing = await Patient.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Patient with this email already exists" }, { status: 409 });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const patient = await Patient.create({ firstName, lastName, age, gender, phone, doctor, bed, email, password: hashedPassword });
    // Mark the bed as unavailable and assign the patient
    await Bed.findOneAndUpdate(
      { number: bed },
      { available: false, patient: patient._id }
    );
    return NextResponse.json({ message: "Patient created successfully", patient: { firstName, lastName, email } }, { status: 201 });
  } catch (err: any) {
    console.log("Add Patient Error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
