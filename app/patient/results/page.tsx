// app/patient/results/page.tsx
"use client"

import { useState } from "react"
import { PatientSidebar } from "@/components/patient-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestTube, Download, Eye, Calendar, User, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"

export default function PatientResults() {
  const [results, setResults] = useState([
    {
      id: 1,
      testName: "Complete Blood Count (CBC)",
      orderedBy: "Dr. Sarah Johnson",
      date: "March 10, 2024",
      status: "Ready",
      category: "Blood Work",
      results: [
        { parameter: "Hemoglobin", value: "14.2", unit: "g/dL", range: "12.0-15.5", status: "normal" },
        { parameter: "White Blood Cells", value: "8.5", unit: "K/uL", range: "4.0-11.0", status: "normal" },
        { parameter: "Platelets", value: "320", unit: "K/uL", range: "150-450", status: "normal" }
      ]
    },
    {
      id: 2,
      testName: "Lipid Panel",
      orderedBy: "Dr. Michael Chen",
      date: "March 8, 2024",
      status: "Ready",
      category: "Blood Work",
      results: [
        { parameter: "Total Cholesterol", value: "220", unit: "mg/dL", range: "<200", status: "high" },
        { parameter: "HDL Cholesterol", value: "45", unit: "mg/dL", range: ">40", status: "normal" },
        { parameter: "LDL Cholesterol", value: "140", unit: "mg/dL", range: "<100", status: "high" },
        { parameter: "Triglycerides", value: "180", unit: "mg/dL", range: "<150", status: "high" }
      ]
    },
    {
      id: 3,
      testName: "Chest X-Ray",
      orderedBy: "Dr. Sarah Johnson",
      date: "March 5, 2024",
      status: "Ready",
      category: "Imaging",
      findings: "Normal chest X-ray. No acute cardiopulmonary abnormalities detected.",
      impression: "No evidence of pneumonia, pneumothorax, or other acute findings."
    },
    {
      id: 4,
      testName: "Thyroid Function Tests",
      orderedBy: "Dr. Michael Chen",
      date: "March 12, 2024",
      status: "Pending",
      category: "Blood Work"
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready": return "bg-green-100 text-green-800 border-green-200"
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getResultIcon = (status: string) => {
    switch (status) {
      case "high": return <TrendingUp className="h-4 w-4 text-red-500" />
      case "low": return <TrendingDown className="h-4 w-4 text-blue-500" />
      case "normal": return <Minus className="h-4 w-4 text-green-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getResultColor = (status: string) => {
    switch (status) {
      case "high": return "text-red-600 bg-red-50"
      case "low": return "text-blue-600 bg-blue-50"
      case "normal": return "text-green-600 bg-green-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <SidebarProvider>
      <PatientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-blue-600" />
            <h1 className="text-lg font-semibold">Test Results</h1>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-blue-600">My Test Results</h2>
              <p className="text-gray-600">View and download your lab reports and imaging studies</p>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{results.filter(r => r.status === 'Ready').length}</span> results ready
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {results.filter(r => r.status === 'Ready').length}
                  </p>
                  <p className="text-sm text-gray-600">Ready to View</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {results.filter(r => r.status === 'Pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {results.filter(r => r.category === 'Blood Work').length}
                  </p>
                  <p className="text-sm text-gray-600">Lab Tests</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {results.filter(r => r.category === 'Imaging').length}
                  </p>
                  <p className="text-sm text-gray-600">Imaging Studies</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results List */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Results</TabsTrigger>
              <TabsTrigger value="blood-work">Blood Work</TabsTrigger>
              <TabsTrigger value="imaging">Imaging</TabsTrigger>
              <TabsTrigger value="ready">Ready</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <TestTube className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{result.testName}</h3>
                          <p className="text-gray-600">Ordered by {result.orderedBy}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{result.date}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>

                    {result.status === 'Ready' && (
                      <div className="space-y-4">
                        {result.results && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-3">Test Results</h4>
                            <div className="space-y-2">
                              {result.results.map((item, index) => (
                                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${getResultColor(item.status)}`}>
                                  <div className="flex items-center space-x-2">
                                    {getResultIcon(item.status)}
                                    <span className="font-medium">{item.parameter}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold">
                                      {item.value} {item.unit}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      Normal: {item.range}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.findings && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Findings</h4>
                            <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{result.findings}</p>
                          </div>
                        )}

                        {result.impression && (
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Impression</h4>
                            <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{result.impression}</p>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    )}

                    {result.status === 'Pending' && (
                      <div className="text-center py-8">
                        <TestTube className="h-12 w-12 mx-auto mb-4 text-yellow-500 opacity-50" />
                        <p className="text-gray-600">Results are being processed. You'll be notified when ready.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="blood-work">
              {/* Filter for blood work only */}
            </TabsContent>

            <TabsContent value="imaging">
              {/* Filter for imaging only */}
            </TabsContent>

            <TabsContent value="ready">
              {/* Filter for ready results only */}
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
