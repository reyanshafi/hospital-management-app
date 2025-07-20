import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
// @ts-ignore
const Patient = require("@/models/Patient");

export async function GET() {
  await connectToDatabase();
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 13); // last 14 days
  start.setHours(0, 0, 0, 0);

  // Aggregate patients by creation date
  const admissions = await Patient.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: today }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Fill in missing days
  const result: { date: string; count: number }[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const found = admissions.find((a: any) => a._id === dateStr);
    result.push({ date: dateStr, count: found ? found.count : 0 });
  }

  return NextResponse.json(result);
} 