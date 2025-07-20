"use client"
import React from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function AdminBeds() {
  const [beds, setBeds] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState("");
  const fetchBeds = async () => {
    setIsLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin/beds");
      if (!res.ok) throw new Error("Failed to fetch beds");
      const data = await res.json();
      setBeds(data.beds || []);
    } catch (err: any) {
      setFetchError(err.message || "Error fetching beds");
      setBeds([]);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    fetchBeds();
    const interval = setInterval(fetchBeds, 5000);
    return () => clearInterval(interval);
  }, []);

  // Add Bed form state
  const [bedNumber, setBedNumber] = React.useState("");
  const [ward, setWard] = React.useState("");
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
        body: JSON.stringify({ number: bedNumber, ward }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddError(data.error || "Failed to add bed");
      } else {
        setAddSuccess("Bed added successfully");
        setBedNumber("");
        setWard("");
      }
    } catch {
      setAddError("Unexpected error. Please try again.");
    } finally {
      setAddLoading(false);
    }
  };

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editBed, setEditBed] = React.useState<any>(null);
  const [editWard, setEditWard] = React.useState("");
  const [editAvailable, setEditAvailable] = React.useState(true);
  const [editLoading, setEditLoading] = React.useState(false);
  const openEditModal = (bed: any) => {
    setEditBed(bed);
    setEditWard(bed.ward || "General");
    setEditAvailable(bed.available);
    setEditModalOpen(true);
  };
  const handleEditSave = async () => {
    if (!editBed) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/beds?id=${editBed._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ward: editWard, available: editAvailable }),
      });
      if (!res.ok) throw new Error("Failed to update bed");
      setEditModalOpen(false);
      fetchBeds();
    } catch {
      // handle error
    } finally {
      setEditLoading(false);
    }
  };

  const totalBeds = beds.length;
  const assignedBeds = beds.filter((bed: any) => !bed.available);

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
                <div className="flex-1">
                  <label htmlFor="ward" className="block text-sm font-medium mb-1">Ward</label>
                  <input
                    id="ward"
                    type="text"
                    value={ward}
                    onChange={e => setWard(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter ward (e.g. General, ICU, Pediatrics)"
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
                    <TableHead>Ward</TableHead>
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
                        <TableCell>{bed.ward || "General"}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => openEditModal(bed)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
      {/* Edit Bed Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setEditModalOpen(false)}>
              <span className="sr-only">Close</span>
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Bed</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ward</label>
                <input
                  type="text"
                  value={editWard}
                  onChange={e => setEditWard(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter ward"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Availability</label>
                <select
                  value={editAvailable ? "available" : "assigned"}
                  onChange={e => setEditAvailable(e.target.value === "available")}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="available">Available</option>
                  <option value="assigned">Assigned</option>
                </select>
              </div>
              <Button className="w-full" onClick={handleEditSave} disabled={editLoading}>
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
