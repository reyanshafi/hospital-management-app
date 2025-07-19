"use client";
import React from "react";
import useSWR from "swr";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Bed, AlertTriangle, Loader2 } from "lucide-react";

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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </header>
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, Admin</h2>
          </div>

          {/* Real-time dashboard cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">Total Patients</CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.patients ?? "-"}
                </div>
                <p className="text-xs text-blue-700">Real-time count</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">Active Doctors</CardTitle>
                <Stethoscope className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.doctors ?? "-"}
                </div>
                <p className="text-xs text-green-700">Real-time count</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">Available Beds</CardTitle>
                <Bed className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.beds ?? "-"}
                </div>
                <p className="text-xs text-purple-700">Real-time available</p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">Emergency Alerts</CardTitle>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">
                  {statsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : stats?.alerts ?? "-"}
                </div>
                <p className="text-xs text-red-700">Real-time active</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Patients */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {patientsLoading ? (
                  <div className="flex items-center text-blue-600"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading patients...</div>
                ) : patientsError ? (
                  <div className="text-red-600">Failed to load patients.</div>
                ) : (
                  <div className="space-y-4">
                    {recentPatients?.patients?.length === 0 && <div className="text-gray-500">No recent patients.</div>}
                    {recentPatients?.patients?.map((p: any, idx: number) => (
                      <div className="flex items-center" key={idx}>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{p.firstName} {p.lastName}</p>
                          <p className="text-sm text-muted-foreground">Age: {p.age} &mdash; Added: {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Recent Emergency Alerts */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Emergency Alerts</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {alertsLoading ? (
                  <div className="flex items-center text-red-600"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading alerts...</div>
                ) : alertsError ? (
                  <div className="text-red-600">Failed to load alerts.</div>
                ) : (
                  <div className="space-y-4">
                    {recentAlerts?.alerts?.length === 0 && <div className="text-gray-500">No recent alerts.</div>}
                    {recentAlerts?.alerts?.map((a: any, idx: number) => (
                      <div className="flex items-center" key={idx}>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{a.patientName || "Unknown Patient"}</p>
                          <p className="text-sm text-muted-foreground">{a.message}</p>
                          <p className="text-xs text-gray-400">{a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}</p>
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
