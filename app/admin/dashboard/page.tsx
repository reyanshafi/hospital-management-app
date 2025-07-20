"use client";
import React from "react";
import useSWR from "swr";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Bed, AlertTriangle, Loader2, Clock, User, TrendingUp } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminDashboard() {
  // Real-time stats
  const { data: stats, error: statsError, isLoading: statsLoading } = useSWR("/api/admin/dashboard-stats", fetcher, { refreshInterval: 5000 });
  // Real-time recent patients
  const { data: recentPatients, error: patientsError, isLoading: patientsLoading } = useSWR("/api/admin/recent-patients", fetcher, { refreshInterval: 5000 });
  // Real-time recent emergency alerts
  const { data: recentAlerts, error: alertsError, isLoading: alertsLoading } = useSWR("/api/admin/recent-alerts", fetcher, { refreshInterval: 5000 });
  // Real-time AI patient monitoring
  const { data: aiMonitoring, error: aiError, isLoading: aiLoading } = useSWR("/api/admin/ai-monitoring", fetcher, { refreshInterval: 5000 });

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        {/* Modern Header with Gradient */}
        <header className="flex h-20 shrink-0 items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 shadow-lg">
          <SidebarTrigger className="-ml-1 text-white hover:bg-white/10 rounded-lg p-2" />
          <Separator orientation="vertical" className="mr-2 h-6 bg-white/20" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          </div>
        </header>
        
        {/* Main Content with Modern Layout */}
        <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 min-h-screen">
          {/* Dashboard Overview Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                Hospital Overview
              </h2>
              <p className="text-lg text-slate-600 font-medium">Real-time insights and operational status</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live Updates Active</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Last updated</p>
                <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Patients Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Patients</CardTitle>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {statsLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" /> : stats?.patients ?? "-"}
                </div>
                <p className="text-xs text-slate-500 font-medium">Real-time count</p>
                <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" style={{width: '75%'}}></div>
                </div>
              </CardContent>
            </Card>

            {/* Active Doctors Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Active Doctors</CardTitle>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {statsLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" /> : stats?.doctors ?? "-"}
                </div>
                <p className="text-xs text-slate-500 font-medium">Real-time count</p>
                <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full animate-pulse" style={{width: '88%'}}></div>
                </div>
              </CardContent>
            </Card>

            {/* Available Beds Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Available Beds</CardTitle>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Bed className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {statsLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" /> : stats?.beds ?? "-"}
                </div>
                <p className="text-xs text-slate-500 font-medium">Real-time available</p>
                <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full animate-pulse" style={{width: '62%'}}></div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Alerts Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Emergency Alerts</CardTitle>
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-5 w-5 text-white animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {statsLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" /> : stats?.alerts ?? "-"}
                </div>
                <p className="text-xs text-slate-500 font-medium">Real-time active</p>
                <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse" style={{width: '25%'}}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Content Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            {/* Enhanced Recent Patients */}
            <Card className="col-span-4 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Recent Patients
                  <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-blue-700">Live</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-96 overflow-y-auto">
                {patientsLoading ? (
                  <div className="flex items-center justify-center py-12 text-slate-600">
                    <Loader2 className="h-6 w-6 animate-spin mr-3" /> 
                    <span className="font-medium">Loading patients...</span>
                  </div>
                ) : patientsError ? (
                  <div className="text-red-600 text-center py-12 font-medium">Failed to load patients.</div>
                ) : (
                  <div>
                    {recentPatients?.patients?.length === 0 && (
                      <div className="text-slate-400 text-center py-12 font-medium">No recent patients.</div>
                    )}
                    {recentPatients?.patients?.map((p: any, idx: number) => (
                      <div className="px-8 py-5 border-b border-slate-100 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 group" key={idx}>
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-slate-900 text-lg">{p.firstName} {p.lastName}</p>
                            <div className="flex items-center gap-6 mt-2 text-sm text-slate-600">
                              <span className="font-medium">Age: <span className="text-slate-900">{p.age}</span></span>
                              <span className="flex items-center font-medium">
                                <Clock className="h-4 w-4 mr-2 text-slate-400" />
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

            {/* Enhanced Emergency Alerts */}
            <Card className="col-span-3 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-white animate-pulse" />
                  </div>
                  Emergency Alerts
                  <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-red-700">Critical</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-96 overflow-y-auto">
                {alertsLoading ? (
                  <div className="flex items-center justify-center py-12 text-slate-600">
                    <Loader2 className="h-6 w-6 animate-spin mr-3" /> 
                    <span className="font-medium">Loading alerts...</span>
                  </div>
                ) : alertsError ? (
                  <div className="text-red-600 text-center py-12 font-medium">Failed to load alerts.</div>
                ) : (
                  <div>
                    {recentAlerts?.alerts?.length === 0 && (
                      <div className="text-slate-400 text-center py-12 font-medium">No recent alerts.</div>
                    )}
                    {recentAlerts?.alerts?.map((a: any, idx: number) => (
                      <div className="px-6 py-5 border-b border-red-100 last:border-b-0 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-all duration-200 group" key={idx}>
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                            <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 text-base">{a.patientName || "Unknown Patient"}</p>
                            <p className="text-sm text-slate-700 mt-1 font-medium leading-relaxed">{a.message}</p>
                            <div className="flex items-center text-xs text-slate-500 mt-3 font-medium">
                              <Clock className="h-3 w-3 mr-2" />
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

          {/* AI Patient Monitoring Section */}
          <Card className="mt-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                AI Patient Monitoring
                <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-700">Live</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-96 overflow-y-auto">
              {aiLoading ? (
                <div className="flex items-center justify-center py-12 text-slate-600">
                  <Loader2 className="h-6 w-6 animate-spin mr-3" />
                  <span className="font-medium">Loading monitoring data...</span>
                </div>
              ) : aiError ? (
                <div className="text-red-600 text-center py-12 font-medium">Failed to load monitoring data.</div>
              ) : (
                <div>
                  {(!aiMonitoring?.monitoring || aiMonitoring.monitoring.length === 0) && (
                    <div className="text-slate-400 text-center py-12 font-medium">No monitoring data.</div>
                  )}
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Heart Rate</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SpO2</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Temp (°C)</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiMonitoring?.monitoring?.map((m: any, idx: number) => (
                        <tr key={m._id || idx} className="hover:bg-blue-50">
                          <td className="px-4 py-2 font-semibold">{m.patientName}</td>
                          <td className="px-4 py-2">{m.heartRate}</td>
                          <td className="px-4 py-2">{m.spo2}</td>
                          <td className="px-4 py-2">{m.temperature}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold 
                              ${m.status === 'critical' ? 'bg-red-100 text-red-700' : 
                                m.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-700'}`}>{m.status}</span>
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-500">{m.timestamp ? new Date(m.timestamp).toLocaleString() : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}