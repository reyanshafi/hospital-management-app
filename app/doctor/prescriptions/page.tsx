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

export default function DoctorPrescriptions() {
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
    userData?.name ? `/api/doctor/prescriptions?doctorName=${encodeURIComponent(userData.name)}` : null,
    (url) => fetch(url).then(res => res.json())
  );
  const prescriptions = data?.prescriptions || [];

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Prescriptions</h1>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center text-blue-600"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading prescriptions...</div>
              ) : error ? (
                <div className="text-red-600">Failed to load prescriptions.</div>
              ) : prescriptions.length === 0 ? (
                <div className="text-gray-500">No prescriptions found for your patients.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Medication</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Refills</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((pres: any, idx: number) => (
                        <tr key={pres._id || idx} className="hover:bg-blue-50">
                          <td className="px-4 py-2 font-semibold">{pres.patient?.firstName} {pres.patient?.lastName}</td>
                          <td className="px-4 py-2">{pres.medication}</td>
                          <td className="px-4 py-2">{pres.refills}</td>
                          <td className="px-4 py-2">{pres.expires}</td>
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