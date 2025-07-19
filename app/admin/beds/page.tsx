"use client"
import React from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then(res => res.json());

function useBeds() {
  const { data, error, isLoading } = useSWR("/api/admin/beds", fetcher, { refreshInterval: 5000 });
  return {
    beds: data?.beds || [],
    isLoading,
    error,
  };
}

export default function AdminBeds() {
  const { beds, isLoading } = useBeds();
  const totalBeds = beds.length;
  const assignedBeds = beds.filter((bed: any) => !bed.available);

  // Add Bed form state
  const [bedNumber, setBedNumber] = React.useState("");
  const [addLoading, setAddLoading] = React.useState(false);
  const [addError, setAddError] = React.useState("");
  const [addSuccess, setAddSuccess] = React.useState("");

  const handleAddBed = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    setAddSuccess("");
    try {
      const res = await fetch("/api/admin/beds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: bedNumber }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || "Failed to add bed");
      } else {
        setAddSuccess("Bed added successfully");
        setBedNumber("");
      }
    } catch {
      setAddError("Unexpected error. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Bed Management</h1>
        </header>
        <div className="flex-1 space-y-4 p-4 pt-6">
          {/* Add Bed Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Bed</CardTitle>
              <CardDescription>Register a new bed in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBed} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label htmlFor="bedNumber" className="block text-sm font-medium mb-1">Bed Number</label>
                  <input
                    id="bedNumber"
                    type="number"
                    min="1"
                    value={bedNumber}
                    onChange={e => setBedNumber(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter bed number"
                  />
                </div>
                <Button type="submit" className="min-w-[120px]" disabled={addLoading}>
                  {addLoading ? "Adding..." : "Add Bed"}
                </Button>
              </form>
              {addError && <div className="text-red-600 text-sm mt-2">{addError}</div>}
              {addSuccess && <div className="text-green-600 text-sm mt-2">{addSuccess}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bed Overview</CardTitle>
              <CardDescription>Real-time bed status and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-8">
                <div>
                  <span className="text-lg font-bold">Total Beds:</span> {totalBeds}
                </div>
                <div>
                  <span className="text-lg font-bold">Assigned Beds:</span> {assignedBeds.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bed List</CardTitle>
              <CardDescription>All beds and their assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bed Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Patient Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3}>Loading...</TableCell>
                    </TableRow>
                  ) : beds.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3}>No beds found.</TableCell>
                    </TableRow>
                  ) : (
                    beds.map((bed: any) => (
                      <TableRow key={bed._id}>
                        <TableCell>{bed.number}</TableCell>
                        <TableCell>
                          <Badge variant={bed.available ? "default" : "secondary"}>
                            {bed.available ? "Available" : "Assigned"}
                          </Badge>
                        </TableCell>
                        <TableCell>{bed.patientName || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
