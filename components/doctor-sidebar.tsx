"use client"
import type React from "react"
import { Calendar, Users, FileText, Pill, Activity, Bell, Settings, LogOut, Stethoscope, TestTube } from "lucide-react"
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

const doctorNavItems = [
  {
    title: "Dashboard",
    url: "/doctor/dashboard",
    icon: Activity,
  },
  {
    title: "Appointments",
    url: "/doctor/appointments",
    icon: Calendar,
  },
  {
    title: "My Patients",
    url: "/doctor/patients",
    icon: Users,
  },
  {
    title: "Medical Records",
    url: "/doctor/records",
    icon: FileText,
  },
  {
    title: "Prescriptions",
    url: "/doctor/prescriptions",
    icon: Pill,
  },
  {
    title: "Test Results",
    url: "/doctor/results",
    icon: TestTube,
  },
  {
    title: "Emergency Alerts",
    url: "/doctor/alerts",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/doctor/settings",
    icon: Settings,
  },
]

export function DoctorSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="bg-gradient-to-b from-slate-50 to-blue-50/30 border-r border-slate-200/60">
      <SidebarHeader className="border-b border-slate-200/60 bg-gradient-to-r from-blue-50 to-indigo-50/80">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">Doctor Portal</p>
            <p className="text-xs text-slate-600 font-medium">MediCare System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Medical Practice
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-3 space-y-1">
              {doctorNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="group relative rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-sm transition-all duration-300 border border-transparent hover:border-blue-200/50"
                  >
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                      <div className="p-2 rounded-lg bg-white/80 group-hover:bg-blue-100 group-hover:shadow-sm transition-all duration-300 border border-slate-200/50 group-hover:border-blue-200">
                        <item.icon className="h-4 w-4 text-slate-600 group-hover:text-blue-600 transition-colors duration-300" />
                      </div>
                      <span className="font-medium text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
                        {item.title}
                      </span>
                      {item.title === "Emergency Alerts" && (
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50/50 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => {
                document.cookie = 'session=; Max-Age=0; path=/';
                window.location.href = '/';
              }}
              className="group w-full rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:shadow-sm transition-all duration-300 border border-transparent hover:border-red-200/50"
            >
              <div className="flex items-center gap-3 px-3 py-2.5 w-full">
                <div className="p-2 rounded-lg bg-white/80 group-hover:bg-red-100 group-hover:shadow-sm transition-all duration-300 border border-slate-200/50 group-hover:border-red-200">
                  <LogOut className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors duration-300" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-red-700 transition-colors duration-300">
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