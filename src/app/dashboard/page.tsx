"use client"

import React, { useEffect } from "react"
import { useESGStore } from "@/hooks/use-esg-store"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// Modules Tabs
import { DashboardTab } from "@/components/dashboard-tab"
import { EnvironmentalTab } from "@/components/environmental-tab"
import { SocialTab } from "@/components/social-tab"
import { GovernanceTab } from "@/components/governance-tab"
import { GamificationTab } from "@/components/gamification-tab"
import { ReportsTab } from "@/components/reports-tab"
import { SettingsTab } from "@/components/settings-tab"

export default function Page() {
  const { currentTab, isAuthenticated } = useESGStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        Securing session, redirecting...
      </div>
    )
  }

  // Tab router
  const renderActiveTab = () => {
    switch (currentTab) {
      case "Dashboard":
        return <DashboardTab />
      case "Environmental":
        return <EnvironmentalTab />
      case "Social":
        return <SocialTab />
      case "Governance":
        return <GovernanceTab />
      case "Gamification":
        return <GamificationTab />
      case "Reports":
        return <ReportsTab />
      case "Settings":
        return <SettingsTab />
      default:
        return <DashboardTab />
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-zinc-50/30 dark:bg-zinc-950/20">
        <SiteHeader />
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1">
            {renderActiveTab()}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
