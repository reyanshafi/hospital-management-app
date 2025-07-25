"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PatientSidebar } from "@/components/patient-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText } from "lucide-react";

export default function PatientPrescriptions() {
  const [userData, setUserData] = useState<any>(null);
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

  const { data, error, isLoading, mutate } = useSWR(
    userData?._id ? `/api/patient/prescriptions?patientId=${encodeURIComponent(userData._id)}` : null,
    (url) => fetch(url).then(res => res.json())
  );
  const prescriptions = data?.prescriptions || [];

  const handleStatusChange = async (id: string, status: string) => {
    await fetch("/api/patient/prescriptions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    mutate();
  };

  return (
    <SidebarProvider>
      <PatientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Prescriptions</h1>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>My Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center text-blue-600"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading prescriptions...</div>
              ) : error ? (
                <div className="text-red-600">Failed to load prescriptions.</div>
              ) : prescriptions.length === 0 ? (
                <div className="text-gray-500">No prescriptions found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Medication</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Refills</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((pres: any, idx: number) => (
                        <tr key={pres._id || idx} className="hover:bg-blue-50">
                          <td className="px-4 py-2 font-semibold">{pres.medication}</td>
                          <td className="px-4 py-2">{pres.doctor}</td>
                          <td className="px-4 py-2">{pres.refills}</td>
                          <td className="px-4 py-2">{pres.expires}</td>
                          <td className="px-4 py-2">
                            <Badge variant={pres.status === "active" ? "default" : pres.status === "refill-needed" ? "secondary" : "destructive"}>{pres.status}</Badge>
                          </td>
                          <td className="px-4 py-2">
                            <select
                              value={pres.status}
                              onChange={e => handleStatusChange(pres._id, e.target.value)}
                              className="border rounded px-2 py-1 text-sm"
                            >
                              <option value="active">Active</option>
                              <option value="refill-needed">Refill Needed</option>
                              <option value="expired">Expired</option>
                            </select>
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
