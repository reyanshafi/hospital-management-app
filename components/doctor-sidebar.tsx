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
import { usePathname } from "next/navigation";

export function DoctorSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
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
  ];
  const handleSignOut = () => {
    document.cookie = 'session=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    window.location.href = '/';
  };
  return (
    <Sidebar className="border-r" {...props}>
      <SidebarHeader className="border-b bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Doctor Portal</p>
            <p className="text-xs text-gray-500">MediCare System</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase mb-3">
            Medical Practice
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {doctorNavItems.map((item) => {
                const isActive = pathname === item.url;
                const isEmergency = item.title.toLowerCase().includes("emergency");
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`h-10 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
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
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
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
  );
}