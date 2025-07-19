"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Calendar, FileText, Pill, TestTube, AlertTriangle, User, Settings, LogOut, Heart } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const patientNavItems = [
  {
    title: "Dashboard",
    url: "/patient/dashboard",
    icon: Heart,
  },
  {
    title: "Appointments",
    url: "/patient/appointments",
    icon: Calendar,
  },
  {
    title: "Medical Records",
    url: "/patient/records",
    icon: FileText,
  },
  {
    title: "Prescriptions",
    url: "/patient/prescriptions",
    icon: Pill,
  },
  {
    title: "Test Results",
    url: "/patient/results",
    icon: TestTube,
  },
  {
    title: "Emergency Alert",
    url: "/patient/emergency",
    icon: AlertTriangle,
    isEmergency: true,
  },
  {
    title: "Profile",
    url: "/patient/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/patient/settings",
    icon: Settings,
  },
]

export function PatientSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const handleSignOut = () => {
    document.cookie = 'session=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    window.location.href = '/'
  }

  return (
    <Sidebar className="border-r" {...props}>
      {/* Header */}
      <SidebarHeader className="border-b bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">MediCare Portal</p>
            <p className="text-xs text-gray-500">Patient Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase mb-3">
            Healthcare
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {patientNavItems.map((item) => {
                const isActive = pathname === item.url
                const isEmergency = item.isEmergency
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`h-10 rounded-lg transition-colors duration-200 ${
                        isActive 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : isEmergency
                            ? 'hover:bg-red-50 text-red-600 hover:text-red-700'
                            : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="h-10 w-full rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
