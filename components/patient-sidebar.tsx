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
    <Sidebar {...props} className="bg-gradient-to-b from-green-50/60 via-white/80 to-blue-50/40 border-r border-green-100/40 shadow-xl rounded-r-2xl backdrop-blur-md">
      <SidebarHeader className="border-b border-green-100/40 bg-gradient-to-r from-green-50/60 to-blue-50/60 rounded-t-2xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold bg-gradient-to-r from-green-800 to-blue-700 bg-clip-text text-transparent">Patient Portal</p>
            <p className="text-xs text-green-700 font-medium">MediCare System</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">
            Healthcare
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 space-y-1">
              {patientNavItems.map((item) => {
                const isActive = pathname === item.url
                const isEmergency = item.isEmergency
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`group relative rounded-xl transition-all duration-300 border border-transparent px-2 py-1.5 flex items-center gap-3
                        ${isActive ? 'bg-gradient-to-r from-green-200/80 to-green-100/80 shadow font-bold text-green-900 border-green-300' :
                          isEmergency ? 'hover:bg-red-50 text-red-600 hover:text-red-700' :
                          'hover:bg-green-50/60 text-green-700'}
                      `}
                    >
                      <a href={item.url} className="flex items-center gap-3 w-full">
                        <span className={`p-2 rounded-lg shadow-sm transition-all duration-300 border border-green-100/60
                          ${isActive ? 'bg-green-100/80' : 'bg-white/80 group-hover:bg-green-50/80'}`}
                        >
                          <item.icon className={`h-4 w-4 ${isActive ? 'text-green-700' : 'text-green-500 group-hover:text-green-700'}`} />
                        </span>
                        <span className="font-medium text-sm truncate">
                          {item.title}
                        </span>
                        {item.isEmergency && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-green-100/40 bg-gradient-to-r from-green-50/60 to-blue-50/60 p-3 rounded-b-2xl">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="group w-full rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:shadow-sm transition-all duration-300 border border-transparent hover:border-red-200/50"
            >
              <div className="flex items-center gap-3 px-3 py-2.5 w-full">
                <div className="p-2 rounded-lg bg-white/80 group-hover:bg-red-100 group-hover:shadow-sm transition-all duration-300 border border-green-100/50 group-hover:border-red-200">
                  <LogOut className="h-4 w-4 text-green-700 group-hover:text-red-600 transition-colors duration-300" />
                </div>
                <span className="font-medium text-green-700 group-hover:text-red-700 transition-colors duration-300">
                  Sign Out
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
