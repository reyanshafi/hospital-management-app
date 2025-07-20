"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DoctorSidebar } from "@/components/doctor-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DoctorPatients() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Get user data from session cookie
    try {
      const session = document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
      if (session) {
        const user = JSON.parse(decodeURIComponent(session))
        setUserData(user.user)
      }
    } catch (error) {
      window.location.href = "/";
    }
  }, []);

  // Real-time fetch of patients for this doctor
  const { data, error, isLoading } = useSWR(
    userData?.name ? `/api/doctor/patients?doctorName=${encodeURIComponent(userData.name)}` : null,
    (url) => fetch(url).then(res => res.json())
  );
  const patients = data?.patients || [];

  const handleViewProfile = async (patientId) => {
    setProfileModalOpen(true);
    setProfileLoading(true);
    setProfileError("");
    try {
      const res = await fetch(`/api/patient/profile?patientId=${patientId}`);
      const data = await res.json();
      setProfileData(data);
    } catch (err) {
      setProfileError("Failed to fetch profile");
      setProfileData(null);
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">My Patients</h1>
        </header>
        <div className="flex-1 space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Patients</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center text-blue-600"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading patients...</div>
              ) : error ? (
                <div className="text-red-600">Failed to load patients.</div>
              ) : patients.length === 0 ? (
                <div className="text-gray-500">No patients assigned to you yet.</div>
              ) : (
                <div className="space-y-4">
                  {patients.map((patient, idx) => (
                    <div key={patient._id || idx} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-blue-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-semibold">{patient.firstName} {patient.lastName}</div>
                          <div className="text-xs text-gray-500">{patient.gender}, Age {patient.age}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{patient.phone}</span>
                        </div>
                        <Badge variant={patient.status === "Admitted" ? "default" : "secondary"}>{patient.status}</Badge>
                        <Button variant="outline" size="sm" onClick={() => handleViewProfile(patient._id)}>
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Patient Profile</DialogTitle>
            <DialogDescription>Full details for this patient</DialogDescription>
          </DialogHeader>
          {profileLoading ? (
            <div className="text-blue-600">Loading...</div>
          ) : profileError ? (
            <div className="text-red-600">{profileError}</div>
          ) : profileData ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">{profileData.firstName} {profileData.lastName}</span>
                <Badge variant="outline" className="ml-2">{profileData.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-semibold">Age:</span> {profileData.age}</div>
                <div><span className="font-semibold">Gender:</span> {profileData.gender}</div>
                <div><span className="font-semibold">Phone:</span> {profileData.phone}</div>
                <div><span className="font-semibold">Email:</span> {profileData.email}</div>
                <div><span className="font-semibold">Doctor:</span> {profileData.doctor}</div>
                <div><span className="font-semibold">Bed:</span> {profileData.bed}</div>
              </div>
            </div>
          ) : null}
          <DialogClose asChild>
            <Button variant="outline" className="mt-4 w-full">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}