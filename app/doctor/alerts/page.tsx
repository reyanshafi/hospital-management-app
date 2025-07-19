"use client"

import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DoctorSidebar } from "@/components/doctor-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Clock, User, Phone, MessageSquare, CheckCircle } from "lucide-react"

export default function DoctorAlerts() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
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

  // Real-time fetch of alerts for this doctor
  const { data, error, isLoading } = useSWR(
    userData?.email ? `/api/doctor/alerts?doctorEmail=${encodeURIComponent(userData.email)}` : null,
    (url) => fetch(url).then(res => res.json()),
    { refreshInterval: 5000 }
  );
  const alerts = data?.alerts || [];

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Emergency Alerts</h1>
        </header>
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Patient Emergency Alerts</h2>
          </div>

          {isLoading ? (
            <div className="flex items-center text-red-600"><div className="w-4 h-4 border-2 border-red-200 border-t-red-600 rounded-full animate-spin mr-2"></div> Loading alerts...</div>
          ) : error ? (
            <div className="text-red-600">Failed to load alerts.</div>
          ) : alerts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold mb-2">No Emergency Alerts</h3>
                <p className="text-muted-foreground">There are currently no emergency alerts from your patients.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {alerts.map((alert: any, idx: number) => (
                <Card
                  key={alert._id || idx}
                  className={`${alert.isCritical && alert.active ? "border-red-500 shadow-lg" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${alert.active ? "bg-red-500" : "bg-gray-400"}`}></div>
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{alert.patientName || "Unknown Patient"}</span>
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "-"}</span>
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {alert.isCritical && <Badge className="bg-red-600 text-white">CRITICAL</Badge>}
                        <Badge variant="outline">{alert.type || "Text"}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                        <p className="text-sm">{alert.message}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${alert.active ? "bg-red-500" : "bg-gray-400"}`}></div>
                          <span className="text-sm font-medium">Status: {alert.active ? "Active" : "Resolved"}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
