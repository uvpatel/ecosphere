"use client"

import React, { useState } from "react"
import { useESGStore, CarbonTransaction, EmissionFactor } from "@/hooks/use-esg-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Leaf, HelpCircle, Activity } from "lucide-react"
import { toast } from "sonner"

export function EnvironmentalTab() {
  const {
    emissionFactors,
    addEmissionFactor,
    carbonTransactions,
    addCarbonTransaction,
    goals,
    departments,
    settings
  } = useESGStore()

  // Emission Factor Form State
  const [efName, setEfName] = useState("")
  const [efCategory, setEfCategory] = useState<EmissionFactor["category"]>("Electricity")
  const [efValue, setEfValue] = useState("")
  const [efUnit, setEfUnit] = useState("kWh")

  // Daily Operations Simulator State
  const [opType, setOpType] = useState<CarbonTransaction["sourceType"]>("Purchase")
  const [opDesc, setOpDesc] = useState("")
  const [opDept, setOpDept] = useState(departments[0]?.id || "")
  const [opQty, setOpQty] = useState("")
  const [opEf, setOpEf] = useState(emissionFactors[0]?.id || "")

  const handleCreateEf = (e: React.FormEvent) => {
    e.preventDefault()
    if (!efName || !efValue) {
      toast.error("Please fill in all fields")
      return
    }
    addEmissionFactor({
      name: efName,
      category: efCategory,
      factor: parseFloat(efValue),
      unit: efUnit,
      status: "Active"
    })
    setEfName("")
    setEfValue("")
  }

  const handleSimulateOperation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!opDesc || !opQty) {
      toast.error("Please fill in all fields")
      return
    }

    // Auto Emission Calculation Toggle check
    if (settings.autoEmissionCalculation) {
      addCarbonTransaction({
        sourceType: opType,
        sourceId: `OP-${Date.now().toString().slice(-4)}`,
        description: opDesc,
        departmentId: opDept,
        quantity: parseFloat(opQty),
        unit: emissionFactors.find(ef => ef.id === opEf)?.unit || "units",
        emissionFactorId: opEf,
        date: new Date().toISOString().split("T")[0]
      })
    } else {
      // Manual Calculation Simulator
      const factorObj = emissionFactors.find(f => f.id === opEf)
      const factorValue = factorObj ? factorObj.factor : 0
      const emissionsVal = parseFloat(opQty) * factorValue
      toast.info(`Auto-calculation is OFF. Simulated operation inputs registered. Calculated Emissions would be: ${emissionsVal.toFixed(1)} kg CO2e. Turn ON Auto-Calculation in Settings to log automatically!`)
    }

    setOpDesc("")
    setOpQty("")
  }

  // Helper for progress bar color
  const getGoalColor = (pct: number) => {
    if (pct >= 100) return "bg-emerald-500"
    if (pct >= 70) return "bg-blue-500"
    return "bg-amber-500"
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Upper Grid - Simulation & Emission Factors */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Operations Simulator */}
        <Card className="border-emerald-500/20 shadow-md">
          <CardHeader className="bg-emerald-50/20 dark:bg-zinc-900/30">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Activity className="h-4.5 w-4.5" />
              Daily Business Operations Simulator
            </CardTitle>
            <CardDescription className="text-xs">
              Simulate ERP data ingestion (Purchase, Fleet logs, Expenses, Manufacturing). 
              {settings.autoEmissionCalculation ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">✓ Auto-Emissions Ingestion: Active</span>
              ) : (
                <span className="text-amber-500 font-semibold block mt-1">⚠ Ingestion: Manual Ingestion Mode (Auto-Emission Toggle is OFF)</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSimulateOperation} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase">Operation Type</label>
                  <select
                    value={opType}
                    onChange={(e) => setOpType(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-zinc-200 bg-white px-2.5 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <option value="Purchase">Purchase (PO / Goods)</option>
                    <option value="Manufacturing">Manufacturing (Jobs / Power)</option>
                    <option value="Expenses">Expenses (Travel / HVAC)</option>
                    <option value="Fleet">Fleet Operations (Logistics)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase">Department Owner</label>
                  <select
                    value={opDept}
                    onChange={(e) => setOpDept(e.target.value)}
                    className="w-full h-9 rounded-md border border-zinc-200 bg-white px-2.5 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase">Description</label>
                  <Input
                    placeholder="e.g. Q3 HQ Heating Invoices"
                    value={opDesc}
                    onChange={(e) => setOpDesc(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase">Quantity</label>
                  <Input
                    type="number"
                    placeholder="e.g. 500"
                    value={opQty}
                    onChange={(e) => setOpQty(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase">Linked Emission Factor</label>
                <select
                  value={opEf}
                  onChange={(e) => setOpEf(e.target.value)}
                  className="w-full h-9 rounded-md border border-zinc-200 bg-white px-2.5 text-xs outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  {emissionFactors.map(ef => (
                    <option key={ef.id} value={ef.id}>{ef.name} ({ef.factor} kg CO2e / {ef.unit})</option>
                  ))}
                </select>
              </div>

              <Button type="submit" className="w-full h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Simulate Ingestion
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Configure Emission Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Configure Emission Factors</CardTitle>
            <CardDescription className="text-xs">Add and configure values for carbon calculation modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Form */}
            <form onSubmit={handleCreateEf} className="flex gap-2">
              <Input
                placeholder="Factor Name"
                value={efName}
                onChange={(e) => setEfName(e.target.value)}
                className="h-8 text-xs flex-1"
              />
              <select
                value={efCategory}
                onChange={(e) => {
                  setEfCategory(e.target.value as any)
                  const unitMap: Record<string, string> = {
                    Electricity: "kWh",
                    "Natural Gas": "m³",
                    Diesel: "L",
                    Petrol: "L",
                    Waste: "kg"
                  }
                  setEfUnit(unitMap[e.target.value] || "units")
                }}
                className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs outline-none dark:border-zinc-800 dark:bg-zinc-950"
              >
                <option value="Electricity">Electricity</option>
                <option value="Natural Gas">Natural Gas</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Waste">Waste</option>
              </select>
              <Input
                placeholder="Factor value"
                type="number"
                step="0.001"
                value={efValue}
                onChange={(e) => setEfValue(e.target.value)}
                className="h-8 text-xs w-20"
              />
              <Button type="submit" size="icon" className="h-8 w-8 shrink-0 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200">
                <Plus className="h-4 w-4" />
              </Button>
            </form>

            {/* List */}
            <div className="max-h-52 overflow-y-auto space-y-1.5 border rounded-lg p-2 bg-zinc-50/50 dark:bg-zinc-900/10">
              {emissionFactors.map(ef => (
                <div key={ef.id} className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/80 text-xs">
                  <div>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">{ef.name}</p>
                    <span className="text-[10px] rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-500 px-1 py-0.5 mt-0.5 inline-block">
                      {ef.category}
                    </span>
                  </div>
                  <div className="text-right font-medium">
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">{ef.factor}</p>
                    <span className="text-[9px] text-zinc-400">kg CO2e / {ef.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lower Grid - Goals & Transactions */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sustainability Goals */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Sustainability Goals</CardTitle>
            <CardDescription className="text-xs">Active sustainability goals tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map(goal => {
              // Calculate percent progress. Note: for emissions, lower currentValue is BETTER.
              // So for emissions, progress is calculated differently or we just show simple currentValue vs target.
              const isEmissions = goal.category === "Emissions"
              let pct = 0
              if (isEmissions) {
                // If target is 50,000, and current is 42,000, we have achieved it!
                // Let's do a simple ratio or show value reduction progress
                pct = goal.currentValue <= goal.targetValue ? 100 : Math.round((goal.targetValue / goal.currentValue) * 100)
              } else {
                pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
              }

              return (
                <div key={goal.id} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-zinc-800 dark:text-zinc-200">{goal.title}</span>
                    <span className="text-zinc-500">{pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${getGoalColor(pct)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>
                      Current: {goal.currentValue.toLocaleString()} {goal.unit}
                    </span>
                    <span>
                      Target: {goal.targetValue.toLocaleString()} {goal.unit}
                    </span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Ingested Carbon Transactions Ledger */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Carbon Emissions Transactions Ledger</CardTitle>
            <CardDescription className="text-xs">Audit log of carbon emissions calculated from operational ERP data</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 font-medium">
                  <th className="p-3">Source ID</th>
                  <th className="p-3">Module</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3 text-right">Calculated Emissions</th>
                </tr>
              </thead>
              <tbody>
                {carbonTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-400">No transactions recorded yet. Simulate operations above!</td>
                  </tr>
                ) : (
                  carbonTransactions.map(tx => (
                    <tr key={tx.id} className="border-b hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                      <td className="p-3 font-semibold text-zinc-600 dark:text-zinc-400">{tx.sourceId}</td>
                      <td className="p-3">
                        <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                          {tx.sourceType}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-600 dark:text-zinc-300">{tx.description}</td>
                      <td className="p-3 font-medium">
                        {tx.quantity.toLocaleString()} {tx.unit}
                      </td>
                      <td className="p-3 text-right font-bold text-red-500 dark:text-red-400">
                        +{tx.calculatedEmissions.toFixed(1)} kg CO2e
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
