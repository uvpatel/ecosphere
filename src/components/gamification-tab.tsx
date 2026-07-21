"use client"

import React, { useState } from "react"
import { useESGStore, Challenge, Badge, Reward } from "@/hooks/use-esg-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, Award, Coins, Check, X, ShieldAlert, Star, Users, Flame, Plus, ShieldCheck, Heart } from "lucide-react"
import { toast } from "sonner"
import { calculateESGData } from "@/lib/esg-utils"

export function GamificationTab() {
  const {
    currentUser,
    challenges,
    addChallenge,
    updateChallengeStatus,
    challengeParticipations,
    submitChallengeParticipation,
    approveChallengeParticipation,
    rejectChallengeParticipation,
    badges,
    rewards,
    redeemReward,
    simulatedUsers,
    departments,
    carbonTransactions,
    employeeParticipations,
    policyAcknowledgements,
    policies,
    complianceIssues,
    settings
  } = useESGStore()

  // New Challenge Form State
  const [cTitle, setCTitle] = useState("")
  const [cDesc, setCDesc] = useState("")
  const [cCategory, setCCategory] = useState("Energy Conservation")
  const [cXp, setCXp] = useState("")
  const [cDifficulty, setCDifficulty] = useState<Challenge["difficulty"]>("Medium")
  const [cEvidence, setCEvidence] = useState(true)
  const [cDeadline, setCDeadline] = useState("")

  // Challenge Participation State
  const [activeChalId, setActiveChalId] = useState<string | null>(null)
  const [chalProof, setChalProof] = useState("")

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cTitle || !cDesc || !cXp || !cDeadline) {
      toast.error("Please fill in all fields")
      return
    }
    addChallenge({
      title: cTitle,
      category: cCategory,
      description: cDesc,
      xp: parseInt(cXp),
      difficulty: cDifficulty,
      evidenceRequired: cEvidence,
      deadline: cDeadline,
      status: "Draft"
    })
    setCTitle("")
    setCDesc("")
    setCXp("")
    setCDeadline("")
  }

  const handleSubmitChalPart = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeChalId) return

    const chal = challenges.find(c => c.id === activeChalId)
    if (chal?.evidenceRequired && !chalProof) {
      toast.error("Evidence file name is required for this challenge")
      return
    }

    submitChallengeParticipation(activeChalId, chalProof)
    setActiveChalId(null)
    setChalProof("")
  }

  // Calculate Leaderboards
  // 1. Employees sorted by XP
  const employeeLeaderboard = [...simulatedUsers]
    .filter(u => u.role === "Employee")
    .sort((a, b) => b.xp - a.xp)

  // 2. Departments sorted by Total ESG Score
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
  const departmentLeaderboard = [...esgData.departmentScores]
    .sort((a, b) => b.totalScore - a.totalScore)

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Upper Grid - Challenges & Badges */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Challenges list */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Active Challenges</h2>
            {currentUser.role === "Admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button size="sm" className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 text-xs gap-1.5" />
                  }
                >
                  <Plus className="h-4 w-4" /> Create Challenge
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-3 bg-white dark:bg-zinc-950 shadow-xl border">
                  <form onSubmit={handleCreateChallenge} className="space-y-2.5">
                    <h3 className="text-xs font-bold text-zinc-950 dark:text-zinc-50">Create Challenge (Draft)</h3>
                    <Input
                      placeholder="Challenge Title"
                      value={cTitle}
                      onChange={(e) => setCTitle(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <textarea
                      placeholder="Description"
                      rows={2}
                      value={cDesc}
                      onChange={(e) => setCDesc(e.target.value)}
                      className="w-full rounded-md border border-zinc-200 p-2 text-xs outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={cCategory}
                        onChange={(e) => setCCategory(e.target.value)}
                        className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <option value="Energy Conservation">Energy Conservation</option>
                        <option value="Waste Reduction">Waste Reduction</option>
                        <option value="Material Ingestion">Material Ingestion</option>
                      </select>
                      <select
                        value={cDifficulty}
                        onChange={(e) => setCDifficulty(e.target.value as any)}
                        className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-950"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="XP Awarded"
                        type="number"
                        value={cXp}
                        onChange={(e) => setCXp(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Input
                        type="date"
                        value={cDeadline}
                        onChange={(e) => setCDeadline(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={cEvidence}
                        onChange={(e) => setCEvidence(e.target.checked)}
                        id="evidenceReq"
                        className="h-4 w-4"
                      />
                      <label htmlFor="evidenceReq" className="text-[10px] font-semibold text-zinc-500">Requires Evidence Submission</label>
                    </div>
                    <Button type="submit" className="w-full h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950">
                      Create Challenge
                    </Button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {challenges.map(chal => {
              const cp = challengeParticipations.find(p => p.challengeId === chal.id && p.employeeId === currentUser.id)
              const difficultyColor = chal.difficulty === "Easy" ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : chal.difficulty === "Hard" ? "text-red-500 bg-red-50 dark:bg-red-950/20" : "text-amber-500 bg-amber-50 dark:bg-amber-950/20"

              return (
                <Card key={chal.id} className="flex flex-col justify-between overflow-hidden border border-zinc-200/80">
                  <CardHeader className="bg-zinc-50/50 p-4 dark:bg-zinc-900/30">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold rounded px-1.5 py-0.5 ${difficultyColor}`}>
                        {chal.difficulty}
                      </span>
                      {currentUser.role === "Admin" ? (
                        <select
                          value={chal.status}
                          onChange={(e) => updateChallengeStatus(chal.id, e.target.value as any)}
                          className="h-6 rounded border border-zinc-200 bg-white text-[9px] font-semibold outline-none dark:border-zinc-800 dark:bg-zinc-950"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Active">Active</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Completed">Completed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      ) : (
                        <span className="text-[10px] font-semibold text-zinc-400">Ends: {chal.deadline}</span>
                      )}
                    </div>
                    <CardTitle className="text-sm font-bold mt-2 text-zinc-900 dark:text-white">
                      {chal.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-zinc-500 line-clamp-3 mb-4">{chal.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-2 border-t text-xs">
                      <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                        <Flame className="h-4 w-4" />
                        +{chal.xp} XP
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {chal.evidenceRequired ? "Proof Required" : "No Proof Needed"}
                      </span>
                    </div>

                    {currentUser.role === "Employee" && (
                      <div className="mt-4">
                        {chal.status !== "Active" ? (
                          <div className="text-center py-2 bg-zinc-50 dark:bg-zinc-900 rounded text-xs border border-zinc-200">
                            Challenge Status: <span className="font-bold">{chal.status}</span>
                          </div>
                        ) : cp ? (
                          <div className="text-center py-2 bg-zinc-50 dark:bg-zinc-900 rounded text-xs border border-zinc-200">
                            Your status:{" "}
                            <span className={`font-bold ${
                              cp.approvalStatus === "Approved"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : cp.approvalStatus === "Rejected"
                                ? "text-red-500"
                                : "text-amber-500"
                            }`}>
                              {cp.approvalStatus}
                            </span>
                          </div>
                        ) : (
                          <Button
                            onClick={() => {
                              if (!chal.evidenceRequired) {
                                // Instantly submit challenge
                                submitChallengeParticipation(chal.id, "")
                              } else {
                                setActiveChalId(chal.id)
                                setChalProof("")
                              }
                            }}
                            className="w-full text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                          >
                            Submit Completion
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Form Modal overlay (for challenges) */}
          {activeChalId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
              <Card className="w-full max-w-md bg-white dark:bg-zinc-950 p-6 shadow-xl border">
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-indigo-500" />
                    Submit Challenge Proof
                  </CardTitle>
                  <CardDescription className="text-xs">
                    This challenge requires evidence validation.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmitChalPart} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase">Proof File Name</label>
                    <Input
                      placeholder="e.g. transit_ticket_photo.png"
                      value={chalProof}
                      onChange={(e) => setChalProof(e.target.value)}
                      required
                      className="text-xs h-9"
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button type="button" variant="ghost" onClick={() => setActiveChalId(null)} className="text-xs h-8">
                      Cancel
                    </Button>
                    <Button type="submit" className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white">
                      Submit Proof
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>

        {/* Badges Display panel */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Achievements & Badges</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              {badges.map(badge => {
                const unlocked = currentUser.badges.includes(badge.id)

                return (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      unlocked
                        ? "bg-emerald-50/20 border-emerald-500/25 dark:bg-emerald-950/10"
                        : "bg-zinc-50/50 border-zinc-100 dark:bg-zinc-900/10 opacity-50"
                    }`}
                  >
                    <div className="text-3xl shrink-0">{badge.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{badge.name}</h4>
                        {unlocked && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400 shrink-0">
                            <Check className="h-2 w-2" /> Unlocked
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rewards Catalog Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Rewards Catalog</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {rewards.map(reward => {
            const outOfStock = reward.stock <= 0

            return (
              <Card key={reward.id} className="flex flex-col justify-between overflow-hidden border border-zinc-200">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold rounded bg-amber-50 px-2 py-0.5 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {reward.pointsRequired} Points
                    </span>
                    <span className={`text-[10px] font-medium ${outOfStock ? "text-red-500 font-bold" : "text-zinc-400"}`}>
                      Stock: {reward.stock}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-950 dark:text-zinc-50">{reward.name}</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">{reward.description}</p>
                  </div>
                  {currentUser.role === "Employee" && (
                    <Button
                      onClick={() => redeemReward(reward.id)}
                      disabled={outOfStock}
                      className="w-full text-xs h-8 bg-amber-500 hover:bg-amber-600 text-white font-semibold mt-2"
                    >
                      {outOfStock ? "Out of Stock" : "Redeem Reward"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Leaderboard & Submissions approval grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Challenge Approval Center (Admin only) */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Challenge Review Center</h2>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                    <th className="p-3">Employee</th>
                    <th className="p-3">Challenge</th>
                    <th className="p-3">Proof File</th>
                    <th className="p-3">Status</th>
                    {currentUser.role === "Admin" && <th className="p-3 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {challengeParticipations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-zinc-400">No participations recorded yet.</td>
                    </tr>
                  ) : (
                    challengeParticipations.map(p => {
                      if (currentUser.role === "Employee" && p.employeeId !== currentUser.id) return null

                      return (
                        <tr key={p.id} className="border-b hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                          <td className="p-3 font-semibold">{p.employeeName}</td>
                          <td className="p-3">{p.challengeTitle}</td>
                          <td className="p-3 text-zinc-500">
                            {p.proofName ? (
                              <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400">
                                {p.proofName}
                              </span>
                            ) : (
                              <span className="text-zinc-400 italic">No proof required/attached</span>
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
                                    onClick={() => approveChallengeParticipation(p.id)}
                                    size="icon"
                                    className="h-6 w-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    onClick={() => rejectChallengeParticipation(p.id)}
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

        {/* Gamification Leaderboards */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">EcoSphere Leaderboard</h2>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-600" />
                Employee Rankings (XP)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y text-xs">
                {employeeLeaderboard.map((user, idx) => (
                  <div key={user.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-4 font-bold ${idx === 0 ? "text-amber-500" : idx === 1 ? "text-zinc-400" : "text-zinc-400"}`}>
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200">{user.name}</p>
                        <span className="text-[9px] text-zinc-400">{user.email}</span>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">{user.xp} XP</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Subcomponent: DropdownMenu wrapper for clean Admin challenge forms
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
