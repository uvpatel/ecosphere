"use client"

import * as React from "react"
import { useESGStore } from "@/hooks/use-esg-store"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Leaf,
  Heart,
  ShieldCheck,
  Trophy,
  FileBarChart,
  Settings,
  Globe
} from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentTab, setCurrentTab, currentUser } = useESGStore()

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      color: "text-blue-500"
    },
    {
      title: "Environmental",
      icon: <Leaf className="h-4 w-4" />,
      color: "text-emerald-500"
    },
    {
      title: "Social",
      icon: <Heart className="h-4 w-4" />,
      color: "text-rose-500"
    },
    {
      title: "Governance",
      icon: <ShieldCheck className="h-4 w-4" />,
      color: "text-amber-500"
    },
    {
      title: "Gamification",
      icon: <Trophy className="h-4 w-4" />,
      color: "text-indigo-500"
    },
    {
      title: "Reports",
      icon: <FileBarChart className="h-4 w-4" />,
      color: "text-cyan-500"
    },
    {
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
      color: "text-zinc-500"
    }
  ]

  const userForSidebar = {
    name: currentUser.name,
    email: currentUser.email,
    avatar: currentUser.role === "Admin" ? "/avatars/admin.png" : "/avatars/employee.png"
  }

  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r border-zinc-200 dark:border-zinc-800">
      <SidebarHeader className="border-b border-zinc-100 p-4 dark:border-zinc-800/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                <Globe className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  EcoSphere ERP
                </span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  ESG Compliance Engine
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <div className="px-3 py-2 text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
          ESG MODULES
        </div>
        <SidebarMenu className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentTab === item.title
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => setCurrentTab(item.title)}
                  className={`w-full justify-start gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive
                      ? "bg-zinc-100 text-zinc-900 font-medium dark:bg-zinc-900 dark:text-zinc-50"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-50"
                  }`}
                >
                  <span className={`${isActive ? item.color : "text-zinc-400 dark:text-zinc-500"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-100 p-2 dark:border-zinc-800/50">
        <NavUser user={userForSidebar} />
      </SidebarFooter>
    </Sidebar>
  )
}
