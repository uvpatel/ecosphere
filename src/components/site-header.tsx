"use client"

import React, { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useESGStore } from "@/hooks/use-esg-store"
import { Bell, Award, Coins, Check, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const {
    currentUser,
    simulatedUsers,
    setCurrentUserById,
    currentTab,
    notifications,
    clearNotifications,
    markNotificationRead
  } = useESGStore()

  const [notifOpen, setNotifOpen] = useState(false)
  const unreadNotifications = notifications.filter(n => !n.read)

  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b bg-white px-4 transition-[width,height] ease-linear dark:bg-black group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex items-center gap-1 lg:gap-2">
        <SidebarTrigger className="-ml-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4"
        />
        <span className="text-sm font-semibold tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
          EcoSphere
        </span>
        <span className="text-zinc-400">/</span>
        <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {currentTab}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User Stats (only for employee role) */}
        {currentUser.role === "Employee" && (
          <div className="hidden items-center gap-3 rounded-full bg-zinc-50 px-4 py-1.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 sm:flex">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Award className="h-3.5 w-3.5" />
              {currentUser.xp} XP
            </span>
            <Separator orientation="vertical" className="h-3 bg-zinc-200 dark:bg-zinc-800" />
            <span className="flex items-center gap-1 text-amber-500">
              <Coins className="h-3.5 w-3.5" />
              {currentUser.points} Points
            </span>
          </div>
        )}

        {/* Notifications Dropdown */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="relative h-9 w-9 rounded-full border border-zinc-200 dark:border-zinc-800"
              />
            }
          >
            <Bell className="h-4.5 w-4.5 text-zinc-600 dark:text-zinc-400" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadNotifications.length}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 dark:bg-zinc-950">
            <div className="flex items-center justify-between border-b pb-2 mb-2 px-1">
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Notifications</span>
              {unreadNotifications.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearNotifications}
                  className="h-6 px-2 text-[10px] font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
                >
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  No notifications yet.
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-2 rounded text-left transition-colors cursor-pointer ${
                      notif.read
                        ? "hover:bg-zinc-50 dark:hover:bg-zinc-900/50 opacity-60"
                        : "bg-emerald-50/30 border-l-2 border-emerald-500 hover:bg-emerald-50/50 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        {notif.title}
                      </p>
                      {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 mt-1" />}
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-1">
                      {notif.date}
                    </span>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Simulator Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="hidden text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 md:inline">
            SIMULATE USER:
          </span>
          <select
            value={currentUser.id}
            onChange={(e) => setCurrentUserById(e.target.value)}
            className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-xs font-semibold text-zinc-700 outline-none transition-all focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          >
            {simulatedUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  )
}
