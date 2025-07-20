"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DoctorSidebar } from "@/components/doctor-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, User, Clock, FileText } from "lucide-react";

export default function DoctorAppointments() {
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
      window.location.href = "/";
    }
  }, []);

  // Real-time fetch of appointments for this doctor
  const { data, error, isLoading } = useSWR(
    userData?.name ? `/api/doctor/appointments?doctorName=${encodeURIComponent(userData.name)}` : null,
    (url) => fetch(url).then(res => res.json()),
    { refreshInterval: 1000 }
  );
  const appointments = data?.appointments || [];

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Appointments</h1>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center text-blue-600"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading appointments...</div>
              ) : error ? (
                <div className="text-red-600">Failed to load appointments.</div>
              ) : appointments.length === 0 ? (
                <div className="text-gray-500">No appointments scheduled.</div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appt: any, idx: number) => {
                    let patientDisplay = "Patient";
                    if (appt.patient && typeof appt.patient === 'object' && appt.patient.firstName && appt.patient.lastName) {
                      patientDisplay = `${appt.patient.firstName} ${appt.patient.lastName}`;
                    } else if (typeof appt.patient === 'string') {
                      patientDisplay = appt.patient;
                    } else if (appt.patientName) {
                      patientDisplay = appt.patientName;
                    }
                    return (
                      <div key={appt._id || idx} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-blue-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-semibold">{patientDisplay}</div>
                            <div className="text-xs text-gray-500">{appt.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{appt.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{appt.time}</span>
                          </div>
                          <Badge variant={appt.status === "confirmed" ? "default" : "secondary"}>{appt.status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 