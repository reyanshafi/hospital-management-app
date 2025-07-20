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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function DoctorDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
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
    (url) => fetch(url).then(res => res.json())
  );
  const { data: alertsData, isLoading: alertsLoading } = useSWR(
    userData?.email ? `/api/doctor/alerts?doctorEmail=${encodeURIComponent(userData.email)}` : null,
    (url) => fetch(url).then(res => res.json())
  );
  const { data: patientsData, isLoading: patientsLoading } = useSWR(
    userData?.email ? `/api/doctor/patients?doctorEmail=${encodeURIComponent(userData.email)}` : null,
    (url) => fetch(url).then(res => res.json())
  );
  const appointments = appointmentsData?.appointments || [];
  const alerts = alertsData?.alerts || [];
  const patients = patientsData?.patients || [];

  // Real-time fetch for medical records
  const { data: recordsData, isLoading: recordsLoading } = useSWR(
    userData?.name ? `/api/doctor/records?doctorName=${encodeURIComponent(userData.name)}` : null,
    (url) => fetch(url).then(res => res.json())
  );
  const records = recordsData?.records || [];

  if (!userData) return null;

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        {/* Modern Header with Gradient */}
        <header className="flex h-20 shrink-0 items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 shadow-lg">
          <SidebarTrigger className="-ml-1 text-white hover:bg-white/10 rounded-lg p-2" />
          <Separator orientation="vertical" className="mr-2 h-6 bg-white/20" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Doctor Dashboard</h1>
          </div>
        </header>
        {/* Main Content with Modern Layout */}
        <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 min-h-screen">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">My Patients</TabsTrigger>
              <TabsTrigger value="records">Medical Records</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
              Welcome back, {userData.name}
            </h2>
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-muted-foreground font-medium">Medical Practice</span>
            </div>
          </div>
          {/* Emergency Alerts Banner */}
          {alerts.length > 0 && (
            <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50/80 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <div className="p-1.5 bg-red-100 rounded-full">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
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
                      <div key={alert._id || idx} className="flex items-center justify-between p-2 bg-white/90 backdrop-blur-sm rounded-lg border border-red-100 shadow-sm hover:shadow-md transition-all duration-200">
                        <div>
                          <span className="font-semibold">{patientDisplay}</span>
                          <span className="text-sm text-gray-600 ml-2">{alert.message}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.severity === "Critical" ? "destructive" : "secondary"}>{alert.severity}</Badge>
                          <span className="text-xs text-gray-500">{alert.time}</span>
                          <Button size="sm" asChild className="hover:scale-105 transition-transform duration-200">
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
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appointments.length}</div>
                <p className="text-xs text-blue-100">Live count</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patients.length}</div>
                <p className="text-xs text-emerald-100">Under your care</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-purple-100">Medical records</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Emergency Alerts</CardTitle>
                <div className="p-2 bg-white/20 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{alerts.length}</div>
                <p className="text-xs text-red-100">Require attention</p>
              </CardContent>
            </Card>
          </div>
          {/* Schedule and Quick Actions */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Today's Schedule</span>
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
                        className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 hover:shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                          <div>
                            <p className="font-semibold">{patientDisplay}</p>
                            <p className="text-sm text-gray-600">{appointment.type}</p>
                            <p className="text-xs text-gray-500">Room: {appointment.room}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{appointment.time}</span>
                          <div className="flex space-x-1 mt-1">
                            <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-300 transition-colors duration-200">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200">
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
            <Card className="col-span-3 shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <a
                  href="/doctor/patients"
                  className="flex items-center space-x-2 rounded-xl border border-slate-100 p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">View Patients</p>
                    <p className="text-xs text-muted-foreground">Manage patient records</p>
                  </div>
                </a>
                <a
                  href="/doctor/prescriptions"
                  className="flex items-center space-x-2 rounded-xl border border-slate-100 p-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:border-emerald-200 transition-all duration-300 hover:shadow-sm"
                >
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <FileText className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Prescriptions</p>
                    <p className="text-xs text-muted-foreground">Write new prescriptions</p>
                  </div>
                </a>
                <a href="/doctor/alerts" className="flex items-center space-x-2 rounded-xl border border-slate-100 p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:border-red-200 transition-all duration-300 hover:shadow-sm">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Emergency Alerts</p>
                    <p className="text-xs text-muted-foreground">Review patient emergencies</p>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>
            </TabsContent>
            <TabsContent value="records">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-900">Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                  {recordsLoading ? (
                    <div>Loading...</div>
                  ) : records.length === 0 ? (
                    <div className="text-gray-500">No medical records found for your patients.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {records.map((rec: any, idx: number) => (
                            <tr key={rec._id || idx} className="hover:bg-blue-50">
                              <td className="px-4 py-2 font-semibold">{rec.patient?.firstName} {rec.patient?.lastName}</td>
                              <td className="px-4 py-2">{rec.type}</td>
                              <td className="px-4 py-2">{rec.date}</td>
                              <td className="px-4 py-2">
                                <Badge variant={rec.status === "Completed" ? "default" : "secondary"}>{rec.status}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}