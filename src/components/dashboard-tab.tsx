"use client"

import React from "react"
import { useESGStore } from "@/hooks/use-esg-store"
import { calculateESGData } from "@/lib/esg-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Leaf, Heart, Users, Calendar, ArrowUpRight, TrendingDown } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from "recharts"

export function DashboardTab() {
  const {
    departments,
    carbonTransactions,
    employeeParticipations,
    challengeParticipations,
    policyAcknowledgements,
    policies,
    complianceIssues,
    settings,
    simulatedUsers
  } = useESGStore()

  const esgData = calculateESGData(
    departments,
    carbonTransactions,
    employeeParticipations,
    challengeParticipations,
    policyAcknowledgements,
    policies,
    complianceIssues,
    settings,
    simulatedUsers
  )

  // Calculate quick stats
  const totalEmissions = carbonTransactions.reduce((acc, tx) => acc + tx.calculatedEmissions, 0)
  const openComplianceCount = complianceIssues.filter(i => i.status === "Open" || i.status === "In Progress").length
  const totalParticipations = employeeParticipations.length + challengeParticipations.length

  // Seed chart data
  const monthlyEmissionsData = [
    { name: "Jan", Emissions: 1420 },
    { name: "Feb", Emissions: 1350 },
    { name: "Mar", Emissions: 1210 },
    { name: "Apr", Emissions: 1480 },
    { name: "May", Emissions: 1100 },
    { name: "Jun", Emissions: 980 },
    { name: "Jul", Emissions: Math.round(totalEmissions / 4) } // Derived dynamically
  ]

  const scoresChartData = [
    {
      subject: "Environmental",
      Score: esgData.overallE,
      fullMark: 100,
    },
    {
      subject: "Social",
      Score: esgData.overallS,
      fullMark: 100,
    },
    {
      subject: "Governance",
      Score: esgData.overallG,
      fullMark: 100,
    }
  ]

  // Get latest events for feed
  const recentEvents = [
    ...carbonTransactions.slice(0, 2).map(tx => ({
      id: tx.id,
      title: `Carbon Logged: ${tx.sourceType}`,
      desc: `${tx.description} emitted ${tx.calculatedEmissions.toFixed(0)} kg CO2e.`,
      date: tx.date,
      type: "env"
    })),
    ...employeeParticipations.slice(0, 2).map(p => ({
      id: p.id,
      title: `CSR Activity: ${p.employeeName}`,
      desc: `${p.approvalStatus === "Approved" ? "Completed" : "Participated in"} "${p.activityTitle}".`,
      date: p.completionDate,
      type: "social"
    })),
    ...complianceIssues.slice(0, 2).map(i => ({
      id: i.id,
      title: `Compliance: ${i.severity} Severity`,
      desc: `${i.description} is currently ${i.status}.`,
      date: i.dueDate,
      type: "gov"
    }))
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* KPI Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Overall ESG Score */}
        <Card className="relative overflow-hidden border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-50/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Overall ESG Score
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {esgData.overallScore} <span className="text-sm font-medium text-zinc-400">/ 100</span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>Weighted: E:{settings.weightEnvironmental}% S:{settings.weightSocial}% G:{settings.weightGovernance}%</span>
            </p>
          </CardContent>
        </Card>

        {/* Environmental (E) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Environmental (E)
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
              <Leaf className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {esgData.overallE} <span className="text-xs font-medium text-zinc-400">/ 100</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Total Carbon: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{(totalEmissions/1000).toFixed(1)}t CO2e</span>
            </p>
          </CardContent>
        </Card>

        {/* Social (S) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Social (S)
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
              <Heart className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {esgData.overallS} <span className="text-xs font-medium text-zinc-400">/ 100</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Participations: <span className="font-semibold text-zinc-800 dark:text-zinc-200">{totalParticipations} actions</span>
            </p>
          </CardContent>
        </Card>

        {/* Governance (G) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Governance (G)
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
              <Users className="h-4.5 w-4.5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900 dark:text-white">
              {esgData.overallG} <span className="text-xs font-medium text-zinc-400">/ 100</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Open Violations: <span className={`font-semibold ${openComplianceCount > 0 ? "text-red-500" : "text-emerald-500"}`}>{openComplianceCount} active</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Carbon Trend Area Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">CO2e Emissions Trend</CardTitle>
            <CardDescription className="text-xs">Monthly carbon dioxide equivalent emissions tracking (kg CO2e)</CardDescription>
          </CardHeader>
          <CardContent className="h-60 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEmissionsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-100 dark:stroke-zinc-800" />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Emissions" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorEmissions)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ESG Dimensions Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">ESG Performance Profile</CardTitle>
            <CardDescription className="text-xs">Aggregated scores across ESG dimensions</CardDescription>
          </CardHeader>
          <CardContent className="h-60 px-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoresChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-100 dark:stroke-zinc-800" />
                <XAxis dataKey="subject" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="Score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables and Feed Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Department scores */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Department ESG Ratings</CardTitle>
            <CardDescription className="text-xs">Aggregated Environmental, Social, and Governance ratings per department</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                  <th className="p-3">Department</th>
                  <th className="p-3 text-center">Env Score</th>
                  <th className="p-3 text-center">Soc Score</th>
                  <th className="p-3 text-center">Gov Score</th>
                  <th className="p-3 text-center font-bold text-zinc-900 dark:text-white">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {esgData.departmentScores.map(score => (
                  <tr key={score.departmentId} className="border-b hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                    <td className="p-3 font-medium">
                      {score.departmentName} <span className="text-[10px] text-zinc-400 font-normal">({score.code})</span>
                    </td>
                    <td className="p-3 text-center text-blue-600 dark:text-blue-400 font-semibold">{score.environmentalScore}</td>
                    <td className="p-3 text-center text-rose-600 dark:text-rose-400 font-semibold">{score.socialScore}</td>
                    <td className="p-3 text-center text-amber-600 dark:text-amber-400 font-semibold">{score.governanceScore}</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                        {score.totalScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">ESG Stream</CardTitle>
            <CardDescription className="text-xs">Real-time operational updates across ESG modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvents.map(event => (
              <div key={event.id} className="flex gap-3 text-xs">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  event.type === "env"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                    : event.type === "social"
                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                }`}>
                  {event.type === "env" ? <Leaf className="h-3.5 w-3.5" /> : event.type === "social" ? <Heart className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                </div>
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">{event.title}</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">{event.desc}</p>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-1">{event.date}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
