import { NextResponse } from "next/server"
const { connectToDatabase } = require("@/lib/mongoose")
const Result = require("@/models/Result")

export async function GET(req: Request) {
  await connectToDatabase()
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get("patientId")
  if (!patientId) return NextResponse.json({ error: "Missing patientId" }, { status: 400 })
  const results = await Result.find({ patient: patientId }).sort({ date: -1 })
  return NextResponse.json(results)
}
