"use client"

import React, { useState } from "react"
import { useESGStore } from "@/hooks/use-esg-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, Plus, Save, LayoutGrid, ToggleLeft, ToggleRight } from "lucide-react"
import { toast } from "sonner"

export function SettingsTab() {
  const {
    departments,
    addDepartment,
    categories,
    addCategory,
    settings,
    updateSettings,
    currentUser
  } = useESGStore()

  // Department Form
  const [dName, setDName] = useState("")
  const [dCode, setDCode] = useState("")
  const [dHead, setDHead] = useState("")
  const [dCount, setDCount] = useState("")

  // Category Form
  const [catName, setCatName] = useState("")
  const [catType, setCatType] = useState<"CSR Activity" | "Challenge">("Challenge")

  // Weightings Form
  const [wEnv, setWEnv] = useState(settings.weightEnvironmental.toString())
  const [wSoc, setWSoc] = useState(settings.weightSocial.toString())
  const [wGov, setWGov] = useState(settings.weightGovernance.toString())

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dName || !dCode || !dHead || !dCount) {
      toast.error("Please fill in all fields")
      return
    }
    addDepartment({
      name: dName,
      code: dCode.toUpperCase(),
      head: dHead,
      employeeCount: parseInt(dCount),
      status: "Active"
    })
    setDName("")
    setDCode("")
    setDHead("")
    setDCount("")
  }

  const handleCreateCat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!catName) {
      toast.error("Please fill in category name")
      return
    }
    addCategory({
      name: catName,
      type: catType,
      status: "Active"
    })
    setCatName("")
  }

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault()
    const env = parseInt(wEnv)
    const soc = parseInt(wSoc)
    const gov = parseInt(wGov)

    if (isNaN(env) || isNaN(soc) || isNaN(gov)) {
      toast.error("Weights must be numbers")
      return
    }

    if (env + soc + gov !== 100) {
      toast.error(`Weights must sum to 100% (Current sum: ${env + soc + gov}%)`)
      return
    }

    updateSettings({
      weightEnvironmental: env,
      weightSocial: soc,
      weightGovernance: gov
    })
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Configuration Switches & Weightings Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Global Settings & Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Settings className="h-4.5 w-4.5" />
              ESG Configuration & Core Business Rules
            </CardTitle>
            <CardDescription className="text-xs">Manage system automation and policy rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {/* Auto Carbon Calculation */}
            <div className="flex items-center justify-between p-3 rounded-lg border text-xs">
              <div>
                <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Auto Emission Ingestion</h4>
                <p className="text-zinc-500 mt-0.5">Calculates emissions automatically from linked Purchase/Fleet ERP logs.</p>
              </div>
              <button
                onClick={() => updateSettings({ autoEmissionCalculation: !settings.autoEmissionCalculation })}
                disabled={currentUser.role !== "Admin"}
                className={`h-6 w-11 rounded-full p-0.5 transition-colors focus:outline-none ${
                  settings.autoEmissionCalculation ? "bg-emerald-500" : "bg-zinc-250 dark:bg-zinc-800"
                } ${currentUser.role !== "Admin" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.autoEmissionCalculation ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Evidence Requirement */}
            <div className="flex items-center justify-between p-3 rounded-lg border text-xs">
              <div>
                <h4 className="font-bold text-zinc-800 dark:text-zinc-200">CSR Evidence Requirement</h4>
                <p className="text-zinc-500 mt-0.5">CSR activity participations cannot be approved without attached proof files.</p>
              </div>
              <button
                onClick={() => updateSettings({ evidenceRequirement: !settings.evidenceRequirement })}
                disabled={currentUser.role !== "Admin"}
                className={`h-6 w-11 rounded-full p-0.5 transition-colors focus:outline-none ${
                  settings.evidenceRequirement ? "bg-rose-500" : "bg-zinc-250 dark:bg-zinc-800"
                } ${currentUser.role !== "Admin" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.evidenceRequirement ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Badge Auto-Award */}
            <div className="flex items-center justify-between p-3 rounded-lg border text-xs">
              <div>
                <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Badge Auto-Award</h4>
                <p className="text-zinc-500 mt-0.5">Badges are instantly unlocked when employee XP or completed challenge rules are satisfied.</p>
              </div>
              <button
                onClick={() => updateSettings({ badgeAutoAward: !settings.badgeAutoAward })}
                disabled={currentUser.role !== "Admin"}
                className={`h-6 w-11 rounded-full p-0.5 transition-colors focus:outline-none ${
                  settings.badgeAutoAward ? "bg-indigo-500" : "bg-zinc-250 dark:bg-zinc-800"
                } ${currentUser.role !== "Admin" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className={`h-5 w-5 rounded-full bg-white transition-transform ${settings.badgeAutoAward ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Global Weightings config */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">ESG Weighted Index Configuration</CardTitle>
            <CardDescription className="text-xs">Adjust weights used to compute overall ESG scores. Must sum to 100%.</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSaveWeights} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs">
                  <span className="w-28 font-semibold text-blue-600">Environmental:</span>
                  <Input
                    type="number"
                    value={wEnv}
                    onChange={(e) => setWEnv(e.target.value)}
                    disabled={currentUser.role !== "Admin"}
                    className="h-8 w-20 text-xs text-center"
                  />
                  <span className="text-zinc-400">% weighting</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="w-28 font-semibold text-rose-600">Social:</span>
                  <Input
                    type="number"
                    value={wSoc}
                    onChange={(e) => setWSoc(e.target.value)}
                    disabled={currentUser.role !== "Admin"}
                    className="h-8 w-20 text-xs text-center"
                  />
                  <span className="text-zinc-400">% weighting</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="w-28 font-semibold text-amber-600">Governance:</span>
                  <Input
                    type="number"
                    value={wGov}
                    onChange={(e) => setWGov(e.target.value)}
                    disabled={currentUser.role !== "Admin"}
                    className="h-8 w-20 text-xs text-center"
                  />
                  <span className="text-zinc-400">% weighting</span>
                </div>
              </div>

              {currentUser.role === "Admin" && (
                <Button type="submit" className="w-full h-9 text-xs bg-zinc-900 hover:bg-zinc-800 text-white font-semibold dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 mt-4">
                  Save Weightings
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Departments Management & Categories Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Departments List & Manager */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Departments Directory</h2>
            {currentUser.role === "Admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button size="sm" className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-950 text-xs gap-1.5" />
                  }
                >
                  <Plus className="h-4 w-4" /> Create Dept
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-3 bg-white dark:bg-zinc-950 border shadow-xl">
                  <form onSubmit={handleCreateDept} className="space-y-2.5">
                    <h3 className="text-xs font-bold">Add Organizational Unit</h3>
                    <Input
                      placeholder="Department Name"
                      value={dName}
                      onChange={(e) => setDName(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Code (e.g. Sales)"
                        value={dCode}
                        onChange={(e) => setDCode(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Input
                        placeholder="Employee Count"
                        type="number"
                        value={dCount}
                        onChange={(e) => setDCount(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <Input
                      placeholder="Department Head"
                      value={dHead}
                      onChange={(e) => setDHead(e.target.value)}
                      className="h-8 text-xs"
                    />
                    <Button type="submit" className="w-full h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950">
                      Create Department
                    </Button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                    <th className="p-3">Department Name</th>
                    <th className="p-3">Code</th>
                    <th className="p-3">Head</th>
                    <th className="p-3">Employees</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id} className="border-b hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                      <td className="p-3 font-semibold text-zinc-950 dark:text-zinc-50">{dept.name}</td>
                      <td className="p-3 font-mono">{dept.code}</td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-300">{dept.head}</td>
                      <td className="p-3 font-medium">{dept.employeeCount} headcount</td>
                      <td className="p-3 text-right">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
                          {dept.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Categories Manager */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Global Category Index</h2>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase">Category Index Manager</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentUser.role === "Admin" && (
                <form onSubmit={handleCreateCat} className="space-y-2.5">
                  <Input
                    placeholder="New Category Name"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <div className="flex gap-2">
                    <select
                      value={catType}
                      onChange={(e) => setCatType(e.target.value as any)}
                      className="flex-1 h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <option value="Challenge">Challenge Category</option>
                      <option value="CSR Activity">CSR Activity Category</option>
                    </select>
                    <Button type="submit" className="h-8 text-xs bg-zinc-900 text-white hover:bg-zinc-850 dark:bg-zinc-50 dark:text-zinc-950">
                      Add
                    </Button>
                  </div>
                </form>
              )}

              {/* Categories list */}
              <div className="max-h-52 overflow-y-auto space-y-1.5 border rounded-lg p-2 bg-zinc-50/50 dark:bg-zinc-900/10">
                {categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-950 border text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{cat.name}</span>
                    <span className={`text-[9px] rounded-full px-2 py-0.5 font-bold ${
                      cat.type === "Challenge"
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/20"
                    }`}>
                      {cat.type}
                    </span>
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

// Subcomponent: DropdownMenu wrapper
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
