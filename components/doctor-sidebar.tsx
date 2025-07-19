"use client"

import type React from "react"

import { Calendar, Users, FileText, Pill, Activity, Bell, Settings, LogOut, Stethoscope } from "lucide-react"

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
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <Stethoscope className="h-6 w-6 text-blue-600" />
          <div>
            <p className="text-sm font-semibold">Doctor Portal</p>
            <p className="text-xs text-muted-foreground">MediCare System</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Medical Practice</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {doctorNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => {
              document.cookie = 'session=; Max-Age=0; path=/';
              window.location.href = '/';
            }}>
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
