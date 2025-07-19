// app/patient/prescriptions/page.tsx
"use client"

import { useState } from "react"
import { PatientSidebar } from "@/components/patient-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Pill, Clock, User, RefreshCw, AlertCircle, CheckCircle, Calendar } from "lucide-react"

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      medication: "Lisinopril 10mg",
      prescribedBy: "Dr. Sarah Johnson",
      dosage: "Take 1 tablet daily",
      startDate: "Jan 15, 2024",
      endDate: "Jul 15, 2024",
      refillsLeft: 3,
      totalRefills: 5,
      status: "Active",
      instructions: "Take with food, preferably in the morning",
      sideEffects: "May cause dizziness, dry cough"
    },
    {
      id: 2,
      medication: "Metformin 500mg",
      prescribedBy: "Dr. Michael Chen",
      dosage: "Take 2 tablets twice daily",
      startDate: "Dec 1, 2023",
      endDate: "Dec 1, 2024",
      refillsLeft: 1,
      totalRefills: 6,
      status: "Active",
      instructions: "Take with meals to reduce stomach upset",
      sideEffects: "Nausea, stomach upset, metallic taste"
    },
    {
      id: 3,
      medication: "Aspirin 81mg",
      prescribedBy: "Dr. Sarah Johnson",
      dosage: "Take 1 tablet daily",
      startDate: "Nov 10, 2023",
      endDate: "Nov 10, 2024",
      refillsLeft: 0,
      totalRefills: 3,
      status: "Refill Needed",
      instructions: "Take with food to prevent stomach irritation",
      sideEffects: "Stomach irritation, bleeding risk"
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200"
      case "Refill Needed": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Expired": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleRefillRequest = (id: number) => {
    setPrescriptions(prev => 
      prev.map(p => 
        p.id === id 
          ? { ...p, status: "Refill Requested" }
          : p
      )
    )
  }

  return (
    <SidebarProvider>
      <PatientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-gradient-to-r from-green-50 to-blue-50">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-green-600" />
            <h1 className="text-lg font-semibold">Prescriptions</h1>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-green-600">My Prescriptions</h2>
              <p className="text-gray-600">Manage your medications and request refills</p>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{prescriptions.filter(p => p.status === 'Active').length}</span> active prescriptions
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {prescriptions.filter(p => p.status === 'Active').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Need Refill</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {prescriptions.filter(p => p.status === 'Refill Needed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Refills</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {prescriptions.reduce((sum, p) => sum + p.refillsLeft, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Doctors</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {new Set(prescriptions.map(p => p.prescribedBy)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prescriptions List */}
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Pill className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{prescription.medication}</h3>
                        <p className="text-gray-600">Prescribed by {prescription.prescribedBy}</p>
                        <p className="text-sm text-gray-500 mt-1">{prescription.dosage}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(prescription.status)}>
                      {prescription.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Treatment Period</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{prescription.startDate} - {prescription.endDate}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Refills Remaining</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{prescription.refillsLeft} of {prescription.totalRefills} refills left</span>
                            <span>{Math.round((prescription.refillsLeft / prescription.totalRefills) * 100)}%</span>
                          </div>
                          <Progress 
                            value={(prescription.refillsLeft / prescription.totalRefills) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Instructions</h4>
                        <p className="text-sm text-gray-600">{prescription.instructions}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Possible Side Effects</h4>
                        <p className="text-sm text-gray-600">{prescription.sideEffects}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRefillRequest(prescription.id)}
                      disabled={prescription.refillsLeft === 0}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Request Refill
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact Doctor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
