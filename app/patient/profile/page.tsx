// app/patient/profile/page.tsx
"use client"

import { useState, useEffect } from "react"
import { PatientSidebar } from "@/components/patient-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Phone, Mail, MapPin, Calendar, Heart, Edit, Save, Camera, Shield, AlertCircle } from "lucide-react"

export default function PatientProfile() {
  const [userData, setUserData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    try {
      const session = document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1]
      if (session) {
        const user = JSON.parse(decodeURIComponent(session))
        setUserData(user.user)
      }
    } catch (error) {
      console.error('Error parsing session:', error)
    }
  }, [])

  // Replace polling useEffect with a single fetch on mount or when userData changes
  useEffect(() => {
    if (!userData?._id) return
    let isMounted = true
    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`/api/patient/profile?patientId=${userData._id}`)
        const data = await res.json()
        if (isMounted) setProfileData(data)
      } catch (err: any) {
        if (isMounted) setError("Failed to fetch profile data")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchProfile()
    return () => { isMounted = false }
  }, [userData])

  // On save or cancel, refetch profile data
  const handleSave = async () => {
    setError(""); setSuccess("")
    if (!profileData) return
    try {
      const res = await fetch("/api/patient/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: userData._id,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          email: profileData.email,
          oldPassword: newPassword ? oldPassword : undefined,
          newPassword: newPassword || undefined
        })
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed to update profile")
      setSuccess("Profile updated successfully")
      setIsEditing(false)
      setOldPassword("")
      setNewPassword("")
      // Refetch profile data after save
      const refetch = await fetch(`/api/patient/profile?patientId=${userData._id}`)
      setProfileData(await refetch.json())
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setOldPassword("")
    setNewPassword("")
    // Refetch profile data after cancel
    if (userData?._id) {
      fetch(`/api/patient/profile?patientId=${userData._id}`)
        .then(res => res.json())
        .then(data => setProfileData(data))
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen text-blue-600">Loading...</div>
  if (!profileData) return null

  return (
    <SidebarProvider>
      <PatientSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-gradient-to-r from-purple-50 to-blue-50">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-purple-600">My Profile</h2>
              <p className="text-gray-600">Manage your personal information and medical details</p>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList>
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="medical">Medical Information</TabsTrigger>
              <TabsTrigger value="insurance">Insurance & Pharmacy</TabsTrigger>
              <TabsTrigger value="security">Security & Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                  <CardDescription>Your basic personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src="/patient-avatar.jpg" alt="Profile" />
                        <AvatarFallback className="text-lg bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                          {getInitials(profileData.firstName, profileData.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{profileData.firstName} {profileData.lastName}</h3>
                      <p className="text-gray-600">{userData?.email}</p>
                      <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">
                        Patient ID: PAT-{userData?._id?.slice(-6).toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                        disabled={!isEditing}
                        className={isEditing ? "border-purple-300 focus:border-purple-500" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                        disabled={!isEditing}
                        className={isEditing ? "border-purple-300 focus:border-purple-500" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          className={`pl-10 ${isEditing ? "border-purple-300 focus:border-purple-500" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          className={`pl-10 ${isEditing ? "border-purple-300 focus:border-purple-500" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                          disabled={!isEditing}
                          className={`pl-10 ${isEditing ? "border-purple-300 focus:border-purple-500" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        disabled={!isEditing}
                        className={isEditing ? "border-purple-300 focus:border-purple-500" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="assignedDoctor">Assigned Doctor</Label>
                      <Input
                        id="assignedDoctor"
                        value={profileData.doctor || 'Not assigned'}
                        disabled
                        className="bg-gray-100 text-gray-700 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        disabled={!isEditing}
                        className={`pl-10 ${isEditing ? "border-purple-300 focus:border-purple-500" : ""}`}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Medical Information</span>
                  </CardTitle>
                  <CardDescription>Important medical details for your healthcare providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Input
                        id="bloodType"
                        value={profileData.bloodType}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bloodType: e.target.value }))}
                        disabled={!isEditing}
                        className={isEditing ? "border-purple-300 focus:border-purple-500" : ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={profileData.allergies}
                      onChange={(e) => setProfileData(prev => ({ ...prev, allergies: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="List any known allergies (medications, food, environmental, etc.)"
                      className={isEditing ? "border-purple-300 focus:border-purple-500" : ""}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalConditions">Medical Conditions</Label>
                    <Textarea
                      id="medicalConditions"
                      value={profileData.medicalConditions}
                      onChange={(e) => setProfileData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="List current medical conditions and diagnoses"
                      className={isEditing ? "border-purple-300 focus:border-purple-500" : ""}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insurance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Insurance & Pharmacy</CardTitle>
                  <CardDescription>Your insurance and pharmacy information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      <Input
                        id="insuranceProvider"
                        value={profileData.insuranceProvider}
                        onChange={(e) => setProfileData(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                        disabled={!isEditing}
                        className={isEditing ? "border-purple-300 focus:border-purple-500" : ""}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="insuranceNumber">Insurance Number</Label>
                      <Input
                        id="insuranceNumber"
                        value={profileData.insuranceNumber}
                        onChange={(e) => setProfileData(prev => ({ ...prev, insuranceNumber: e.target.value }))}
                        disabled={!isEditing}
                        className={isEditing ? "border-purple-300 focus:border-purple-500" : ""}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredPharmacy">Preferred Pharmacy</Label>
                    <Input
                      id="preferredPharmacy"
                      value={profileData.preferredPharmacy}
                      onChange={(e) => setProfileData(prev => ({ ...prev, preferredPharmacy: e.target.value }))}
                      disabled={!isEditing}
                      className={isEditing ? "border-purple-300 focus:border-purple-500" : ""}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>Security & Privacy</span>
                  </CardTitle>
                  <CardDescription>Change your password and manage privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Old Password</Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={oldPassword}
                      onChange={e => setOldPassword(e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      disabled={!isEditing}
                      className={isEditing ? "border-blue-300 focus:border-blue-500" : ""}
                    />
                  </div>
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
