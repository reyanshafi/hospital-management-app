"use client"
import React from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Edit, Trash2 } from "lucide-react";
import useSWR from "swr";
import { Modal } from "@/components/ui/modal"; // If you have a modal component, otherwise use a custom one

const fetcher = (url: string) => fetch(url).then(res => res.json());

function useDoctors() {
  const { data, error, isLoading, mutate } = useSWR("/api/admin/doctors", fetcher, { refreshInterval: 5000 });
  return {
    doctors: data?.doctors || [],
    isLoading,
    error,
    mutate,
  };
}

export default function AdminDoctors() {
  const { doctors, isLoading, mutate } = useDoctors();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
  });
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState({ name: "", email: "", phone: "", specialty: "" });
  const [editLoading, setEditLoading] = React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  // Filtered doctors
  const filteredDoctors = doctors.filter((doctor: any) => {
    const q = search.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(q) ||
      doctor.email.toLowerCase().includes(q) ||
      (doctor.phone || "").toLowerCase().includes(q) ||
      (doctor.specialty || "").toLowerCase().includes(q)
    );
  });

  // Add Doctor
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/add-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to add doctor");
      } else {
        setSuccess("Doctor added successfully");
        setForm({ name: "", email: "", password: "", phone: "", specialty: "" });
        mutate();
        setTimeout(() => setSuccess(""), 1500);
      }
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Doctor
  const openEditModal = (doctor: any) => {
    setEditId(doctor._id);
    setEditForm({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone || "",
      specialty: doctor.specialty || "",
    });
    setEditModalOpen(true);
  };
  const handleEditChange = (e: any) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/doctors?id=${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update doctor");
      setEditModalOpen(false);
      mutate();
    } catch {
      // handle error
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Doctor
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/doctors?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete doctor");
      setDeleteModalOpen(false);
      mutate();
    } catch {
      // handle error
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Doctor Management</h1>
        </header>
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Doctors</h2>
            {/* Add Doctor button could open a modal if you want */}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add New Doctor</CardTitle>
                <CardDescription>Register a new doctor in the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email Address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input id="specialty" name="specialty" value={form.specialty} onChange={handleChange} placeholder="Specialty" />
                  </div>
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Adding..." : "Add Doctor"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search Doctors</CardTitle>
                <CardDescription>Find and manage existing doctors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input placeholder="Search by name, phone, or email..." className="flex-1" value={search} onChange={e => setSearch(e.target.value)} />
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Doctor List</CardTitle>
              <CardDescription>Manage all registered doctors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5}>Loading...</TableCell>
                    </TableRow>
                  ) : filteredDoctors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>No doctors found.</TableCell>
                    </TableRow>
                  ) : (
                    filteredDoctors.map((doctor: any) => (
                      <TableRow key={doctor._id}>
                        <TableCell className="font-medium">{doctor.name}</TableCell>
                        <TableCell>{doctor.email}</TableCell>
                        <TableCell>{doctor.phone}</TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => openEditModal(doctor)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openDeleteModal(doctor._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Doctor Modal */}
          {editModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setEditModalOpen(false)}>
                  <span className="sr-only">Close</span>
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Edit Doctor</h2>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input id="edit-name" name="name" value={editForm.name} onChange={handleEditChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" name="email" value={editForm.email} onChange={handleEditChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input id="edit-phone" name="phone" value={editForm.phone} onChange={handleEditChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-specialty">Specialty</Label>
                    <Input id="edit-specialty" name="specialty" value={editForm.specialty} onChange={handleEditChange} />
                  </div>
                  <Button type="submit" className="w-full" disabled={editLoading}>
                    {editLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Delete Doctor Modal */}
          {deleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setDeleteModalOpen(false)}>
                  <span className="sr-only">Close</span>
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Delete Doctor</h2>
                <p>Are you sure you want to delete this doctor? This action cannot be undone.</p>
                <div className="flex gap-2 mt-6">
                  <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={deleteLoading}>
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setDeleteModalOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
