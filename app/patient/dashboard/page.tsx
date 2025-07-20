"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PatientSidebar } from "@/components/patient-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, TestTube, Pill, AlertTriangle, Clock, Heart, Phone, Loader2, Stethoscope, Syringe, Activity, ClipboardList } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function PatientDashboard() {
  const router = useRouter()
  
  type UserData = { user: { _id: string; name: string; role: string; email: string; avatar?: string } }
  type Appointment = { _id: string; doctor: string; date: string; time: string; type: string; status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected' };
  type Visit = { _id: string; type: string; doctor: string; date: string; status: string; notes?: string }
  type Prescription = { _id: string; medication: string; doctor: string; refills: number; expires: string; dosage: string }
  type Result = { _id: string; status: 'pending' | 'completed' | 'urgent'; report: string; date: string; testName: string }

  const [userData, setUserData] = useState<UserData | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [visits, setVisits] = useState<Visit[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return null;
  }

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
        fetchPatientData(patientId);

      } catch (error) {
        console.error('Error parsing session:', error);
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    validateUser();
  }, [router]);

  const fetchPatientData = async (patientId: string) => {
    try {
      const [appointmentsRes, visitsRes, prescriptionsRes, resultsRes] = await Promise.all([
        fetch(`/api/patient/appointments?patientId=${patientId}`),
        fetch(`/api/patient/visits?patientId=${patientId}`),
        fetch(`/api/patient/prescriptions?patientId=${patientId}`),
        fetch(`/api/patient/results?patientId=${patientId}`)
      ]);

      const [appointmentsData, visitsData, prescriptionsData, resultsData] = await Promise.all([
        appointmentsRes.json(),
        visitsRes.json(),
        prescriptionsRes.json(),
        resultsRes.json()
      ]);

      setAppointments(appointmentsData);
      setVisits(visitsData);
      setPrescriptions(prescriptionsData);
      setResults(resultsData);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  useEffect(() => {
    if (!isAuthorized || !userData) return;
    const patientId = userData.user._id;
    let isMounted = true;
    const fetchAll = async () => {
      try {
        const [appointmentsRes, visitsRes, prescriptionsRes, resultsRes] = await Promise.all([
          fetch(`/api/patient/appointments?patientId=${patientId}`),
          fetch(`/api/patient/visits?patientId=${patientId}`),
          fetch(`/api/patient/prescriptions?patientId=${patientId}`),
          fetch(`/api/patient/results?patientId=${patientId}`)
        ]);
        const [appointmentsData, visitsData, prescriptionsData, resultsData] = await Promise.all([
          appointmentsRes.json(),
          visitsRes.json(),
          prescriptionsRes.json(),
          resultsRes.json()
        ]);
        if (isMounted) {
          setAppointments(Array.isArray(appointmentsData) ? appointmentsData : appointmentsData.appointments || []);
          setVisits(Array.isArray(visitsData) ? visitsData : visitsData.visits || []);
          setPrescriptions(Array.isArray(prescriptionsData) ? prescriptionsData : prescriptionsData.prescriptions || []);
          setResults(Array.isArray(resultsData) ? resultsData : resultsData.results || resultsData || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching patient data:', error);
        }
      }
    };
    fetchAll();
    return () => { isMounted = false; };
  }, [isAuthorized, userData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized || !userData) {
    return null;
  }

  // Helper functions
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const upcomingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const pendingResults = results.filter(r => r.status === 'pending');
  const urgentResults = results.filter(r => r.status === 'urgent');

  return (
    <SidebarProvider>
      <PatientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-gradient-to-r from-blue-50 to-indigo-50/80 sticky top-0 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">Patient Portal</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userData.user.avatar} />
              <AvatarFallback>{getInitials(userData.user.name)}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        <div className="flex-1 space-y-6 p-6 bg-gradient-to-b from-slate-50 to-blue-50/30 min-h-screen">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {userData.user.name}
              </h2>
              <p className="text-muted-foreground mt-1">Here's your health summary for today</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium">Portal Active</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>

          {/* Emergency Alert */}
          <Alert variant="destructive" className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-red-800">Medical Emergency</AlertTitle>
            <AlertDescription className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <span className="text-red-800">
                Need immediate medical attention? Use our emergency alert system.
              </span>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 shadow-sm w-full md:w-auto" asChild>
                <a href="/patient/emergency">Emergency Alert</a>
              </Button>
            </AlertDescription>
          </Alert>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50/80 via-white/90 to-emerald-100/80 backdrop-blur-md hover:shadow-2xl transition-shadow rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-100/60 to-emerald-50/60 rounded-t-2xl border-b border-green-100/40">
                <CardTitle className="text-base font-bold text-emerald-800 tracking-wide flex items-center gap-3">
                  <span className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg mr-2">
                    <Calendar className="h-5 w-5 text-white drop-shadow" />
                  </span>
                  Next Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6">
                {upcomingAppointments.length > 0 ? (
                  <>
                    <div className="text-xl font-bold text-gray-900">{upcomingAppointments[0].date}</div>
                    <p className="text-sm text-gray-600 mt-1">{upcomingAppointments[0].doctor}</p>
                    <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-600 border-blue-100">
                      {upcomingAppointments[0].time}
                    </Badge>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-gray-400">None scheduled</div>
                    <Button variant="link" size="sm" className="h-6 p-0 text-blue-600" asChild>
                      <a href="/patient/appointments">Book now</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50/80 via-white/90 to-yellow-100/80 backdrop-blur-md hover:shadow-2xl transition-shadow rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-100/60 to-yellow-50/60 rounded-t-2xl border-b border-orange-100/40">
                <CardTitle className="text-base font-bold text-orange-800 tracking-wide flex items-center gap-3">
                  <span className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 shadow-lg mr-2">
                    <TestTube className="h-5 w-5 text-white drop-shadow" />
                  </span>
                  Pending Results
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6">
                <div className="text-xl font-bold text-gray-900">{pendingResults.length}</div>
                <p className="text-sm text-gray-600 mt-1">Lab reports pending</p>
                {urgentResults.length > 0 && (
                  <Badge variant="destructive" className="mt-2">
                    {urgentResults.length} urgent
                  </Badge>
                )}
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50/80 via-white/90 to-lime-100/80 backdrop-blur-md hover:shadow-2xl transition-shadow rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-100/60 to-lime-50/60 rounded-t-2xl border-b border-green-100/40">
                <CardTitle className="text-base font-bold text-lime-800 tracking-wide flex items-center gap-3">
                  <span className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-green-400 to-lime-400 shadow-lg mr-2">
                    <Pill className="h-5 w-5 text-white drop-shadow" />
                  </span>
                  Active Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6">
                <div className="text-xl font-bold text-gray-900">{prescriptions.length}</div>
                <p className="text-sm text-gray-600 mt-1">Current medications</p>
                {prescriptions.length > 0 && (
                  <div className="mt-2">
                    <Progress value={(prescriptions.filter(p => new Date(p.expires) > new Date()).length / prescriptions.length) * 100} className="h-2 bg-green-50" />
                    <p className="text-xs text-gray-500 mt-1">
                      {prescriptions.filter(p => new Date(p.expires) > new Date()).length} active
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50/80 via-white/90 to-indigo-100/80 backdrop-blur-md hover:shadow-2xl transition-shadow rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-100/60 to-indigo-50/60 rounded-t-2xl border-b border-purple-100/40">
                <CardTitle className="text-base font-bold text-indigo-800 tracking-wide flex items-center gap-3">
                  <span className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg mr-2">
                    <Activity className="h-5 w-5 text-white drop-shadow" />
                  </span>
                  Health Score
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6">
                <div className="text-xl font-bold text-gray-900">82/100</div>
                <p className="text-sm text-gray-600 mt-1">Good condition</p>
                <div className="mt-2">
                  <Progress value={82} className="h-2 bg-purple-50" />
                  <p className="text-xs text-gray-500 mt-1">Based on recent data</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Activity */}
            <Card className="col-span-4 shadow-sm border-0 bg-white/90 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                    <CardTitle>Recent Medical Activity</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600" asChild>
                    <a href="/patient/visits">View all</a>
                  </Button>
                </div>
                <CardDescription>Your latest appointments and test results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {visits.length > 0 ? visits.slice(0, 3).map((visit) => (
                  <div
                    key={visit._id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-2 rounded-full bg-blue-50">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{visit.type}</p>
                        <p className="text-sm text-gray-600">{visit.doctor}</p>
                        <p className="text-xs text-gray-500 mt-1">{visit.date}</p>
                        {visit.notes && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-1">{visit.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge
                        variant={
                          visit.status === "Results Available" ? "default" : 
                          visit.status === "Completed" ? "secondary" : "outline"
                        }
                        className={
                          visit.status === "Results Available" ? 
                            "bg-green-100 text-green-800 border-green-200" : 
                            visit.status === "Completed" ?
                            "bg-gray-100 text-gray-600" :
                            "bg-blue-100 text-blue-800"
                        }
                      >
                        {visit.status}
                      </Badge>
                      <div>
                        <Button variant="ghost" size="sm" className="rounded-lg text-blue-600">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent medical activity</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <a href="/patient/appointments">Schedule an appointment</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="col-span-3 shadow-sm border-0 bg-white/90 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quick Actions</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600" asChild>
                    <a href="/patient/services">All services</a>
                  </Button>
                </div>
                <CardDescription>Common tasks and services</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-24 flex-col gap-2" asChild>
                  <a href="/patient/appointments">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Book Appointment</span>
                  </a>
                </Button>

                <Button variant="outline" className="h-24 flex-col gap-2" asChild>
                  <a href="/patient/results">
                    <TestTube className="h-5 w-5 text-orange-600" />
                    <span>Test Results</span>
                  </a>
                </Button>

                <Button variant="outline" className="h-24 flex-col gap-2" asChild>
                  <a href="/patient/prescriptions">
                    <Pill className="h-5 w-5 text-green-600" />
                    <span>Prescriptions</span>
                  </a>
                </Button>

                <Button variant="outline" className="h-24 flex-col gap-2" asChild>
                  <a href="/patient/billing">
                    <Syringe className="h-5 w-5 text-purple-600" />
                    <span>Billing</span>
                  </a>
                </Button>

                <Button variant="outline" className="h-24 flex-col gap-2 col-span-2" asChild>
                  <a href="/patient/telehealth">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>Start Telehealth Visit</span>
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50/80 via-white/90 to-indigo-100/80 backdrop-blur-md hover:shadow-2xl transition-shadow rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-100/60 to-indigo-50/60 rounded-t-2xl border-b border-blue-100/40">
              <CardTitle className="text-base font-bold text-blue-800 tracking-wide flex items-center gap-3">
                <span className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg mr-2">
                  <Calendar className="h-5 w-5 text-white drop-shadow" />
                </span>
                Upcoming Appointments
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-blue-700 font-semibold hover:bg-blue-100/40 rounded-full" asChild>
                <a href="/patient/appointments">View all</a>
              </Button>
            </CardHeader>
            <CardContent className="pt-4 pb-6 px-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingAppointments.length > 0 ? upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment._id} className="p-5 border-0 rounded-2xl bg-white/80 shadow-md hover:shadow-lg transition-all flex flex-col gap-3 relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Calendar className="h-20 w-20 text-blue-400" />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h4 className="font-semibold text-blue-900 text-lg leading-tight">{appointment.doctor}</h4>
                        <p className="text-xs text-blue-500 font-medium">{appointment.type}</p>
                      </div>
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize px-3 py-1 rounded-full text-xs font-semibold shadow bg-gradient-to-r from-blue-200 to-indigo-100 border-0 text-blue-800">
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-blue-800 font-medium bg-blue-50/60 rounded-lg px-3 py-2 shadow-inner">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>{appointment.date}</span>
                      <Clock className="h-4 w-4 text-blue-500 ml-2" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="rounded-lg flex-1 border-blue-200 text-blue-700 font-semibold hover:bg-blue-50/60">
                        <Phone className="h-3 w-3 mr-1" /> Call
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg flex-1 border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50/60">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-blue-400 col-span-3">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="font-semibold text-lg">No upcoming appointments</p>
                    <Button className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-lg hover:from-blue-600 hover:to-indigo-600 rounded-full px-6 py-2" asChild>
                      <a href="/patient/appointments">Schedule an Appointment</a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Health Summary */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Active Prescriptions */}
            <Card className="shadow-sm border-0 bg-white/90 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Pill className="h-5 w-5 text-green-600" />
                    <CardTitle>Active Prescriptions</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600" asChild>
                    <a href="/patient/prescriptions">View all</a>
                  </Button>
                </div>
                <CardDescription>Your current medications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {prescriptions.length > 0 ? prescriptions.slice(0, 2).map((prescription) => (
                  <div key={prescription._id} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{prescription.medication}</h4>
                        <p className="text-sm text-gray-600">{prescription.dosage}</p>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100">
                        {prescription.refills} refills
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Prescribed by {prescription.doctor}</p>
                    <p className="text-xs text-gray-500 mb-4">Expires: {prescription.expires}</p>
                    <Button variant="outline" size="sm" className="w-full rounded-lg hover:bg-green-50 text-green-600">
                      Request Refill
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No active prescriptions</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card className="shadow-sm border-0 bg-white/90 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TestTube className="h-5 w-5 text-orange-600" />
                    <CardTitle>Recent Test Results</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600" asChild>
                    <a href="/patient/results">View all</a>
                  </Button>
                </div>
                <CardDescription>Your latest lab reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {results.length > 0 ? results.slice(0, 2).map((result) => (
                  <div key={result._id} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{result.testName}</h4>
                        <p className="text-sm text-gray-600">Completed: {result.date}</p>
                      </div>
                      <Badge 
                        variant={result.status === 'urgent' ? 'destructive' : 'outline'}
                        className={result.status === 'urgent' ? '' : 'bg-orange-50 text-orange-600 border-orange-100'}
                      >
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{result.report}</p>
                    <Button variant="outline" size="sm" className="w-full rounded-lg hover:bg-orange-50 text-orange-600">
                      View Details
                    </Button>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-500">
                    <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent test results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}