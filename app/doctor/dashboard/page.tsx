"use client"
import React from "react"
import { DoctorSidebar } from "@/components/doctor-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileText, AlertTriangle, Clock, Phone, Stethoscope } from "lucide-react"
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
    // Get session from cookie
    try {
      const session = document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
      if (session) {
        const user = JSON.parse(decodeURIComponent(session))
        setUserData(user.user)
      }
    } catch (error) {
      window.location.href = "/";
    }
  }, []);

  // Real-time fetch for appointments, alerts, and patients
  const { data: appointmentsData, isLoading: appointmentsLoading } = useSWR(
    userData?.email ? `/api/doctor/appointments?doctorEmail=${encodeURIComponent(userData.email)}` : null,
    (url) => fetch(url).then(res => res.json()),
    { refreshInterval: 5000 }
  );
  const { data: alertsData, isLoading: alertsLoading } = useSWR(
    userData?.email ? `/api/doctor/alerts?doctorEmail=${encodeURIComponent(userData.email)}` : null,
    (url) => fetch(url).then(res => res.json()),
    { refreshInterval: 5000 }
  );
  const { data: patientsData, isLoading: patientsLoading } = useSWR(
    userData?.email ? `/api/doctor/patients?doctorEmail=${encodeURIComponent(userData.email)}` : null,
    (url) => fetch(url).then(res => res.json()),
    { refreshInterval: 5000 }
  );
  const appointments = appointmentsData?.appointments || [];
  const alerts = alertsData?.alerts || [];
  const patients = patientsData?.patients || [];

  if (!userData) return null;

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Doctor Dashboard</h1>
        </header>
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {userData.name}</h2>
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">Medical Practice</span>
            </div>
          </div>

          {/* Emergency Alerts Banner */}
          {alerts.length > 0 && (
            <Card className="border-red-500 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span>🚨 Emergency Alerts ({alerts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts.map((alert: any, idx: number) => {
                    let patientDisplay = "Patient";
                    if (alert.patient && typeof alert.patient === 'object' && alert.patient.firstName && alert.patient.lastName) {
                      patientDisplay = `${alert.patient.firstName} ${alert.patient.lastName}`;
                    } else if (typeof alert.patient === 'string') {
                      patientDisplay = alert.patient;
                    } else if (alert.patientName) {
                      patientDisplay = alert.patientName;
                    }
                    return (
                      <div key={alert._id || idx} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <span className="font-semibold">{patientDisplay}</span>
                          <span className="text-sm text-gray-600 ml-2">{alert.message}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.severity === "Critical" ? "destructive" : "secondary"}>{alert.severity}</Badge>
                          <span className="text-xs text-gray-500">{alert.time}</span>
                          <Button size="sm" asChild>
                            <a href="/doctor/alerts">View</a>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointments.length}</div>
                <p className="text-xs text-muted-foreground">Live count</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-muted-foreground">Under your care</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Medical records</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emergency Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{alerts.length}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Today's Schedule</span>
                </CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.map((appointment: any) => {
                    let patientDisplay = "Patient";
                    if (appointment.patient && typeof appointment.patient === 'object' && appointment.patient.firstName && appointment.patient.lastName) {
                      patientDisplay = `${appointment.patient.firstName} ${appointment.patient.lastName}`;
                    } else if (typeof appointment.patient === 'string') {
                      patientDisplay = appointment.patient;
                    } else if (appointment.patientName) {
                      patientDisplay = appointment.patientName;
                    }
                    return (
                      <div
                        key={appointment._id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div>
                            <p className="font-semibold">{patientDisplay}</p>
                            <p className="text-sm text-gray-600">{appointment.type}</p>
                            <p className="text-xs text-gray-500">Room: {appointment.room}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{appointment.time}</span>
                          <div className="flex space-x-1 mt-1">
                            <Button variant="outline" size="sm">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <a
                  href="/doctor/patients"
                  className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent"
                >
                  <Users className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">View Patients</p>
                    <p className="text-xs text-muted-foreground">Manage patient records</p>
                  </div>
                </a>
                <a
                  href="/doctor/prescriptions"
                  className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent"
                >
                  <FileText className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Prescriptions</p>
                    <p className="text-xs text-muted-foreground">Write new prescriptions</p>
                  </div>
                </a>
                <a href="/doctor/alerts" className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium">Emergency Alerts</p>
                    <p className="text-xs text-muted-foreground">Review patient emergencies</p>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
