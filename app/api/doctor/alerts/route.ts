import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Alert = require("@/models/Alert");
// @ts-ignore
const Doctor = require("@/models/Doctor");

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const doctorEmail = url.searchParams.get("doctorEmail");
    let query = {};
    if (doctorEmail) {
      const doctor = await Doctor.findOne({ email: doctorEmail });
      if (doctor) {
        query = { doctor: doctor._id };
      } else {
        return NextResponse.json({ alerts: [] });
      }
    }
    const alerts = await Alert.find(query);
    return NextResponse.json({ alerts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
