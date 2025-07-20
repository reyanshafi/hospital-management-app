import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Prescription = require("@/models/Prescription");
// @ts-ignore
const Patient = require("@/models/Patient");

export async function GET(req: Request) {
  await connectToDatabase();
  const url = new URL(req.url);
  const doctorName = url.searchParams.get("doctorName");
  const query = doctorName ? { doctor: doctorName } : {};
  const prescriptions = await Prescription.find(query).populate("patient").sort({ expires: -1 });
  return NextResponse.json({ prescriptions });
} 