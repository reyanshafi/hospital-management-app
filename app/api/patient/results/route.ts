import { NextResponse } from "next/server"
import mongoose from "mongoose"
const { connectToDatabase } = require("@/lib/mongoose")
const Result = require("@/models/Result")

export async function GET(req: Request) {
  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get("patientId")
  if (!patientId) return NextResponse.json({ error: "Missing patientId" }, { status: 400 })
  const results = await Result.find({ patient: new mongoose.Types.ObjectId(patientId), status: "ready" })
  return NextResponse.json(results)
}
