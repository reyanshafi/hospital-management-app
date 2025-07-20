import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Patient = require("@/models/Patient");

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    // Optionally filter by doctor name if provided
    const url = new URL(req.url);
    const doctorName = url.searchParams.get("doctorName");
    const query = doctorName ? { doctor: doctorName } : {};
    const patients = await Patient.find(query);
    return NextResponse.json({ patients });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
