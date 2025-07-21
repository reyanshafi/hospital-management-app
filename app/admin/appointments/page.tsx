"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Calendar, User, CheckCircle, XCircle, Edit, Trash2, Clock, Stethoscope } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<{ open: boolean; appointment: any | null }>({ open: false, appointment: null });
  const [editForm, setEditForm] = useState({ doctor: "", date: "", time: "", type: "", status: "" });

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/admin/appointments");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/admin/doctors");
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    const interval = setInterval(fetchAppointments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: string, status: "confirmed" | "rejected") => {
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/admin/appointments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update appointment");
      fetchAppointments();
    } catch (err: any) {
      setError(err.message || "Failed to update appointment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.appointment) return;
    
    setActionLoading("edit");
    try {
      const res = await fetch(`/api/admin/appointments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editModal.appointment._id,
          ...editForm
        }),
      });
      if (!res.ok) throw new Error("Failed to update appointment");
      setEditModal({ open: false, appointment: null });
      setEditForm({ doctor: "", date: "", time: "", type: "", status: "" });
      fetchAppointments();
    } catch (err: any) {
      setError(err.message || "Failed to update appointment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading("delete" + id);
    try {
      const res = await fetch(`/api/admin/appointments?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete appointment");
      fetchAppointments();
    } catch (err: any) {
      setError(err.message || "Failed to delete appointment");
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (appointment: any) => {
    setEditForm({
      doctor: appointment.doctor || "",
      date: appointment.date || "",
      time: appointment.time || "",
      type: appointment.type || "",
      status: appointment.status || ""
    });
    setEditModal({ open: true, appointment });
  };

  const closeEditModal = () => {
    setEditModal({ open: false, appointment: null });
    setEditForm({ doctor: "", date: "", time: "", type: "", status: "" });
  };

  const getPatientName = (appointment: any) => {
    if (appointment.patient?.firstName && appointment.patient?.lastName) {
      return `${appointment.patient.firstName} ${appointment.patient.lastName}`;
    }
    return appointment.patient || "Patient";
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold">Manage Appointments</h1>
          </div>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <h2 className="text-3xl font-bold tracking-tight mb-4">All Appointments</h2>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading appointments...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {appointments.length === 0 ? (
                <div className="text-gray-500 text-center py-12">No appointments found.</div>
              ) : (
                appointments.map((appointment: any) => (
                  <Card key={appointment._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        {getPatientName(appointment)} &mdash; {appointment.doctor}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Date:</span>
                              <span>{appointment.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Time:</span>
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Type:</span>
                              <span>{appointment.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={appointment.status === "confirmed" ? "default" : appointment.status === "pending" ? "secondary" : "outline"}>
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {appointment.status === "pending" && (
                            <div className="flex gap-2 mb-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={actionLoading === appointment._id + "confirmed"}
                                onClick={() => handleAction(appointment._id, "confirmed")}
                              >
                                {actionLoading === appointment._id + "confirmed" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />} Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={actionLoading === appointment._id + "rejected"}
                                onClick={() => handleAction(appointment._id, "rejected")}
                              >
                                {actionLoading === appointment._id + "rejected" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />} Reject
                              </Button>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Dialog open={editModal.open} onOpenChange={(open) => !open && closeEditModal()}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditModal(appointment)}
                                >
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Appointment</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleEdit} className="space-y-4">
                                  <div>
                                    <Label htmlFor="doctor">Doctor</Label>
                                    <Select value={editForm.doctor} onValueChange={(value) => setEditForm({ ...editForm, doctor: value })}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select doctor" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {doctors.map((doc: any) => (
                                          <SelectItem key={doc._id} value={doc.name}>
                                            {doc.name} ({doc.specialty})
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                      id="date"
                                      type="date"
                                      value={editForm.date}
                                      onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                      id="time"
                                      type="time"
                                      value={editForm.time}
                                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={editForm.type} onValueChange={(value) => setEditForm({ ...editForm, type: value })}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Consultation">Consultation</SelectItem>
                                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                                        <SelectItem value="Annual Checkup">Annual Checkup</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button type="submit" disabled={actionLoading === "edit"}>
                                      {actionLoading === "edit" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                      Save Changes
                                    </Button>
                                    <Button type="button" variant="outline" onClick={closeEditModal}>
                                      Cancel
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={actionLoading === "delete" + appointment._id}
                                >
                                  {actionLoading === "delete" + appointment._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />} Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the appointment for {getPatientName(appointment)}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(appointment._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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