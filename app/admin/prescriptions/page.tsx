"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Pill, Plus, X } from "lucide-react";

export default function AdminPrescriptions() {
  const { data, error, isLoading, mutate } = useSWR("/api/admin/prescriptions", url => fetch(url).then(res => res.json()), { refreshInterval: 2000 });
  const prescriptions = data?.prescriptions || [];
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [form, setForm] = useState({ patient: "", doctor: "", medication: "", dosage: "", refills: "", expires: "", status: "active" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetch("/api/admin/patients").then(res => res.json()).then(data => setPatients(data.patients || []));
    fetch("/api/admin/doctors").then(res => res.json()).then(data => setDoctors(data.doctors || []));
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/admin/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to add prescription");
      setShowModal(false);
      setForm({ patient: "", doctor: "", medication: "", dosage: "", refills: "", expires: "", status: "active" });
      mutate();
    } catch (err: any) {
      setFormError(err.message || "Failed to add prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold">Prescriptions</h1>
          </div>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-3xl font-bold tracking-tight">All Prescriptions</h2>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Prescription
            </Button>
          </div>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold mb-4">Add Prescription</h2>
                <form onSubmit={handleAddPrescription} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Patient</label>
                    <select name="patient" value={form.patient} onChange={handleFormChange} required className="w-full border rounded px-3 py-2">
                      <option value="">Select Patient</option>
                      {patients.map((p: any) => (
                        <option key={p._id} value={p._id}>{p.firstName} {p.lastName} ({p.email})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Doctor</label>
                    <select name="doctor" value={form.doctor} onChange={handleFormChange} required className="w-full border rounded px-3 py-2">
                      <option value="">Select Doctor</option>
                      {doctors.map((d: any) => (
                        <option key={d._id} value={d._id}>{d.name} ({d.specialty})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Medication</label>
                    <Input name="medication" value={form.medication} onChange={handleFormChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Dosage</label>
                    <Input name="dosage" value={form.dosage} onChange={handleFormChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Refills</label>
                    <Input name="refills" value={form.refills} onChange={handleFormChange} required type="number" min="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expires</label>
                    <Input name="expires" value={form.expires} onChange={handleFormChange} required type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select name="status" value={form.status} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                      <option value="active">Active</option>
                      <option value="refill-needed">Refill Needed</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  {formError && <div className="text-red-600 text-sm">{formError}</div>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Adding..." : "Add Prescription"}
                  </Button>
                </form>
              </div>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Prescriptions List</CardTitle>
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
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Refills</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions.map((pres: any, idx: number) => (
                        <tr key={pres._id || idx} className="hover:bg-blue-50">
                          <td className="px-4 py-2 font-semibold">{pres.medication}</td>
                          <td className="px-4 py-2">{pres.patient?.firstName} {pres.patient?.lastName}</td>
                          <td className="px-4 py-2">{pres.doctor?.name}</td>
                          <td className="px-4 py-2">{pres.dosage}</td>
                          <td className="px-4 py-2">{pres.refills}</td>
                          <td className="px-4 py-2">{pres.expires}</td>
                          <td className="px-4 py-2">
                            <Badge variant={pres.status === "active" ? "default" : pres.status === "refill-needed" ? "secondary" : "destructive"}>{pres.status}</Badge>
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