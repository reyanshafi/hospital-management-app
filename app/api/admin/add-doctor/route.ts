import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Doctor = require("@/models/Doctor");
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, email, password, phone, specialty } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    // Check if doctor already exists
    const existing = await Doctor.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Doctor with this email already exists" }, { status: 409 });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({ name, email, password: hashedPassword, phone, specialty });
    return NextResponse.json({ message: "Doctor created successfully", doctor: { name, email } }, { status: 201 });
  } catch (err: any) {
    console.log("Add Doctor Error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
