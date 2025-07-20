import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Result = require("@/models/Result");
// @ts-ignore
const Doctor = require("@/models/Doctor");

export async function GET(req: Request) {
  await connectToDatabase();
  const url = new URL(req.url);
  const doctorName = url.searchParams.get("doctorName");
  let query = {};
  if (doctorName) {
    // Find doctor by name and filter results for this doctor
    const doctor = await Doctor.findOne({ name: doctorName });
    if (doctor) {
      query = { doctor: doctor._id };
    }
  }
  const results = await Result.find(query).populate("patient").populate("doctor").sort({ date: -1 });
  return NextResponse.json({ results });
} 