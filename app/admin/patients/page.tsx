"use client"
import React from "react";
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Search, Edit, Trash2 } from "lucide-react"



// useEffect + fetch for patients
function useAvailableBeds() {
  const [beds, setBeds] = React.useState<any[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    const fetchBeds = async () => {
      try {
        const res = await fetch("/api/admin/beds");
        if (!res.ok) throw new Error("Failed to fetch beds");
        const data = await res.json();
        if (!cancelled) setBeds((data.beds || []).filter((bed: any) => bed.available));
      } catch {
        if (!cancelled) setBeds([]);
      }
    };
    fetchBeds();
    const interval = setInterval(fetchBeds, 5000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);
  return beds;
}

// Fetch doctors from API
function useDoctors() {
  const [doctors, setDoctors] = React.useState<any[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/admin/doctors");
        if (!res.ok) throw new Error("Failed to fetch doctors");
        const data = await res.json();
        if (!cancelled) setDoctors(data.doctors || []);
      } catch {
        if (!cancelled) setDoctors([]);
      }
    };
    fetchDoctors();
    const interval = setInterval(fetchDoctors, 5000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);
  return doctors;
}

export default function AdminPatients() {
  const [patients, setPatients] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState("");
  const fetchPatients = async () => {
    setIsLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin/patients");
      if (!res.ok) throw new Error("Failed to fetch patients");
      const data = await res.json();
      setPatients(data.patients || []);
    } catch (err: any) {
      setFetchError(err.message || "Error fetching patients");
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    fetchPatients();
    const interval = setInterval(fetchPatients, 5000);
    return () => clearInterval(interval);
  }, []);
  const availableBeds = useAvailableBeds();
  const doctors = useDoctors();
  // Add New Patient form state and handler
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    phone: "",
    doctor: "",
    bed: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/add-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to add patient");
      } else {
        setSuccess("Patient added successfully");
        setForm({
          firstName: "",
          lastName: "",
          age: "",
          gender: "",
          phone: "",
          doctor: "",
          bed: "",
          email: "",
          password: "",
        });
      }
    } catch {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Patient Management</h1>
        </header>
        <div className="flex-1 space-y-4 p-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Patients</h2>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add New Patient</CardTitle>
                <CardDescription>Register a new patient in the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required placeholder="Enter first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Enter last name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" name="age" type="number" value={form.age} onChange={handleChange} required placeholder="Enter age" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={form.gender} onValueChange={v => handleSelect("gender", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="Enter phone number" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignDoctor">Assign Doctor</Label>
                      <Select value={form.doctor} onValueChange={v => handleSelect("doctor", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor: any) => (
                            <SelectItem key={doctor._id} value={doctor.name}>
                              {doctor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {doctors.length === 0 && (
                        <div className="text-red-600 text-xs mt-1">No doctors found</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignBed">Assign Bed</Label>
                      <Select value={form.bed} onValueChange={v => handleSelect("bed", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bed" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableBeds.length === 0 ? null : (
                            availableBeds.map((bed: any) => (
                              <SelectItem key={bed._id} value={bed.number.toString()}>
                                Bed {bed.number}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {availableBeds.length === 0 && (
                        <div className="text-red-600 text-xs mt-1">No beds available</div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Email Address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Password" />
                    </div>
                  </div>
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Adding..." : "Add Patient"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search Patients</CardTitle>
                <CardDescription>Find and manage existing patients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input placeholder="Search by name, phone, or ID..." className="flex-1" />
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Filter by Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All patients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Patients</SelectItem>
                      <SelectItem value="admitted">Admitted</SelectItem>
                      <SelectItem value="discharged">Discharged</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>Manage all registered patients</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Assigned Doctor</TableHead>
                    <TableHead>Bed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8}>Loading...</TableCell>
                    </TableRow>
                  ) : patients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>No patients found.</TableCell>
                    </TableRow>
                  ) : (
                    patients.map((patient: any) => (
                      <TableRow key={patient._id}>
                        <TableCell className="font-medium">{patient.firstName} {patient.lastName}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>{patient.doctor}</TableCell>
                        <TableCell>{patient.bed}</TableCell>
                        <TableCell>
                          <Badge variant={patient.status === "Admitted" ? "default" : "secondary"}>
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
