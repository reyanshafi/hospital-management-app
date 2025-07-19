"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, User, CheckCircle, XCircle } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/admin/appointments");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: string, status: "confirmed" | "rejected") => {
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/admin/appointments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update appointment");
      fetchAppointments();
    } catch (err: any) {
      setError(err.message || "Failed to update appointment");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold">Manage Appointments</h1>
          </div>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <h2 className="text-3xl font-bold tracking-tight mb-4">All Appointments</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading appointments...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {appointments.length === 0 ? (
                <div className="text-gray-500 text-center py-12">No appointments found.</div>
              ) : (
                appointments.map((appointment: any) => (
                  <Card key={appointment._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        {appointment.patient?.name || appointment.patient || "Patient"} &mdash; {appointment.doctor}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Date:</span>
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">Time:</span>
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">Type:</span>
                            <span>{appointment.type}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={appointment.status === "confirmed" ? "default" : appointment.status === "pending" ? "secondary" : "outline"}>
                            {appointment.status}
                          </Badge>
                          {appointment.status === "pending" && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={actionLoading === appointment._id + "confirmed"}
                                onClick={() => handleAction(appointment._id, "confirmed")}
                              >
                                {actionLoading === appointment._id + "confirmed" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />} Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={actionLoading === appointment._id + "rejected"}
                                onClick={() => handleAction(appointment._id, "rejected")}
                              >
                                {actionLoading === appointment._id + "rejected" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />} Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 