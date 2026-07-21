"use client"

import React, { useState } from "react"
import { useESGStore, CsrActivity } from "@/hooks/use-esg-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, Upload, Check, X, ShieldAlert, Award, FileText, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts"

export function SocialTab() {
  const {
    currentUser,
    csrActivities,
    employeeParticipations,
    submitCsrParticipation,
    approveCsrParticipation,
    rejectCsrParticipation,
    settings
  } = useESGStore()

  const [activeActivityId, setActiveActivityId] = useState<string | null>(null)
  const [proofFile, setProofFile] = useState("")

  const handleOpenParticipationForm = (id: string) => {
    setActiveActivityId(id)
    setProofFile("")
  }

  const handleSubmitParticipation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeActivityId) return

    if (settings.evidenceRequirement && !proofFile) {
      toast.error("Proof of completion file is required by policy")
      return
    }

    submitCsrParticipation(activeActivityId, proofFile)
    setActiveActivityId(null)
    setProofFile("")
  }

  // Diversity Mock Data
  const genderData = [
    { name: "Female", value: 48, color: "#f43f5e" },
    { name: "Male", value: 45, color: "#3b82f6" },
    { name: "Non-binary", value: 7, color: "#a855f7" }
  ]

  const trainingData = [
    { title: "ESG Principles & Ethics", completion: 92, status: "Active" },
    { title: "Diversity & Inclusion Workshop", completion: 85, status: "Active" },
    { title: "Office Safety & Hazards", completion: 100, status: "Completed" }
  ]

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Active Activities Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* CSR Activities List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">CSR Initiatives Catalog</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {csrActivities.map(activity => {
              const isPast = activity.status === "Completed"
              const userPart = employeeParticipations.find(p => p.activityId === activity.id && p.employeeId === currentUser.id)

              return (
                <Card key={activity.id} className="flex flex-col justify-between overflow-hidden border border-zinc-200/80">
                  <CardHeader className="bg-zinc-50/50 p-4 dark:bg-zinc-900/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold rounded bg-rose-50 px-2 py-0.5 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
                        {activity.category}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-400">{activity.date}</span>
                    </div>
                    <CardTitle className="text-sm font-bold mt-2 text-zinc-900 dark:text-white">
                      {activity.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-zinc-500 line-clamp-3 mb-4">{activity.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t text-xs">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Award className="h-4 w-4" />
                        +{activity.points} Points
                      </span>
                      <span className="text-zinc-400">Loc: {activity.location}</span>
                    </div>

                    {/* Action button based on state */}
                    <div className="mt-4">
                      {currentUser.role === "Employee" && (
                        <>
                          {userPart ? (
                            <div className="text-center py-2 bg-zinc-50 dark:bg-zinc-900 rounded text-xs border">
                              Status:{" "}
                              <span className={`font-bold ${
                                userPart.approvalStatus === "Approved"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : userPart.approvalStatus === "Rejected"
                                  ? "text-red-500"
                                  : "text-amber-500"
                              }`}>
                                {userPart.approvalStatus}
                              </span>
                            </div>
                          ) : (
                            <Button
                              onClick={() => handleOpenParticipationForm(activity.id)}
                              className="w-full text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                            >
                              Join Activity
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Form Modal overlay (renders if activeActivityId matches) */}
          {activeActivityId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <Card className="w-full max-w-md bg-white dark:bg-zinc-950 p-6 shadow-xl">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500" />
                    Submit CSR Completion Proof
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Confirm your involvement in the CSR activity.
                    {settings.evidenceRequirement && (
                      <span className="text-red-500 font-semibold block mt-1">⚠ Organizational policy requires evidence attachments.</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitParticipation} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase">Proof File Name</label>
                    <div className="relative">
                      <Input
                        placeholder="e.g. my_tree_planting_selfie.png"
                        value={proofFile}
                        onChange={(e) => setProofFile(e.target.value)}
                        required={settings.evidenceRequirement}
                        className="text-xs pl-8 h-9"
                      />
                      <Upload className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="ghost" onClick={() => setActiveActivityId(null)} className="text-xs h-8">
                      Cancel
                    </Button>
                    <Button type="submit" className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white">
                      Submit Proof
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>

        {/* Dynamic metrics / Diversity side-panel */}
        <div className="col-span-1 space-y-6">
          {/* Diversity Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Diversity Metrics</CardTitle>
              <CardDescription className="text-[10px]">Gender balance distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={24} iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 9 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* ESG Trainings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Training Completions</CardTitle>
              <CardDescription className="text-[10px]">Mandatory employee ESG compliance training</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              {trainingData.map((t, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{t.title}</span>
                    <span className="text-[10px] font-bold text-emerald-600">{t.completion}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${t.completion}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Participations review logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">CSR Participation Review Center</CardTitle>
          <CardDescription className="text-xs">
            {currentUser.role === "Admin"
              ? "Approve or Reject submitted CSR completion proofs to award employee points."
              : "Track the verification status of your submitted CSR actions."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                <th className="p-3">Employee</th>
                <th className="p-3">Activity</th>
                <th className="p-3">Proof File</th>
                <th className="p-3">Verification</th>
                {currentUser.role === "Admin" && <th className="p-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {employeeParticipations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-400">No participations recorded yet.</td>
                </tr>
              ) : (
                employeeParticipations.map(p => {
                  // If employee role, only show their own participations
                  if (currentUser.role === "Employee" && p.employeeId !== currentUser.id) return null

                  return (
                    <tr key={p.id} className="border-b hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                      <td className="p-3 font-semibold">{p.employeeName}</td>
                      <td className="p-3">{p.activityTitle}</td>
                      <td className="p-3 text-zinc-500">
                        {p.proofName ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                            <FileText className="h-3.5 w-3.5" />
                            {p.proofName}
                          </span>
                        ) : (
                          <span className="text-zinc-400 italic">No proof attached</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          p.approvalStatus === "Approved"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                            : p.approvalStatus === "Rejected"
                            ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                        }`}>
                          {p.approvalStatus}
                        </span>
                      </td>
                      {currentUser.role === "Admin" && (
                        <td className="p-3 text-right">
                          {p.approvalStatus === "Under Review" ? (
                            <div className="flex justify-end gap-1.5">
                              <Button
                                onClick={() => approveCsrParticipation(p.id)}
                                size="icon"
                                className="h-6 w-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                onClick={() => rejectCsrParticipation(p.id)}
                                size="icon"
                                className="h-6 w-6 bg-red-600 hover:bg-red-700 text-white rounded"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-zinc-400">Processed</span>
                          )}
                        </td>
                      )}
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
