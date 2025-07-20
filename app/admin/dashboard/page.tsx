"use client";
import React from "react";
import useSWR from "swr";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Bed, AlertTriangle, Loader2, Clock, User } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminDashboard() {
  // Real-time stats
  const { data: stats, error: statsError, isLoading: statsLoading } = useSWR("/api/admin/dashboard-stats", fetcher, { refreshInterval: 5000 });
  // Real-time recent patients
  const { data: recentPatients, error: patientsError, isLoading: patientsLoading } = useSWR("/api/admin/recent-patients", fetcher, { refreshInterval: 5000 });
  // Real-time recent emergency alerts
  const { data: recentAlerts, error: alertsError, isLoading: alertsLoading } = useSWR("/api/admin/recent-alerts", fetcher, { refreshInterval: 5000 });

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
        </header>
        
        <div className="flex-1 space-y-6 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, Admin</h2>
              <p className="text-gray-600">Here's what's happening at your hospital today</p>
            </div>
          </div>

          {/* Real-time dashboard cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : stats?.patients ?? "-"}
                </div>
                <p className="text-xs text-gray-500">Real-time count</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Doctors</CardTitle>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Stethoscope className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : stats?.doctors ?? "-"}
                </div>
                <p className="text-xs text-gray-500">Real-time count</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Available Beds</CardTitle>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Bed className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : stats?.beds ?? "-"}
                </div>
                <p className="text-xs text-gray-500">Real-time available</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Emergency Alerts</CardTitle>
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : stats?.alerts ?? "-"}
                </div>
                <p className="text-xs text-gray-500">Real-time active</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Patients */}
            <Card className="col-span-4 bg-white border border-gray-200">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  Recent Patients
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {patientsLoading ? (
                  <div className="flex items-center justify-center py-8 text-gray-600">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> 
                    Loading patients...
                  </div>
                ) : patientsError ? (
                  <div className="text-red-600 text-center py-8">Failed to load patients.</div>
                ) : (
                  <div>
                    {recentPatients?.patients?.length === 0 && (
                      <div className="text-gray-400 text-center py-8">No recent patients.</div>
                    )}
                    {recentPatients?.patients?.map((p: any, idx: number) => (
                      <div className="px-6 py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50" key={idx}>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{p.firstName} {p.lastName}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span>Age: {p.age}</span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Emergency Alerts */}
            <Card className="col-span-3 bg-white border border-gray-200">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Emergency Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {alertsLoading ? (
                  <div className="flex items-center justify-center py-8 text-gray-600">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> 
                    Loading alerts...
                  </div>
                ) : alertsError ? (
                  <div className="text-red-600 text-center py-8">Failed to load alerts.</div>
                ) : (
                  <div>
                    {recentAlerts?.alerts?.length === 0 && (
                      <div className="text-gray-400 text-center py-8">No recent alerts.</div>
                    )}
                    {recentAlerts?.alerts?.map((a: any, idx: number) => (
                      <div className="px-6 py-4 border-b border-gray-50 last:border-b-0 hover:bg-red-50" key={idx}>
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">{a.patientName || "Unknown Patient"}</p>
                            <p className="text-sm text-gray-700 mt-1">{a.message}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <Clock className="h-3 w-3 mr-1" />
                              {a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}