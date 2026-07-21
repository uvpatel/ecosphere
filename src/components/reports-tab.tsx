"use client"

import React, { useState } from "react"
import { useESGStore } from "@/hooks/use-esg-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileChartColumn, Download, Filter, FileText } from "lucide-react"
import { toast } from "sonner"

export function ReportsTab() {
  const {
    departments,
    carbonTransactions,
    employeeParticipations,
    challengeParticipations,
    policyAcknowledgements,
    complianceIssues,
    categories,
    policies
  } = useESGStore()

  // Custom Report Builder States
  const [filterDept, setFilterDept] = useState("All")
  const [filterModule, setFilterModule] = useState("All")
  const [filterCategory, setFilterCategory] = useState("All")

  // Generate Report Data based on filters
  const getFilteredReportData = () => {
    const results: any[] = []

    // 1. Environmental records (Carbon Transactions)
    if (filterModule === "All" || filterModule === "Environmental") {
      carbonTransactions.forEach(tx => {
        const dept = departments.find(d => d.id === tx.departmentId)
        
        // Filter by Department
        if (filterDept !== "All" && tx.departmentId !== filterDept) return
        
        // Filter by Category
        const efCategory = tx.sourceType
        if (filterCategory !== "All" && filterCategory !== efCategory) return

        results.push({
          date: tx.date,
          module: "Environmental",
          category: tx.sourceType,
          department: dept ? dept.name : "Unknown",
          description: tx.description,
          detail: `${tx.quantity} ${tx.unit}`,
          impact: `${tx.calculatedEmissions.toFixed(0)} kg CO2e`
        })
      })
    }

    // 2. Social records (CSR Participations)
    if (filterModule === "All" || filterModule === "Social") {
      employeeParticipations.forEach(p => {
        // Find employee department
        if (filterDept !== "All") {
          // Alex Rivera R&D (dept-1), Sarah Chen Marketing (dept-2)
          const isAlex = p.employeeName.includes("Alex")
          const isSarah = p.employeeName.includes("Sarah")
          if (filterDept === "dept-1" && !isAlex) return
          if (filterDept === "dept-2" && !isSarah) return
          if (filterDept !== "dept-1" && filterDept !== "dept-2") return
        }

        if (filterCategory !== "All" && filterCategory !== "CSR") return

        results.push({
          date: p.completionDate,
          module: "Social",
          category: "CSR Activity",
          department: p.employeeName.includes("Alex") ? "Research & Development" : "Marketing & Sales",
          description: `CSR: ${p.employeeName} completed ${p.activityTitle}`,
          detail: `Proof: ${p.proofName || "None"}`,
          impact: `${p.pointsEarned} Points`
        })
      })
    }

    // 3. Governance records (Compliance Issues)
    if (filterModule === "All" || filterModule === "Governance") {
      complianceIssues.forEach(issue => {
        // Filter by Department
        if (filterDept !== "All") {
          const isRnd = issue.owner.includes("Alex") || issue.owner.includes("Angela")
          const isMkt = issue.owner.includes("Sarah")
          if (filterDept === "dept-1" && !isRnd) return
          if (filterDept === "dept-2" && !isMkt) return
          if (filterDept !== "dept-1" && filterDept !== "dept-2") return
        }

        if (filterCategory !== "All" && filterCategory !== "Compliance") return

        results.push({
          date: issue.dueDate,
          module: "Governance",
          category: "Compliance",
          department: issue.owner.includes("Sarah") ? "Marketing & Sales" : "Research & Development",
          description: `Issue: ${issue.description}`,
          detail: `Owner: ${issue.owner}`,
          impact: `${issue.severity} Severity (${issue.status})`
        })
      })
    }

    return results.sort((a, b) => b.date.localeCompare(a.date))
  }

  const reportRows = getFilteredReportData()

  // Dynamic CSV Export
  const exportToCSV = () => {
    if (reportRows.length === 0) {
      toast.error("No report data available to export")
      return
    }

    const headers = ["Date", "Module", "Category", "Department", "Description", "Detail", "Impact"]
    const csvRows = [
      headers.join(","), // header row
      ...reportRows.map(row => [
        `"${row.date}"`,
        `"${row.module}"`,
        `"${row.category}"`,
        `"${row.department}"`,
        `"${row.description.replace(/"/g, '""')}"`,
        `"${row.detail}"`,
        `"${row.impact}"`
      ].join(","))
    ]

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `ecosphere_esg_report_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("CSV report downloaded successfully")
  }

  const triggerPrintPdf = () => {
    window.print()
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Environmental Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p>Total Carbon Logs: <span className="font-bold">{carbonTransactions.length} items</span></p>
            <p>Direct Fuel Emissions: <span className="font-bold">
              {carbonTransactions.filter(t => t.sourceType === "Fleet" || t.sourceType === "Manufacturing").reduce((acc, t) => acc + t.calculatedEmissions, 0).toFixed(0)} kg CO2e
            </span></p>
          </CardContent>
        </Card>
        <Card className="border border-rose-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Social Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p>CSR Participations: <span className="font-bold">{employeeParticipations.length} records</span></p>
            <p>Challenges Completed: <span className="font-bold">
              {challengeParticipations.filter(c => c.approvalStatus === "Approved").length} challenges
            </span></p>
          </CardContent>
        </Card>
        <Card className="border border-amber-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Governance Summary</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p>Policies Active: <span className="font-bold">{policies.filter(p => p.status === "Active").length} policies</span></p>
            <p>Policy Acknowledgement Logs: <span className="font-bold">{policyAcknowledgements.length} acknowledgements</span></p>
          </CardContent>
        </Card>
      </div>

      {/* Custom Report Builder Controls */}
      <Card className="border border-zinc-200 shadow-sm print:hidden">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/30 p-4">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Filter className="h-4.5 w-4.5" />
            Custom Report Builder
          </CardTitle>
          <CardDescription className="text-xs">Combine filters below to build and download tailored ESG audit reports.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase">Department</label>
              <select
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-200 bg-white px-2.5 text-xs outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <option value="All">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase">Module</label>
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-200 bg-white px-2.5 text-xs outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <option value="All">All Modules</option>
                <option value="Environmental">Environmental</option>
                <option value="Social">Social</option>
                <option value="Governance">Governance</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase">ESG Category Filter</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-200 bg-white px-2.5 text-xs outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <option value="All">All Categories</option>
                <option value="Purchase">Purchase Logs (Env)</option>
                <option value="Fleet">Fleet Logs (Env)</option>
                <option value="CSR">CSR Participation (Soc)</option>
                <option value="Compliance">Compliance Issues (Gov)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-5 pt-4 border-t">
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="text-xs h-9 gap-1.5"
            >
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button
              onClick={triggerPrintPdf}
              className="text-xs h-9 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 gap-1.5"
            >
              <FileText className="h-4 w-4" /> Print PDF / Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtered Records Grid */}
      <Card className="border-t-4 border-t-zinc-900 dark:border-t-zinc-50">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Report Audit Results ({reportRows.length} rows)</CardTitle>
          <CardDescription className="text-xs">Generated dynamically from active transactions ledger matching current builder filters.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                <th className="p-3">Date</th>
                <th className="p-3">Module</th>
                <th className="p-3">Category</th>
                <th className="p-3">Department</th>
                <th className="p-3">Description</th>
                <th className="p-3">Detail</th>
                <th className="p-3 text-right">Metrics/Impact</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-400">No report rows found matching the selected filters.</td>
                </tr>
              ) : (
                reportRows.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                    <td className="p-3 font-mono text-zinc-500">{row.date}</td>
                    <td className="p-3">
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        row.module === "Environmental"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/20"
                          : row.module === "Social"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/20"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/20"
                      }`}>
                        {row.module}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-zinc-600 dark:text-zinc-400">{row.category}</td>
                    <td className="p-3">{row.department}</td>
                    <td className="p-3 max-w-xs">{row.description}</td>
                    <td className="p-3 text-zinc-500">{row.detail}</td>
                    <td className="p-3 text-right font-bold text-zinc-800 dark:text-zinc-150">{row.impact}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
