"use client";
import useSWR from "swr";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminAlerts() {
  const { data, error, isLoading } = useSWR("/api/admin/recent-alerts", fetcher, { refreshInterval: 5000 });
  const alerts = data?.alerts || [];

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Emergency Alerts</h1>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Emergency Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center text-red-600"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading alerts...</div>
              ) : error ? (
                <div className="text-red-600">Failed to load alerts.</div>
              ) : alerts.length === 0 ? (
                <div className="text-gray-500">No emergency alerts found.</div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border flex flex-col gap-1 ${alert.isCritical ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}`}
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 ${alert.isCritical ? "text-red-600" : "text-gray-400"}`} />
                        <span className={`font-semibold ${alert.isCritical ? "text-red-700" : "text-gray-800"}`}>
                          {alert.patientName || "Unknown Patient"}
                        </span>
                        {alert.isCritical && <span className="ml-2 px-2 py-0.5 rounded bg-red-600 text-white text-xs font-bold">CRITICAL</span>}
                      </div>
                      <div className="text-gray-700 text-sm mt-1">{alert.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "-"}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 