// app/patient/appointments/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PatientSidebar } from "@/components/patient-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, MapPin, Plus, Phone, Loader2, X } from "lucide-react"

export default function PatientAppointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [form, setForm] = useState({ doctor: "", date: "", time: "", type: "Consultation" });
  const [booking, setBooking] = useState({ loading: false, error: "", success: "" });

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return null;
  };

  const fetchAppointments = async (patientId: string) => {
    try {
      const res = await fetch(`/api/patient/appointments?patientId=${patientId}`);
      const data = await res.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/admin/doctors");
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (error) {
      setDoctors([]);
    }
  };

  useEffect(() => {
    const validateUser = () => {
      try {
        const sessionCookie = getCookie('session');
        if (!sessionCookie) {
          router.replace("/");
          return;
        }
        const user = JSON.parse(decodeURIComponent(sessionCookie));
        if (!user || !user.user || user.user.role !== "patient") {
          router.replace("/");
          return;
        }
        setUserData(user);
        setIsAuthorized(true);
        const patientId = user.user._id;
        fetchAppointments(patientId);
        // Set up polling for real-time updates
        const interval = setInterval(() => {
          fetchAppointments(patientId);
        }, 5000);
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error parsing session:', error);
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };
    const cleanup = validateUser();
    return cleanup;
  }, [router]);

  const openBookingModal = () => {
    setShowModal(true);
    fetchDoctors();
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    setForm({ ...form, date: today });
  };

  const closeBookingModal = () => {
    setShowModal(false);
    setForm({ doctor: "", date: "", time: "", type: "Consultation" });
    setBooking({ loading: false, error: "", success: "" });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBooking({ loading: true, error: "", success: "" });
    try {
      const res = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: userData.user._id,
          doctor: form.doctor,
          date: form.date,
          time: form.time,
          type: form.type,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBooking({ loading: false, error: data.error || "Failed to book appointment", success: "" });
      } else {
        setBooking({ loading: false, error: "", success: "Appointment request sent for admin approval." });
        setTimeout(() => {
          closeBookingModal();
          fetchAppointments(userData.user._id);
        }, 1200);
      }
    } catch (error) {
      setBooking({ loading: false, error: "Failed to book appointment", success: "" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading your appointments...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized || !userData) {
    return null;
  }

  return (
    <SidebarProvider>
      <PatientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold">Appointments</h1>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">My Appointments</h2>
              <p className="text-gray-600">Manage your upcoming medical appointments</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openBookingModal}>
              <Plus className="mr-2 h-4 w-4" />
              Book New Appointment
            </Button>
          </div>

          {/* Booking Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={closeBookingModal}>
                  <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
                <form onSubmit={handleBook} className="space-y-4">
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
                      {doctors.map((doc: any) => (
                        <option key={doc._id} value={doc.name}>{doc.name} ({doc.specialty})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleFormChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleFormChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                      required
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Annual Checkup">Annual Checkup</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {booking.error && <div className="text-red-600 text-sm">{booking.error}</div>}
                  {booking.success && <div className="text-green-600 text-sm">{booking.success}</div>}
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={booking.loading}>
                    {booking.loading ? "Booking..." : "Book Appointment"}
                  </Button>
                </form>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {appointments.length === 0 ? (
              <div className="text-gray-500 text-center py-12">No appointments found.</div>
            ) : (
              appointments.map((appointment: any) => (
                <Card key={appointment._id || appointment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{appointment.doctor?.name || appointment.doctor || "Doctor"}</h3>
                            <p className="text-gray-600">{appointment.specialty || ""}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{appointment.location || "TBD"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                              {appointment.status || "Scheduled"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
