"use server"

// Mock SMS service - replace with actual SMS provider like Twilio
async function sendSMS(phoneNumber: string, message: string) {
  console.log(`SMS sent to ${phoneNumber}: ${message}`)
  // In production, integrate with Twilio, AWS SNS, or similar service
  return { success: true, messageId: `msg_${Date.now()}` }
}

// Critical keywords that trigger immediate alerts
const criticalKeywords = [
  "chest pain",
  "heart attack",
  "can't breathe",
  "bleeding",
  "unconscious",
  "stroke",
  "seizure",
  "overdose",
  "suicide",
  "emergency",
  "help me",
  "dying",
  "severe pain",
  "allergic reaction",
  "choking",
]

export async function sendEmergencyAlert(formData: FormData) {
  const message = formData.get("message") as string
  const patientId = formData.get("patientId") as string
  const type = formData.get("type") as string // "text" or "audio"

  if (!message || !patientId) {
    return { error: "Missing required information" }
  }

  // Check for critical keywords
  const lowerMessage = message.toLowerCase()
  const detectedKeywords = criticalKeywords.filter((keyword) => lowerMessage.includes(keyword))

  const isCritical = detectedKeywords.length > 0

  // Get patient and assigned doctor info (mock data)
  const patientInfo = {
    name: "John Doe",
    phone: "+1234567890",
    assignedDoctor: {
      name: "Dr. Smith",
      phone: "+1987654321",
      email: "dr.smith@medicare.com",
    },
  }

  // Create alert record
  const alert = {
    id: Date.now(),
    patientId,
    patientName: patientInfo.name,
    message,
    type,
    severity: isCritical ? "Critical" : "Medium",
    detectedKeywords,
    timestamp: new Date().toISOString(),
    status: "Active",
  }

  // If critical, send immediate SMS to doctor
  if (isCritical) {
    const smsMessage = `🚨 CRITICAL EMERGENCY ALERT 🚨
Patient: ${patientInfo.name} (ID: ${patientId})
Message: ${message}
Keywords: ${detectedKeywords.join(", ")}
Time: ${new Date().toLocaleString()}
Please respond immediately.`

    await sendSMS(patientInfo.assignedDoctor.phone, smsMessage)
  }

  // Store alert in database (mock)
  console.log("Emergency alert created:", alert)

  return {
    success: true,
    alertId: alert.id,
    isCritical,
    detectedKeywords,
  }
}

export async function processAudioAlert(audioBlob: Blob, patientId: string) {
  // In production, you would:
  // 1. Upload audio to cloud storage
  // 2. Use speech-to-text service (Google Cloud Speech, AWS Transcribe, etc.)
  // 3. Process the transcript for keywords

  // Mock transcript processing
  const mockTranscript = "I'm having severe chest pain and trouble breathing"

  const formData = new FormData()
  formData.append("message", mockTranscript)
  formData.append("patientId", patientId)
  formData.append("type", "audio")

  return await sendEmergencyAlert(formData)
}
