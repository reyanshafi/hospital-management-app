import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Appointment = require("@/models/Appointment");

export async function GET() {
  await connectToDatabase();
  const statusCounts = await Appointment.aggregate([
    {
      $group: {
        _id: "$status",
        value: { $sum: 1 }
      }
    }
  ]);
  // Map to { name, value }
  const result = statusCounts.map((s: any) => ({ name: s._id.charAt(0).toUpperCase() + s._id.slice(1), value: s.value }));
  return NextResponse.json(result);
} 