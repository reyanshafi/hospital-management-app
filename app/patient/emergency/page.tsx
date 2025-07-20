"use client"

import { useState, useRef, useEffect } from "react"
import { PatientSidebar } from "@/components/patient-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Mic, MicOff, Send, Phone, Clock, CheckCircle, Shield, MapPin } from "lucide-react"
import { useRouter } from "next/navigation";
import useSWR from "swr";

// Critical keywords that trigger immediate alerts
const criticalKeywords = [
  "chest pain", "heart attack", "can't breathe", "bleeding", "unconscious",
  "stroke", "seizure", "overdose", "suicide", "emergency", "help me",
  "dying", "severe pain", "allergic reaction", "choking", "falling",
  "broken bone", "car accident", "fire", "poisoning"
]

export default function PatientEmergency() {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [alertSent, setAlertSent] = useState(false)
  const [isCritical, setIsCritical] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState<string>("")
  const [recentAlerts, setRecentAlerts] = useState([
    { 
      id: 1, 
      type: "Text", 
      message: "Feeling dizzy and nauseous", 
      time: "2 hours ago", 
      status: "Resolved",
      severity: "Medium" 
    },
    { 
      id: 2, 
      type: "Audio", 
      message: "Voice message about chest discomfort", 
      time: "1 day ago", 
      status: "Responded",
      severity: "High" 
    },
  ])
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  // Remove all audio/voice state and handlers except the button
  // Remove stopRecording, startRecording, audioTranscript, audioUrl, showTranscript, handleSendAudioAlert, and related UI

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`)
        },
        () => {
          setLocation("Location not available")
        }
      )
    }
  }, [])

  useEffect(() => {
    // Get user data from session cookie
    try {
      const session = document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
      if (session) {
        const user = JSON.parse(decodeURIComponent(session))
        setUserData(user.user)
      }
    } catch (error) {
      console.error('Error parsing session:', error)
    }
  }, []);

  // Real-time fetch of alerts for this patient
  const { data: alertData, error: alertError, isLoading: alertLoading } = useSWR(
    userData?._id ? `/api/patient/emergency-alerts?patientId=${userData._id}` : null,
    (url) => fetch(url).then(res => res.json()),
    { refreshInterval: 5000 }
  );
  const realTimeAlerts = alertData?.alerts || [];

  const checkForCriticalKeywords = (text: string) => {
    const lowerText = text.toLowerCase()
    return criticalKeywords.some((keyword) => lowerText.includes(keyword))
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !userData?._id) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/patient/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, patientId: userData._id }),
      });
      const data = await res.json();
      setIsCritical(data.alert?.isCritical || false);
      setAlertSent(true);
      setIsLoading(false);
      const newAlert = {
        id: Date.now(),
        type: "Text",
        message: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
        time: "Just now",
        status: data.alert?.isCritical ? "Critical - Doctor/Admin Notified" : "Sent",
        severity: data.alert?.isCritical ? "High" : "Medium"
      };
      setRecentAlerts((prev) => [newAlert, ...prev])
      setMessage("")
      setTimeout(() => {
        setAlertSent(false)
        setIsCritical(false)
      }, 5000)
    } catch (error) {
      setIsLoading(false)
      setAlertSent(false)
      setIsCritical(false)
    }
  }

  // Remove stopRecording, startRecording, audioTranscript, audioUrl, showTranscript, handleSendAudioAlert, and related UI

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800 border-red-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <SidebarProvider>
      <PatientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-gradient-to-r from-red-50 to-orange-50">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h1 className="text-lg font-semibold">Emergency Alert System</h1>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">System Active</span>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-red-600">Emergency Alert</h2>
              <p className="text-gray-600">Send immediate alerts to your healthcare team</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{location || "Getting location..."}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="h-4 w-4 text-red-600" />
                <span className="font-semibold">Emergency: 911</span>
              </div>
            </div>
          </div>

          {/* Alert Status */}
          {alertSent && (
            <Alert className={`${isCritical ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"} shadow-lg`}>
              <AlertTriangle className={`h-4 w-4 ${isCritical ? "text-red-600" : "text-green-600"}`} />
              <AlertDescription className={`${isCritical ? "text-red-800" : "text-green-800"} font-medium`}>
                {isCritical
                  ? "🚨 CRITICAL ALERT SENT! Your doctor has been notified immediately. Emergency services may contact you shortly."
                  : "✅ Alert sent successfully to your healthcare team. They will respond as soon as possible."}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Send Alert Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-red-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                  <CardTitle className="flex items-center space-x-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Send Emergency Alert</span>
                  </CardTitle>
                  <CardDescription>
                    Describe your situation clearly. Critical keywords will trigger immediate notifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Text Alert */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Emergency Description</label>
                    <Textarea
                      placeholder="Describe your emergency situation in detail... (e.g., 'Having severe chest pain and difficulty breathing')"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[120px] border-2 focus:border-red-400"
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{message.length}/500 characters</span>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isLoading}
                        className="bg-red-600 hover:bg-red-700 shadow-lg"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Sending...
                          </div>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Alert
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Audio Alert */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Voice Message</h3>
                        <p className="text-xs text-gray-500">Voice alerts coming soon</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {}}
                        disabled
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Critical Keywords */}
              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardHeader>
                  <CardTitle className="text-yellow-800">Critical Keywords</CardTitle>
                  <CardDescription className="text-yellow-700">
                    These words trigger immediate emergency alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {criticalKeywords.slice(0, 12).map((keyword) => (
                      <Badge key={keyword} variant="outline" className="border-yellow-400 text-yellow-800 bg-white">
                        {keyword}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="border-yellow-400 text-yellow-800 bg-white">
                      +{criticalKeywords.length - 12} more
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Recent Alerts Section */}
            <div className="space-y-4">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle>Recent Emergency Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  {alertLoading ? (
                    <div className="flex items-center text-red-600"><div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin mr-2"></div> Loading alerts...</div>
                  ) : alertError ? (
                    <div className="text-red-600">Failed to load alerts.</div>
                  ) : realTimeAlerts.length === 0 ? (
                    <div className="text-gray-500">No emergency alerts found.</div>
                  ) : (
                    <div className="space-y-4">
                      {realTimeAlerts.map((alert: any, idx: number) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border flex flex-col gap-1 ${alert.isCritical ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}`}
                        >
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={`h-4 w-4 ${alert.isCritical ? "text-red-600" : "text-gray-400"}`} />
                            <span className={`font-semibold ${alert.isCritical ? "text-red-700" : "text-gray-800"}`}>{alert.type || "Text"}</span>
                            {alert.isCritical && <span className="ml-2 px-2 py-0.5 rounded bg-red-600 text-white text-xs font-bold">CRITICAL</span>}
                          </div>
                          <div className="text-gray-700 text-sm mt-1">{alert.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "-"}</div>
                          <div className="text-xs mt-1">
                            <span className={`font-semibold ${alert.isCritical ? "text-red-700" : "text-green-700"}`}>{alert.isCritical ? "Critical" : "Normal"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
