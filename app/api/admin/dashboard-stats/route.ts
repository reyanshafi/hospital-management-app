import { NextResponse } from "next/server";
const { connectToDatabase } = require("@/lib/mongoose");

export async function GET() {
  await connectToDatabase();
  // @ts-ignore
  const Patient = require("@/models/Patient");
  // @ts-ignore
  const Doctor = require("@/models/Doctor");
  // @ts-ignore
  const Bed = require("@/models/Bed");
  // @ts-ignore
  const Alert = require("@/models/Alert");
  try {
    const [patients, doctors, beds, alerts] = await Promise.all([
      Patient.countDocuments({}),
      Doctor.countDocuments({}),
      Bed.countDocuments({ available: true }),
      Alert.countDocuments({ active: true }),
    ]);
    return NextResponse.json({ patients, doctors, beds, alerts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
} 