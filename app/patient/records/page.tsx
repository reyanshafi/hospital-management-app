"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PatientSidebar } from "@/components/patient-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ClipboardList, User, Calendar, Stethoscope } from "lucide-react";

export default function PatientRecords() {
  const router = useRouter();
  const [visits, setVisits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState("");

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return null;
  };

  const fetchVisits = async (patientId: string) => {
    try {
      const res = await fetch(`/api/patient/visits?patientId=${patientId}`);
      if (!res.ok) throw new Error("Failed to fetch records");
      const data = await res.json();
      setVisits(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch records");
    }
  };

  useEffect(() => {
    const validateUser = () => {
      try {
        const sessionCookie = getCookie('session');
        if (!sessionCookie) {
          router.replace("/");
          return;
        }
        const user = JSON.parse(decodeURIComponent(sessionCookie));
        if (!user || !user.user || user.user.role !== "patient") {
          router.replace("/");
          return;
        }
        setUserData(user);
        setIsAuthorized(true);
        const patientId = user.user._id;
        fetchVisits(patientId);
        // Set up polling for real-time updates
        const interval = setInterval(() => {
          fetchVisits(patientId);
        }, 5000);
        return () => clearInterval(interval);
      } catch (error) {
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };
    const cleanup = validateUser();
    return cleanup;
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading your medical records...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized || !userData) {
    return null;
  }

  return (
    <SidebarProvider>
      <PatientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold">Medical Records</h1>
          </div>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <h2 className="text-3xl font-bold tracking-tight mb-4">My Medical Records</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <div className="grid gap-4">
            {visits.length === 0 ? (
              <div className="text-gray-500 text-center py-12">No medical records found.</div>
            ) : (
              visits.map((visit: any) => (
                <Card key={visit._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      {visit.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Stethoscope className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Doctor:</span>
                          <span>{visit.doctor}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Date:</span>
                          <span>{visit.date}</span>
                        </div>
                        {visit.notes && (
                          <div className="mt-2 text-gray-700">
                            <span className="font-medium">Notes:</span> {visit.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={visit.status === "Results Available" ? "default" : visit.status === "Completed" ? "secondary" : "outline"}>
                          {visit.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
