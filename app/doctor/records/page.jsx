"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DoctorSidebar } from "@/components/doctor-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText } from "lucide-react";

export default function DoctorRecords() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  useEffect(() => {
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

  const { data, error, isLoading } = useSWR(
    userData?.name ? `/api/doctor/records?doctorName=${encodeURIComponent(userData.name)}` : null,
    (url) => fetch(url).then(res => res.json())
  );
  const records = data?.records || [];

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Medical Records</h1>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center text-blue-600"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading records...</div>
              ) : error ? (
                <div className="text-red-600">Failed to load records.</div>
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
                      {records.map((rec, idx) => (
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
