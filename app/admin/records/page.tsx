"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ClipboardList, User, Calendar, Stethoscope, Edit, Trash2, Plus, Save, X } from "lucide-react";

export default function AdminRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patient: "", doctor: "", type: "", date: "", status: "", notes: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch all records (visits)
  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/admin/records");
      if (!res.ok) throw new Error("Failed to fetch records");
      const data = await res.json();
      setRecords(data.records || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch records");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all patients for selection
  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/admin/patients");
      if (!res.ok) throw new Error("Failed to fetch patients");
      const data = await res.json();
      setPatients(data.patients || []);
    } catch {
      setPatients([]);
    }
  };

  // Fetch all doctors for selection
  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/admin/doctors");
      if (!res.ok) throw new Error("Failed to fetch doctors");
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch {
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchPatients();
    fetchDoctors();
    const interval = setInterval(fetchRecords, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter records by patient name or email
  const filteredRecords = records.filter((rec) => {
    if (!search) return true;
    const patient = rec.patient || {};
    return (
      (patient.name && patient.name.toLowerCase().includes(search.toLowerCase())) ||
      (patient.email && patient.email.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update record
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("save");
    try {
      const method = editId ? "PUT" : "POST";
      const url = "/api/admin/records" + (editId ? `?id=${editId}` : "");
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save record");
      setShowModal(false);
      setForm({ patient: "", doctor: "", type: "", date: "", status: "", notes: "" });
      setEditId(null);
      fetchRecords();
    } catch (err: any) {
      setError(err.message || "Failed to save record");
    } finally {
      setActionLoading(null);
    }
  };

  // Edit record
  const handleEdit = (rec: any) => {
    setEditId(rec._id);
    setForm({
      patient: rec.patient?._id || rec.patient,
      doctor: rec.doctor,
      type: rec.type,
      date: rec.date,
      status: rec.status,
      notes: rec.notes || "",
    });
    setShowModal(true);
  };

  // Delete record
  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/records?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete record");
      fetchRecords();
    } catch (err: any) {
      setError(err.message || "Failed to delete record");
    } finally {
      setActionLoading(null);
    }
  };

  // Open modal to add new record
  const openAddModal = () => {
    setEditId(null);
    setForm({ patient: "", doctor: "", type: "", date: "", status: "", notes: "" });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm({ patient: "", doctor: "", type: "", date: "", status: "", notes: "" });
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-3xl font-bold tracking-tight">All Medical Records</h2>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Search by patient name or email"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-64"
              />
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={openAddModal}>
                <Plus className="mr-2 h-4 w-4" /> Add Record
              </Button>
            </div>
          </div>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={closeModal}>
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold mb-4">{editId ? "Edit" : "Add"} Medical Record</h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Patient</label>
                    <select
                      name="patient"
                      value={form.patient}
                      onChange={handleFormChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Patient</option>
                      {patients.map((p: any) => (
                        <option key={p._id} value={p._id}>{p.name} ({p.email})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Doctor</label>
                    <select
                      name="doctor"
                      value={form.doctor}
                      onChange={handleFormChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((d: any) => (
                        <option key={d._id} value={d.name}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <input
                      type="text"
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleFormChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <input
                      type="text"
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleFormChange}
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={actionLoading === "save"}>
                    {actionLoading === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-1" />} Save
                  </Button>
                </form>
              </div>
            </div>
          )}
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading records...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRecords.length === 0 ? (
                <div className="text-gray-500 text-center py-12">No records found.</div>
              ) : (
                filteredRecords.map((rec: any) => (
                  <Card key={rec._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        {rec.patient ? `${rec.patient.firstName} ${rec.patient.lastName}` : "Patient"} &mdash; {rec.type}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Stethoscope className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Doctor:</span>
                            <span>{rec.doctor}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Date:</span>
                            <span>{rec.date}</span>
                          </div>
                          {rec.notes && (
                            <div className="mt-2 text-gray-700">
                              <span className="font-medium">Notes:</span> {rec.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={rec.status === "Results Available" ? "default" : rec.status === "Completed" ? "secondary" : "outline"}>
                            {rec.status}
                          </Badge>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(rec)}>
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button size="sm" variant="destructive" disabled={actionLoading === rec._id} onClick={() => handleDelete(rec._id)}>
                              {actionLoading === rec._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />} Delete
                            </Button>
                          </div>
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