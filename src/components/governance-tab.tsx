"use client"

import React, { useState } from "react"
import { useESGStore, EsgPolicy, ComplianceIssue, Audit } from "@/hooks/use-esg-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldCheck, FileText, Check, AlertTriangle, Clock, ShieldAlert, Plus } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function GovernanceTab() {
  const {
    currentUser,
    policies,
    policyAcknowledgements,
    acknowledgePolicy,
    audits,
    addAudit,
    complianceIssues,
    addComplianceIssue,
    resolveComplianceIssue
  } = useESGStore()

  // Simulated Current Time for overdue calculations
  const TODAY = "2026-07-21"

  // Audits Form State
  const [auditTitle, setAuditTitle] = useState("")
  const [auditType, setAuditType] = useState<Audit["type"]>("Internal")
  const [auditScope, setAuditScope] = useState<Audit["scope"]>("Full ESG")
  const [auditAuditor, setAuditAuditor] = useState("")

  // Compliance Form State
  const [issueDesc, setIssueDesc] = useState("")
  const [issueSeverity, setIssueSeverity] = useState<ComplianceIssue["severity"]>("Medium")
  const [issueOwner, setIssueOwner] = useState("")
  const [issueDueDate, setIssueDueDate] = useState("")

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!auditTitle || !auditAuditor) {
      toast.error("Please fill in all fields")
      return
    }
    addAudit({
      title: auditTitle,
      type: auditType,
      scope: auditScope,
      leadAuditor: auditAuditor,
      date: TODAY,
      status: "Scheduled",
      findingsCount: 0
    })
    setAuditTitle("")
    setAuditAuditor("")
  }

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!issueDesc || !issueOwner || !issueDueDate) {
      toast.error("Please fill in all fields")
      return
    }
    addComplianceIssue({
      severity: issueSeverity,
      description: issueDesc,
      owner: issueOwner,
      dueDate: issueDueDate,
      status: "Open"
    })
    setIssueDesc("")
    setIssueOwner("")
    setIssueDueDate("")
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status === "Resolved") return false
    return dueDate < TODAY
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Policies & Audits Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Policies Directory */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">ESG Policy Directive Directory</h2>
          <div className="space-y-3">
            {policies.map(policy => {
              const userAck = policyAcknowledgements.find(
                ack => ack.policyId === policy.id && ack.employeeId === currentUser.id
              )
              const totalAcks = policyAcknowledgements.filter(ack => ack.policyId === policy.id).length

              return (
                <Card key={policy.id} className="border border-zinc-200">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold rounded bg-zinc-100 text-zinc-600 px-2 py-0.5 dark:bg-zinc-800 dark:text-zinc-300">
                          {policy.code}
                        </span>
                        <span className="text-[10px] font-medium text-zinc-400">{policy.version}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">Published: {policy.publishDate}</span>
                    </div>
                    <CardTitle className="text-sm font-bold mt-1 text-zinc-900 dark:text-white">
                      {policy.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-zinc-500 mb-3">{policy.content}</p>
                    <div className="flex items-center justify-between pt-2.5 border-t text-xs">
                      <span className="text-zinc-400">Total acknowledgments: {totalAcks}</span>
                      {currentUser.role === "Employee" && (
                        userAck ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-bold">
                            <Check className="h-4 w-4" />
                            Acknowledged
                          </span>
                        ) : (
                          <Button
                            onClick={() => acknowledgePolicy(policy.id)}
                            className="h-8 text-xs bg-zinc-900 hover:bg-zinc-850 text-white font-semibold dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                          >
                            Acknowledge Policy
                          </Button>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Audits Panel */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Governance Audits</h2>
          {currentUser.role === "Admin" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold uppercase">Schedule Audit</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAudit} className="space-y-2.5">
                  <Input
                    placeholder="Audit Title"
                    value={auditTitle}
                    onChange={(e) => setAuditTitle(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={auditType}
                      onChange={(e) => setAuditType(e.target.value as any)}
                      className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <option value="Internal">Internal</option>
                      <option value="External">External</option>
                    </select>
                    <select
                      value={auditScope}
                      onChange={(e) => setAuditScope(e.target.value as any)}
                      className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <option value="Full ESG">Full ESG</option>
                      <option value="Environmental">Environmental</option>
                      <option value="Social">Social</option>
                      <option value="Governance">Governance</option>
                    </select>
                  </div>
                  <Input
                    placeholder="Lead Auditor"
                    value={auditAuditor}
                    onChange={(e) => setAuditAuditor(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button type="submit" className="w-full h-8 text-xs bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                    Schedule Audit
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          {/* Audits List */}
          <div className="space-y-2.5">
            {audits.map(audit => (
              <Card key={audit.id} className="p-3 text-xs border border-zinc-200/80">
                <div className="flex items-center justify-between">
                  <span className={`font-bold uppercase text-[9px] rounded px-1.5 py-0.5 ${
                    audit.type === "External"
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-950/20"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-950/20"
                  }`}>
                    {audit.type} Audit
                  </span>
                  <span className="text-[10px] text-zinc-400">{audit.date}</span>
                </div>
                <h4 className="font-bold mt-1.5 text-zinc-800 dark:text-zinc-200">{audit.title}</h4>
                <div className="flex items-center justify-between mt-3 text-[10px] text-zinc-500 pt-1.5 border-t">
                  <span>Scope: {audit.scope}</span>
                  <span>Lead: {audit.leadAuditor}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Violation issues tracker */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold">Compliance Issues & Violations Log</CardTitle>
            <CardDescription className="text-xs">
              Every compliance issue must have an owner and due date. Overdue issues are flagged automatically.
            </CardDescription>
          </div>
          {currentUser.role === "Admin" && (
            <div className="sm:w-1/3">
              {/* Quick Raise Dialog Form */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs gap-1.5" />
                  }
                >
                  <Plus className="h-4 w-4" /> Raise Issue
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-3 bg-white dark:bg-zinc-950 shadow-xl">
                  <form onSubmit={handleCreateIssue} className="space-y-2.5">
                    <h3 className="text-xs font-bold text-red-600">Raise Governance Violation</h3>
                    <textarea
                      placeholder="Violation Description"
                      rows={3}
                      value={issueDesc}
                      onChange={(e) => setIssueDesc(e.target.value)}
                      className="w-full rounded-md border border-zinc-200 p-2 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={issueSeverity}
                        onChange={(e) => setIssueSeverity(e.target.value as any)}
                        className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                      <Input
                        placeholder="Owner Name"
                        value={issueOwner}
                        onChange={(e) => setIssueOwner(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-semibold text-zinc-400 block">Due Date</label>
                      <Input
                        type="date"
                        value={issueDueDate}
                        onChange={(e) => setIssueDueDate(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <Button type="submit" className="w-full h-8 text-xs bg-red-600 text-white hover:bg-red-700">
                      Log Violation
                    </Button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                <th className="p-3">Violation</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Owner</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complianceIssues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-400">No active compliance issues logged.</td>
                </tr>
              ) : (
                complianceIssues.map(issue => {
                  const overdue = isOverdue(issue.dueDate, issue.status)

                  return (
                    <tr key={issue.id} className="border-b hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                      <td className="p-3 font-medium max-w-xs">{issue.description}</td>
                      <td className="p-3">
                        <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          issue.severity === "Critical"
                            ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400"
                            : issue.severity === "High"
                            ? "bg-orange-100 text-orange-850 dark:bg-orange-950/30"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-350"
                        }`}>
                          {issue.severity}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-zinc-700 dark:text-zinc-300">{issue.owner}</td>
                      <td className="p-3 font-mono">
                        <div className="flex items-center gap-1.5">
                          {issue.dueDate}
                          {overdue && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-red-150 px-1 py-0.5 text-[9px] font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400">
                              <ShieldAlert className="h-3 w-3" /> OVERDUE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          issue.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                        }`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {issue.status !== "Resolved" ? (
                          <Button
                            onClick={() => resolveComplianceIssue(issue.id)}
                            size="sm"
                            variant="outline"
                            className="h-7 text-[10px] border-emerald-500 text-emerald-600 hover:bg-emerald-50/50"
                          >
                            Resolve
                          </Button>
                        ) : (
                          <span className="text-[10px] text-zinc-400">Resolved</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
