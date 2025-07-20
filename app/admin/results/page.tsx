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
import { Loader2, TestTube, Plus, X } from "lucide-react";

export default function AdminResults() {
  const { data, error, isLoading, mutate } = useSWR("/api/admin/results", url => fetch(url).then(res => res.json()), { refreshInterval: 2000 });
  const results = data?.results || [];
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [form, setForm] = useState({ patient: "", doctor: "", status: "ready", report: "", date: "", category: "", findings: "", impression: "", results: [] as any[] });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [resultRows, setResultRows] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/patients").then(res => res.json()).then(data => setPatients(data.patients || []));
    fetch("/api/admin/doctors").then(res => res.json()).then(data => setDoctors(data.doctors || []));
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddResultRow = () => {
    setResultRows([...resultRows, { parameter: "", value: "", unit: "", range: "", status: "normal" }]);
  };
  const handleResultRowChange = (idx: number, field: string, value: string) => {
    const updated = [...resultRows];
    updated[idx][field] = value;
    setResultRows(updated);
  };
  const handleRemoveResultRow = (idx: number) => {
    setResultRows(resultRows.filter((_, i) => i !== idx));
  };

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/admin/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, results: resultRows }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to add result");
      setShowModal(false);
      setForm({ patient: "", doctor: "", status: "ready", report: "", date: "", category: "", findings: "", impression: "", results: [] });
      setResultRows([]);
      mutate();
    } catch (err: any) {
      setFormError(err.message || "Failed to add result");
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
            <TestTube className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold">Test Results</h1>
          </div>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-3xl font-bold tracking-tight">All Test Results</h2>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowModal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Result
            </Button>
          </div>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold mb-4">Add Test Result</h2>
                <form onSubmit={handleAddResult} className="space-y-4">
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
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select name="status" value={form.status} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                      <option value="ready">Ready</option>
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Report</label>
                    <Input name="report" value={form.report} onChange={handleFormChange} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input name="date" value={form.date} onChange={handleFormChange} required type="date" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Input name="category" value={form.category} onChange={handleFormChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Findings</label>
                    <textarea name="findings" value={form.findings} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Impression</label>
                    <textarea name="impression" value={form.impression} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Test Results (parameters)</label>
                    {resultRows.map((row, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                        <Input placeholder="Parameter" value={row.parameter} onChange={e => handleResultRowChange(idx, "parameter", e.target.value)} />
                        <Input placeholder="Value" value={row.value} onChange={e => handleResultRowChange(idx, "value", e.target.value)} />
                        <Input placeholder="Unit" value={row.unit} onChange={e => handleResultRowChange(idx, "unit", e.target.value)} />
                        <Input placeholder="Range" value={row.range} onChange={e => handleResultRowChange(idx, "range", e.target.value)} />
                        <select value={row.status} onChange={e => handleResultRowChange(idx, "status", e.target.value)} className="border rounded px-2">
                          <option value="normal">Normal</option>
                          <option value="high">High</option>
                          <option value="low">Low</option>
                        </select>
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveResultRow(idx)}>Remove</Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={handleAddResultRow}>Add Parameter</Button>
                  </div>
                  {formError && <div className="text-red-600 text-sm">{formError}</div>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Adding..." : "Add Result"}
                  </Button>
                </form>
              </div>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Test Results List</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center text-blue-600"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading results...</div>
              ) : error ? (
                <div className="text-red-600">Failed to load results.</div>
              ) : results.length === 0 ? (
                <div className="text-gray-500">No test results found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Test</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((res: any, idx: number) => (
                        <tr key={res._id || idx} className="hover:bg-blue-50">
                          <td className="px-4 py-2 font-semibold">{res.patient?.firstName} {res.patient?.lastName}</td>
                          <td className="px-4 py-2">{res.doctor?.name}</td>
                          <td className="px-4 py-2">{res.report}</td>
                          <td className="px-4 py-2">
                            <Badge variant={res.status === "ready" ? "default" : res.status === "pending" ? "secondary" : "outline"}>{res.status}</Badge>
                          </td>
                          <td className="px-4 py-2">{res.date}</td>
                          <td className="px-4 py-2">{res.category}</td>
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