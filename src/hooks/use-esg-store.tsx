"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

// --- Types & Interfaces ---

export interface Department {
  id: string
  name: string
  code: string
  head: string
  parentDepartment?: string
  employeeCount: number
  status: "Active" | "Inactive"
}

export interface Category {
  id: string
  name: string
  type: "CSR Activity" | "Challenge"
  status: "Active" | "Inactive"
}

export interface EmissionFactor {
  id: string
  name: string
  category: "Electricity" | "Natural Gas" | "Diesel" | "Petrol" | "Waste"
  factor: number // kg CO2e per unit
  unit: string
  status: "Active" | "Inactive"
}

export interface ProductEsgProfile {
  id: string
  name: string
  sku: string
  carbonFootprint: number // kg CO2e
  recycledMaterialPct: number
  ethicalSourcingRating: "A" | "B" | "C" | "D" | "F"
}

export interface EnvironmentalGoal {
  id: string
  title: string
  targetValue: number
  currentValue: number
  unit: string
  category: string
  deadline: string
  status: "In Progress" | "Achieved" | "Missed"
}

export interface EsgPolicy {
  id: string
  title: string
  code: string
  category: "Environmental" | "Social" | "Governance"
  version: string
  publishDate: string
  status: "Active" | "Archived"
  content: string
}

export interface Badge {
  id: string
  name: string
  description: string
  unlockRule: {
    type: "xp" | "challenges"
    value: number
  }
  icon: string // Lucide icon name or emoji
}

export interface Reward {
  id: string
  name: string
  description: string
  pointsRequired: number
  stock: number
  status: "Active" | "Inactive"
  image?: string
}

// Transactional Data

export interface CarbonTransaction {
  id: string
  sourceType: "Purchase" | "Manufacturing" | "Expenses" | "Fleet"
  sourceId: string
  description: string
  departmentId: string
  quantity: number
  unit: string
  emissionFactorId: string
  calculatedEmissions: number // kg CO2e
  date: string
}

export interface CsrActivity {
  id: string
  title: string
  category: string
  description: string
  date: string
  location: string
  points: number
  maxParticipants: number
  status: "Upcoming" | "Completed" | "Cancelled"
}

export interface EmployeeParticipation {
  id: string
  employeeId: string
  employeeName: string
  activityId: string
  activityTitle: string
  proofUrl?: string
  proofName?: string
  approvalStatus: "Under Review" | "Approved" | "Rejected"
  pointsEarned: number
  completionDate: string
}

export interface Challenge {
  id: string
  title: string
  category: string
  description: string
  xp: number
  difficulty: "Easy" | "Medium" | "Hard"
  evidenceRequired: boolean
  deadline: string
  status: "Draft" | "Active" | "Under Review" | "Completed" | "Archived"
}

export interface ChallengeParticipation {
  id: string
  challengeId: string
  challengeTitle: string
  employeeId: string
  employeeName: string
  progress: number // percentage 0 - 100
  proofUrl?: string
  proofName?: string
  approvalStatus: "Under Review" | "Approved" | "Rejected"
  xpAwarded: number
  completionDate?: string
}

export interface PolicyAcknowledgement {
  id: string
  policyId: string
  policyTitle: string
  employeeId: string
  employeeName: string
  acknowledgedDate: string
}

export interface Audit {
  id: string
  title: string
  type: "Internal" | "External"
  scope: "Environmental" | "Social" | "Governance" | "Full ESG"
  leadAuditor: string
  date: string
  status: "Scheduled" | "In Progress" | "Completed"
  findingsCount: number
}

export interface ComplianceIssue {
  id: string
  auditId?: string
  severity: "Low" | "Medium" | "High" | "Critical"
  description: string
  owner: string // Employee name or email
  dueDate: string
  status: "Open" | "In Progress" | "Resolved"
}

export interface Notification {
  id: string
  type: "compliance" | "approval" | "policy" | "badge" | "system"
  title: string
  message: string
  date: string
  read: boolean
}

export interface SimulatedUser {
  id: string
  name: string
  email: string
  role: "Admin" | "Employee"
  departmentId: string
  xp: number
  points: number
  badges: string[] // Badge IDs
}

export interface OrganizationSettings {
  weightEnvironmental: number // default 40
  weightSocial: number // default 30
  weightGovernance: number // default 30
  autoEmissionCalculation: boolean
  evidenceRequirement: boolean
  badgeAutoAward: boolean
}

// Store Context Interface
interface ESGStoreContextType {
  departments: Department[]
  categories: Category[]
  emissionFactors: EmissionFactor[]
  products: ProductEsgProfile[]
  goals: EnvironmentalGoal[]
  policies: EsgPolicy[]
  badges: Badge[]
  rewards: Reward[]
  
  carbonTransactions: CarbonTransaction[]
  csrActivities: CsrActivity[]
  employeeParticipations: EmployeeParticipation[]
  challenges: Challenge[]
  challengeParticipations: ChallengeParticipation[]
  policyAcknowledgements: PolicyAcknowledgement[]
  audits: Audit[]
  complianceIssues: ComplianceIssue[]
  notifications: Notification[]
  
  settings: OrganizationSettings
  simulatedUsers: SimulatedUser[]
  currentUser: SimulatedUser
  currentTab: string
  setCurrentTab: (tab: string) => void
  
  // Actions
  setCurrentUserById: (id: string) => void
  updateSettings: (newSettings: Partial<OrganizationSettings>) => void
  addDepartment: (dept: Omit<Department, "id">) => void
  updateDepartment: (id: string, dept: Partial<Department>) => void
  addCategory: (cat: Omit<Category, "id">) => void
  updateCategory: (id: string, cat: Partial<Category>) => void
  addEmissionFactor: (ef: Omit<EmissionFactor, "id">) => void
  updateEmissionFactor: (id: string, ef: Partial<EmissionFactor>) => void
  addProductProfile: (prod: Omit<ProductEsgProfile, "id">) => void
  
  addCarbonTransaction: (tx: Omit<CarbonTransaction, "id" | "calculatedEmissions">) => void
  addCsrActivity: (act: Omit<CsrActivity, "id">) => void
  submitCsrParticipation: (activityId: string, proofName: string) => void
  approveCsrParticipation: (participationId: string) => void
  rejectCsrParticipation: (participationId: string) => void
  
  addChallenge: (challenge: Omit<Challenge, "id">) => void
  updateChallengeStatus: (id: string, status: Challenge["status"]) => void
  submitChallengeParticipation: (challengeId: string, proofName: string) => void
  approveChallengeParticipation: (participationId: string) => void
  rejectChallengeParticipation: (participationId: string) => void
  
  acknowledgePolicy: (policyId: string) => void
  addAudit: (audit: Omit<Audit, "id">) => void
  addComplianceIssue: (issue: Omit<ComplianceIssue, "id">) => void
  resolveComplianceIssue: (id: string) => void
  
  redeemReward: (rewardId: string) => boolean
  clearNotifications: () => void
  markNotificationRead: (id: string) => void
}

// --- Initial Mock Seed Data ---

const initialDepartments: Department[] = [
  { id: "dept-1", name: "Research & Development", code: "RND", head: "Dr. Angela Martin", employeeCount: 45, status: "Active" },
  { id: "dept-2", name: "Marketing & Sales", code: "MKT", head: "Sarah Chen", employeeCount: 30, status: "Active" },
  { id: "dept-3", name: "Operations & Logistics", code: "OPS", head: "Marcus Vance", employeeCount: 120, status: "Active" },
  { id: "dept-4", name: "Human Resources", code: "HR", head: "Toby Flenderson", employeeCount: 10, status: "Active" },
]

const initialCategories: Category[] = [
  { id: "cat-1", name: "Energy Conservation", type: "Challenge", status: "Active" },
  { id: "cat-2", name: "Waste Reduction", type: "Challenge", status: "Active" },
  { id: "cat-3", name: "Community Service", type: "CSR Activity", status: "Active" },
  { id: "cat-4", name: "Environmental Cleanup", type: "CSR Activity", status: "Active" },
]

const initialEmissionFactors: EmissionFactor[] = [
  { id: "ef-1", name: "Grid Electricity", category: "Electricity", factor: 0.385, unit: "kWh", status: "Active" },
  { id: "ef-2", name: "Natural Gas Heating", category: "Natural Gas", factor: 2.05, unit: "m³", status: "Active" },
  { id: "ef-3", name: "Generator Diesel", category: "Diesel", factor: 2.68, unit: "L", status: "Active" },
  { id: "ef-4", name: "Company Fleet Petrol", category: "Petrol", factor: 2.31, unit: "L", status: "Active" },
]

const initialProducts: ProductEsgProfile[] = [
  { id: "prod-1", name: "EcoWidget Pro", sku: "WID-ECO-01", carbonFootprint: 1.25, recycledMaterialPct: 75, ethicalSourcingRating: "A" },
  { id: "prod-2", name: "Standard Widget", sku: "WID-STD-02", carbonFootprint: 4.80, recycledMaterialPct: 10, ethicalSourcingRating: "C" },
]

const initialGoals: EnvironmentalGoal[] = [
  { id: "goal-1", title: "Reduce Carbon Emissions by 20%", targetValue: 50000, currentValue: 42000, unit: "kg CO2e", category: "Emissions", deadline: "2026-12-31", status: "In Progress" },
  { id: "goal-2", title: "Transition to 80% Recycled Material", targetValue: 80, currentValue: 55, unit: "%", category: "Material", deadline: "2026-10-31", status: "In Progress" },
  { id: "goal-3", title: "Zero Single-Use Plastics in Office", targetValue: 100, currentValue: 100, unit: "%", category: "Waste", deadline: "2026-06-30", status: "Achieved" },
]

const initialPolicies: EsgPolicy[] = [
  { id: "pol-1", title: "Sustainable Procurement Policy", code: "ESG-POL-001", category: "Governance", version: "v2.1", publishDate: "2026-01-15", status: "Active", content: "This policy establishes standards for purchasing goods and services that minimize environmental impacts, encourage recycling, and require suppliers to comply with ethical working conditions." },
  { id: "pol-2", title: "Office Energy Efficiency Standard", code: "ESG-POL-002", category: "Environmental", version: "v1.0", publishDate: "2026-03-01", status: "Active", content: "Guidelines for energy usage in office spaces, including mandatory shutdown procedures for workstations, smart thermostat levels, and energy-efficient lighting standards." },
  { id: "pol-3", title: "Diversity & Inclusion Charter", code: "ESG-POL-003", category: "Social", version: "v3.0", publishDate: "2025-10-01", status: "Active", content: "Outlines EcoSphere's commitment to building a diverse workforce and providing safe, inclusive environments where employees of all backgrounds thrive." }
]

const initialBadges: Badge[] = [
  { id: "badge-1", name: "Eco Novice", description: "Earn your first 100 XP in ESG activities", unlockRule: { type: "xp", value: 100 }, icon: "🌱" },
  { id: "badge-2", name: "Green Champion", description: "Reach a total of 500 XP", unlockRule: { type: "xp", value: 500 }, icon: "🏆" },
  { id: "badge-3", name: "Task Master", description: "Complete 3 sustainability challenges", unlockRule: { type: "challenges", value: 3 }, icon: "⚡" },
]

const initialRewards: Reward[] = [
  { id: "reward-1", name: "Plant a Tree in Your Name", description: "We will partner with OneTreePlanted to plant a tree in a reforestation zone and mail you a certificate.", pointsRequired: 50, stock: 99, status: "Active" },
  { id: "reward-2", name: "Eco-Friendly Coffee Mug", description: "Insulated, double-walled travel mug made from 100% recycled coffee husks.", pointsRequired: 150, stock: 12, status: "Active" },
  { id: "reward-3", name: "$25 Organic Food Voucher", description: "Redeemable at local organic and zero-waste grocery stores.", pointsRequired: 250, stock: 5, status: "Active" },
]

const initialCarbonTransactions: CarbonTransaction[] = [
  { id: "tx-1", sourceType: "Fleet", sourceId: "FLEET-001", description: "Q2 Operations Logistics Delivery", departmentId: "dept-3", quantity: 1500, unit: "L", emissionFactorId: "ef-4", calculatedEmissions: 3465, date: "2026-06-15" },
  { id: "tx-2", sourceType: "Purchase", sourceId: "PO-4091", description: "HQ Office Electricity Usage May", departmentId: "dept-4", quantity: 8200, unit: "kWh", emissionFactorId: "ef-1", calculatedEmissions: 3157, date: "2026-05-31" },
  { id: "tx-3", sourceType: "Manufacturing", sourceId: "JOB-291", description: "Production Line B Generator Run", departmentId: "dept-1", quantity: 450, unit: "L", emissionFactorId: "ef-3", calculatedEmissions: 1206, date: "2026-07-02" },
]

const initialCsrActivities: CsrActivity[] = [
  { id: "csr-1", title: "Local Park Reforestation", category: "Environmental Cleanup", description: "Volunteering to plant native saplings and clean trails at Oakwood Nature Park.", date: "2026-07-28", location: "Oakwood Park", points: 40, maxParticipants: 30, status: "Upcoming" },
  { id: "csr-2", title: "Tech Mentorship for Local High Schools", category: "Community Service", description: "Hosting coding and design workshops for underrepresented students.", date: "2026-07-10", location: "R&D Lab 1", points: 60, maxParticipants: 10, status: "Completed" },
]

const initialEmployeeParticipations: EmployeeParticipation[] = [
  { id: "part-1", employeeId: "emp-2", employeeName: "Alex Rivera", activityId: "csr-2", activityTitle: "Tech Mentorship for Local High Schools", proofName: "mentorship_photo.jpg", approvalStatus: "Approved", pointsEarned: 60, completionDate: "2026-07-10" },
  { id: "part-2", employeeId: "emp-3", employeeName: "Sarah Chen", activityId: "csr-2", activityTitle: "Tech Mentorship for Local High Schools", proofName: "attendance_sheet.pdf", approvalStatus: "Approved", pointsEarned: 60, completionDate: "2026-07-10" },
]

const initialChallenges: Challenge[] = [
  { id: "chal-1", title: "No-Drive Work Week", category: "Energy Conservation", description: "Commute to work using public transit, walking, or cycling for 5 consecutive days.", xp: 120, difficulty: "Medium", evidenceRequired: true, deadline: "2026-07-31", status: "Active" },
  { id: "chal-2", title: "Office Plastic Detox", category: "Waste Reduction", description: "Bring a reusable lunchbox and steel water bottle to work, avoiding single-use plastics.", xp: 80, difficulty: "Easy", evidenceRequired: true, deadline: "2026-08-15", status: "Active" },
  { id: "chal-3", title: "Optimize Server Standby Times", category: "Energy Conservation", description: "Configure lab machines to auto-suspend after 15 minutes of inactivity.", xp: 200, difficulty: "Hard", evidenceRequired: true, deadline: "2026-07-15", status: "Completed" },
]

const initialChallengeParticipations: ChallengeParticipation[] = [
  { id: "cp-1", challengeId: "chal-3", challengeTitle: "Optimize Server Standby Times", employeeId: "emp-2", employeeName: "Alex Rivera", progress: 100, proofName: "cron_script_screenshot.png", approvalStatus: "Approved", xpAwarded: 200, completionDate: "2026-07-14" },
  { id: "cp-2", challengeId: "chal-1", challengeTitle: "No-Drive Work Week", employeeId: "emp-2", employeeName: "Alex Rivera", progress: 60, approvalStatus: "Under Review", xpAwarded: 0 },
]

const initialPolicyAcknowledgements: PolicyAcknowledgement[] = [
  { id: "ack-1", policyId: "pol-1", policyTitle: "Sustainable Procurement Policy", employeeId: "emp-2", employeeName: "Alex Rivera", acknowledgedDate: "2026-01-20" },
  { id: "ack-2", policyId: "pol-3", policyTitle: "Diversity & Inclusion Charter", employeeId: "emp-3", employeeName: "Sarah Chen", acknowledgedDate: "2026-02-14" },
]

const initialAudits: Audit[] = [
  { id: "audit-1", title: "Annual Carbon Accounting Audit", type: "External", scope: "Environmental", leadAuditor: "SustainCorp LLC", date: "2026-05-10", status: "Completed", findingsCount: 2 },
  { id: "audit-2", title: "Q3 Governance & Compliance Review", type: "Internal", scope: "Governance", leadAuditor: "Marcus Vance", date: "2026-07-15", status: "In Progress", findingsCount: 1 },
]

const initialComplianceIssues: ComplianceIssue[] = [
  { id: "issue-1", auditId: "audit-1", severity: "Medium", description: "Fleet fuel logs were missing exact pump receipts for March transactions.", owner: "Marcus Vance", dueDate: "2026-06-30", status: "Open" }, // Overdue!
  { id: "issue-2", auditId: "audit-2", severity: "High", description: "Unacknowledged procurement policy violations observed in minor office supply purchases.", owner: "Sarah Chen", dueDate: "2026-08-10", status: "In Progress" },
]

const initialNotifications: Notification[] = [
  { id: "not-1", type: "compliance", title: "Overdue Compliance Issue", message: "Compliance issue regarding 'Fleet fuel logs' is open past its due date (2026-06-30). Please address immediately.", date: "2026-07-01", read: false },
]

const initialSimulatedUsers: SimulatedUser[] = [
  { id: "emp-admin", name: "ESG Administrator", email: "admin@ecosphere.com", role: "Admin", departmentId: "dept-4", xp: 0, points: 0, badges: [] },
  { id: "emp-2", name: "Alex Rivera", email: "alex.rivera@ecosphere.com", role: "Employee", departmentId: "dept-1", xp: 260, points: 60, badges: ["badge-1"] },
  { id: "emp-3", name: "Sarah Chen", email: "sarah.chen@ecosphere.com", role: "Employee", departmentId: "dept-2", xp: 480, points: 380, badges: ["badge-1"] },
]

// --- State Store Context & Provider ---

const ESGStoreContext = createContext<ESGStoreContextType | undefined>(undefined)

export const ESGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [emissionFactors, setEmissionFactors] = useState<EmissionFactor[]>(initialEmissionFactors)
  const [products, setProducts] = useState<ProductEsgProfile[]>(initialProducts)
  const [goals, setGoals] = useState<EnvironmentalGoal[]>(initialGoals)
  const [policies, setPolicies] = useState<EsgPolicy[]>(initialPolicies)
  const [badges, setBadges] = useState<Badge[]>(initialBadges)
  const [rewards, setRewards] = useState<Reward[]>(initialRewards)
  
  const [carbonTransactions, setCarbonTransactions] = useState<CarbonTransaction[]>(initialCarbonTransactions)
  const [csrActivities, setCsrActivities] = useState<CsrActivity[]>(initialCsrActivities)
  const [employeeParticipations, setEmployeeParticipations] = useState<EmployeeParticipation[]>(initialEmployeeParticipations)
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges)
  const [challengeParticipations, setChallengeParticipations] = useState<ChallengeParticipation[]>(initialChallengeParticipations)
  const [policyAcknowledgements, setPolicyAcknowledgements] = useState<PolicyAcknowledgement[]>(initialPolicyAcknowledgements)
  const [audits, setAudits] = useState<Audit[]>(initialAudits)
  const [complianceIssues, setComplianceIssues] = useState<ComplianceIssue[]>(initialComplianceIssues)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  
  const [settings, setSettings] = useState<OrganizationSettings>({
    weightEnvironmental: 40,
    weightSocial: 30,
    weightGovernance: 30,
    autoEmissionCalculation: true,
    evidenceRequirement: true,
    badgeAutoAward: true
  })
  const [simulatedUsers, setSimulatedUsers] = useState<SimulatedUser[]>(initialSimulatedUsers)
  const [currentUser, setCurrentUser] = useState<SimulatedUser>(initialSimulatedUsers[1]) // Alex Rivera default
  const [currentTab, setCurrentTab] = useState<string>("Dashboard")

  // Load from localstorage if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ecosphere_esg_data")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.departments) setDepartments(parsed.departments)
          if (parsed.categories) setCategories(parsed.categories)
          if (parsed.emissionFactors) setEmissionFactors(parsed.emissionFactors)
          if (parsed.products) setProducts(parsed.products)
          if (parsed.goals) setGoals(parsed.goals)
          if (parsed.policies) setPolicies(parsed.policies)
          if (parsed.badges) setBadges(parsed.badges)
          if (parsed.rewards) setRewards(parsed.rewards)
          if (parsed.carbonTransactions) setCarbonTransactions(parsed.carbonTransactions)
          if (parsed.csrActivities) setCsrActivities(parsed.csrActivities)
          if (parsed.employeeParticipations) setEmployeeParticipations(parsed.employeeParticipations)
          if (parsed.challenges) setChallenges(parsed.challenges)
          if (parsed.challengeParticipations) setChallengeParticipations(parsed.challengeParticipations)
          if (parsed.policyAcknowledgements) setPolicyAcknowledgements(parsed.policyAcknowledgements)
          if (parsed.audits) setAudits(parsed.audits)
          if (parsed.complianceIssues) setComplianceIssues(parsed.complianceIssues)
          if (parsed.notifications) setNotifications(parsed.notifications)
          if (parsed.settings) setSettings(parsed.settings)
          if (parsed.simulatedUsers) {
            setSimulatedUsers(parsed.simulatedUsers)
            const currentUserId = localStorage.getItem("ecosphere_active_user") || "emp-2"
            const active = parsed.simulatedUsers.find((u: SimulatedUser) => u.id === currentUserId)
            if (active) setCurrentUser(active)
          }
        } catch (e) {
          console.error("Failed to load ESG state from localstorage:", e)
        }
      }
    }
  }, [])

  // Sync state to local storage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dataToSave = {
        departments,
        categories,
        emissionFactors,
        products,
        goals,
        policies,
        badges,
        rewards,
        carbonTransactions,
        csrActivities,
        employeeParticipations,
        challenges,
        challengeParticipations,
        policyAcknowledgements,
        audits,
        complianceIssues,
        notifications,
        settings,
        simulatedUsers
      }
      localStorage.setItem("ecosphere_esg_data", JSON.stringify(dataToSave))
      localStorage.setItem("ecosphere_active_user", currentUser.id)
    }
  }, [
    departments, categories, emissionFactors, products, goals, policies, badges, rewards,
    carbonTransactions, csrActivities, employeeParticipations, challenges, challengeParticipations,
    policyAcknowledgements, audits, complianceIssues, notifications, settings, simulatedUsers, currentUser
  ])

  // --- Functions / Actions ---

  const setCurrentUserById = (id: string) => {
    const user = simulatedUsers.find(u => u.id === id)
    if (user) {
      setCurrentUser(user)
      toast.success(`Switched persona to: ${user.name}`)
    }
  }

  const updateSettings = (newSettings: Partial<OrganizationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    toast.success("Organization settings updated")
  }

  const addDepartment = (dept: Omit<Department, "id">) => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`
    }
    setDepartments(prev => [...prev, newDept])
    toast.success(`Department "${dept.name}" created`)
  }

  const updateDepartment = (id: string, updated: Partial<Department>) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d))
  }

  const addCategory = (cat: Omit<Category, "id">) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`
    }
    setCategories(prev => [...prev, newCat])
    toast.success(`Category "${cat.name}" added`)
  }

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c))
  }

  const addEmissionFactor = (ef: Omit<EmissionFactor, "id">) => {
    const newEf: EmissionFactor = {
      ...ef,
      id: `ef-${Date.now()}`
    }
    setEmissionFactors(prev => [...prev, newEf])
    toast.success(`Emission Factor "${ef.name}" configured`)
  }

  const updateEmissionFactor = (id: string, updated: Partial<EmissionFactor>) => {
    setEmissionFactors(prev => prev.map(ef => ef.id === id ? { ...ef, ...updated } : ef))
  }

  const addProductProfile = (prod: Omit<ProductEsgProfile, "id">) => {
    const newProd: ProductEsgProfile = {
      ...prod,
      id: `prod-${Date.now()}`
    }
    setProducts(prev => [...prev, newProd])
    toast.success(`Product profile "${prod.name}" linked`)
  }

  // Carbon Accounting Logic
  const addCarbonTransaction = (tx: Omit<CarbonTransaction, "id" | "calculatedEmissions">) => {
    const factorObj = emissionFactors.find(f => f.id === tx.emissionFactorId)
    const factorValue = factorObj ? factorObj.factor : 0
    const calculated = tx.quantity * factorValue

    const newTx: CarbonTransaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      calculatedEmissions: calculated
    }

    setCarbonTransactions(prev => [newTx, ...prev])

    // Update goals current values if matches
    if (tx.sourceType === "Fleet" || tx.sourceType === "Manufacturing" || tx.sourceType === "Expenses" || tx.sourceType === "Purchase") {
      setGoals(prevGoals => prevGoals.map(g => {
        if (g.category === "Emissions") {
          return { ...g, currentValue: g.currentValue + calculated }
        }
        return g
      }))
    }

    toast.success(`Carbon Transaction added: ${calculated.toFixed(1)} kg CO2e calculated`)
  }

  const addCsrActivity = (act: Omit<CsrActivity, "id">) => {
    const newAct: CsrActivity = {
      ...act,
      id: `csr-${Date.now()}`
    }
    setCsrActivities(prev => [newAct, ...prev])
    toast.success(`CSR Activity "${act.title}" announced`)
  }

  // Gamification: Badge Auto-Award Checker
  const checkAndAwardBadges = (userId: string, updatedXp: number, updatedChallengesCount: number, allUsers: SimulatedUser[]) => {
    if (!settings.badgeAutoAward) return

    const user = allUsers.find(u => u.id === userId)
    if (!user) return

    const newBadgesUnlocked: string[] = []
    const updatedUserBadges = [...user.badges]

    badges.forEach(badge => {
      if (updatedUserBadges.includes(badge.id)) return // Already unlocked

      let unlock = false
      if (badge.unlockRule.type === "xp" && updatedXp >= badge.unlockRule.value) {
        unlock = true
      } else if (badge.unlockRule.type === "challenges" && updatedChallengesCount >= badge.unlockRule.value) {
        unlock = true
      }

      if (unlock) {
        updatedUserBadges.push(badge.id)
        newBadgesUnlocked.push(badge.id)
      }
    })

    if (newBadgesUnlocked.length > 0) {
      // Award in state
      setSimulatedUsers(prev => prev.map(u => u.id === userId ? { ...u, badges: updatedUserBadges } : u))
      
      // Update active user state if matches
      if (currentUser.id === userId) {
        setCurrentUser(prev => ({ ...prev, badges: updatedUserBadges }))
      }

      // Add notifications & toast
      newBadgesUnlocked.forEach(badgeId => {
        const badgeObj = badges.find(b => b.id === badgeId)
        const name = badgeObj ? badgeObj.name : "New Badge"
        const icon = badgeObj ? badgeObj.icon : "🎖️"
        
        const newNotif: Notification = {
          id: `not-badge-${Date.now()}-${badgeId}`,
          type: "badge",
          title: `Badge Unlocked: ${name} ${icon}`,
          message: `${user.name} unlocked the badge "${name}" - ${badgeObj?.description}`,
          date: new Date().toISOString().split("T")[0],
          read: false
        }
        
        setNotifications(prev => [newNotif, ...prev])
        toast(`🎉 Badge Unlocked: ${name} ${icon}!`, {
          description: badgeObj?.description
        })
      })
    }
  }

  const submitCsrParticipation = (activityId: string, proofName: string) => {
    const activity = csrActivities.find(a => a.id === activityId)
    if (!activity) return

    // Evidence requirement rule
    if (settings.evidenceRequirement && !proofName) {
      toast.error("Proof of participation is required under organizational policy.")
      return
    }

    const newPart: EmployeeParticipation = {
      id: `part-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      activityId: activityId,
      activityTitle: activity.title,
      proofName: proofName || undefined,
      proofUrl: proofName ? `/proofs/${proofName}` : undefined,
      approvalStatus: "Under Review",
      pointsEarned: activity.points,
      completionDate: new Date().toISOString().split("T")[0]
    }

    setEmployeeParticipations(prev => [newPart, ...prev])
    toast.success("Participation submitted for review")
  }

  const approveCsrParticipation = (participationId: string) => {
    const part = employeeParticipations.find(p => p.id === participationId)
    if (!part) return

    setEmployeeParticipations(prev => prev.map(p => p.id === participationId ? { ...p, approvalStatus: "Approved" } : p))

    // Award Points/XP to Employee
    setSimulatedUsers(prev => prev.map(u => {
      if (u.id === part.employeeId) {
        const newXp = u.xp + part.pointsEarned
        const newPoints = u.points + part.pointsEarned
        
        // Find completed challenges count
        const completedChals = challengeParticipations.filter(cp => cp.employeeId === u.id && cp.approvalStatus === "Approved").length
        
        setTimeout(() => {
          checkAndAwardBadges(u.id, newXp, completedChals, prev.map(usr => usr.id === u.id ? { ...usr, xp: newXp, points: newPoints } : usr))
        }, 10)

        return {
          ...u,
          xp: newXp,
          points: newPoints
        }
      }
      return u
    }))

    // Sync active user if matches
    if (currentUser.id === part.employeeId) {
      setCurrentUser(prev => ({
        ...prev,
        xp: prev.xp + part.pointsEarned,
        points: prev.points + part.pointsEarned
      }))
    }

    const newNotif: Notification = {
      id: `not-${Date.now()}`,
      type: "approval",
      title: "Participation Approved",
      message: `Your participation in "${part.activityTitle}" has been approved! Earned ${part.pointsEarned} points.`,
      date: new Date().toISOString().split("T")[0],
      read: false
    }
    setNotifications(prev => [newNotif, ...prev])
    toast.success("Participation approved and points/XP awarded")
  }

  const rejectCsrParticipation = (participationId: string) => {
    const part = employeeParticipations.find(p => p.id === participationId)
    if (!part) return

    setEmployeeParticipations(prev => prev.map(p => p.id === participationId ? { ...p, approvalStatus: "Rejected" } : p))
    
    const newNotif: Notification = {
      id: `not-${Date.now()}`,
      type: "approval",
      title: "Participation Rejected",
      message: `Your participation in "${part.activityTitle}" was rejected. Please resubmit appropriate proof.`,
      date: new Date().toISOString().split("T")[0],
      read: false
    }
    setNotifications(prev => [newNotif, ...prev])
    toast.error("Participation rejected")
  }

  const addChallenge = (challenge: Omit<Challenge, "id">) => {
    const newChallenge: Challenge = {
      ...challenge,
      id: `chal-${Date.now()}`
    }
    setChallenges(prev => [newChallenge, ...prev])
    toast.success(`Challenge "${challenge.title}" created in ${challenge.status} status`)
  }

  const updateChallengeStatus = (id: string, status: Challenge["status"]) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    toast.success(`Challenge status updated to ${status}`)
  }

  const submitChallengeParticipation = (challengeId: string, proofName: string) => {
    const challenge = challenges.find(c => c.id === challengeId)
    if (!challenge) return

    if (challenge.evidenceRequired && !proofName) {
      toast.error("Proof is required to submit progress for this challenge.")
      return
    }

    // Check if employee already participates
    const existing = challengeParticipations.find(cp => cp.challengeId === challengeId && cp.employeeId === currentUser.id)

    if (existing) {
      setChallengeParticipations(prev => prev.map(cp => cp.id === existing.id ? {
        ...cp,
        progress: 100,
        proofName: proofName || undefined,
        proofUrl: proofName ? `/proofs/${proofName}` : undefined,
        approvalStatus: "Under Review"
      } : cp))
    } else {
      const newPart: ChallengeParticipation = {
        id: `cp-${Date.now()}`,
        challengeId,
        challengeTitle: challenge.title,
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        progress: 100,
        proofName: proofName || undefined,
        proofUrl: proofName ? `/proofs/${proofName}` : undefined,
        approvalStatus: "Under Review",
        xpAwarded: challenge.xp
      }
      setChallengeParticipations(prev => [...prev, newPart])
    }

    toast.success("Challenge progress submitted for approval")
  }

  const approveChallengeParticipation = (participationId: string) => {
    const part = challengeParticipations.find(p => p.id === participationId)
    if (!part) return

    setChallengeParticipations(prev => prev.map(p => p.id === participationId ? { ...p, approvalStatus: "Approved", completionDate: new Date().toISOString().split("T")[0] } : p))

    // Award XP (challenges award XP only)
    setSimulatedUsers(prev => prev.map(u => {
      if (u.id === part.employeeId) {
        const newXp = u.xp + part.xpAwarded
        
        // Find completed challenges count (including this approved one)
        const completedChals = challengeParticipations.filter(cp => cp.employeeId === u.id && (cp.id === participationId || cp.approvalStatus === "Approved")).length

        setTimeout(() => {
          checkAndAwardBadges(u.id, newXp, completedChals, prev.map(usr => usr.id === u.id ? { ...usr, xp: newXp } : usr))
        }, 10)

        return {
          ...u,
          xp: newXp
        }
      }
      return u
    }))

    // Sync active user
    if (currentUser.id === part.employeeId) {
      setCurrentUser(prev => ({
        ...prev,
        xp: prev.xp + part.xpAwarded
      }))
    }

    const newNotif: Notification = {
      id: `not-${Date.now()}`,
      type: "approval",
      title: "Challenge Approved",
      message: `Your completion of challenge "${part.challengeTitle}" has been approved! Earned ${part.xpAwarded} XP.`,
      date: new Date().toISOString().split("T")[0],
      read: false
    }
    setNotifications(prev => [newNotif, ...prev])
    toast.success("Challenge completion approved and XP awarded")
  }

  const rejectChallengeParticipation = (participationId: string) => {
    const part = challengeParticipations.find(p => p.id === participationId)
    if (!part) return

    setChallengeParticipations(prev => prev.map(p => p.id === participationId ? { ...p, approvalStatus: "Rejected" } : p))

    const newNotif: Notification = {
      id: `not-${Date.now()}`,
      type: "approval",
      title: "Challenge Rejected",
      message: `Your challenge progress for "${part.challengeTitle}" was rejected. Please review submission parameters.`,
      date: new Date().toISOString().split("T")[0],
      read: false
    }
    setNotifications(prev => [newNotif, ...prev])
    toast.error("Challenge progress rejected")
  }

  const acknowledgePolicy = (policyId: string) => {
    const policy = policies.find(p => p.id === policyId)
    if (!policy) return

    // Avoid double acknowledgements
    const existing = policyAcknowledgements.find(ack => ack.policyId === policyId && ack.employeeId === currentUser.id)
    if (existing) {
      toast.info("You have already acknowledged this policy")
      return
    }

    const newAck: PolicyAcknowledgement = {
      id: `ack-${Date.now()}`,
      policyId,
      policyTitle: policy.title,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      acknowledgedDate: new Date().toISOString().split("T")[0]
    }

    setPolicyAcknowledgements(prev => [...prev, newAck])
    toast.success(`Policy "${policy.title}" acknowledged`)
  }

  const addAudit = (audit: Omit<Audit, "id">) => {
    const newAudit: Audit = {
      ...audit,
      id: `audit-${Date.now()}`
    }
    setAudits(prev => [newAudit, ...prev])
    toast.success(`Audit "${audit.title}" created`)
  }

  const addComplianceIssue = (issue: Omit<ComplianceIssue, "id">) => {
    const newIssue: ComplianceIssue = {
      ...issue,
      id: `issue-${Date.now()}`
    }
    setComplianceIssues(prev => [newIssue, ...prev])

    // Send notification
    const newNotif: Notification = {
      id: `not-comp-${Date.now()}`,
      type: "compliance",
      title: `Compliance Issue Raised (Severity: ${issue.severity})`,
      message: `${issue.description} assigned to owner ${issue.owner}. Due date: ${issue.dueDate}`,
      date: new Date().toISOString().split("T")[0],
      read: false
    }
    setNotifications(prev => [newNotif, ...prev])
    toast.warning("Compliance issue logged and notifications dispatched")
  }

  const resolveComplianceIssue = (id: string) => {
    setComplianceIssues(prev => prev.map(issue => issue.id === id ? { ...issue, status: "Resolved" } : issue))
    toast.success("Compliance issue resolved")
  }

  // Reward Redemption Logic
  const redeemReward = (rewardId: string): boolean => {
    const reward = rewards.find(r => r.id === rewardId)
    if (!reward) {
      toast.error("Reward not found")
      return false
    }

    if (reward.stock <= 0) {
      toast.error("This reward is currently out of stock")
      return false
    }

    if (currentUser.points < reward.pointsRequired) {
      toast.error(`Insufficient points. You need ${reward.pointsRequired} points (You have ${currentUser.points}).`)
      return false
    }

    // Deduct points from active user and decrement stock
    setRewards(prev => prev.map(r => r.id === rewardId ? { ...r, stock: r.stock - 1 } : r))
    
    setSimulatedUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, points: u.points - reward.pointsRequired }
      }
      return u
    }))

    setCurrentUser(prev => ({ ...prev, points: prev.points - reward.pointsRequired }))

    // Log Notification
    const newNotif: Notification = {
      id: `not-${Date.now()}`,
      type: "system",
      title: "Reward Redeemed",
      message: `You successfully redeemed "${reward.name}" for ${reward.pointsRequired} points. Stock updated.`,
      date: new Date().toISOString().split("T")[0],
      read: false
    }
    setNotifications(prev => [newNotif, ...prev])
    
    toast.success(`🎉 Redeemed: ${reward.name}! Points balance updated.`)
    return true
  }

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <ESGStoreContext.Provider value={{
      departments,
      categories,
      emissionFactors,
      products,
      goals,
      policies,
      badges,
      rewards,
      carbonTransactions,
      csrActivities,
      employeeParticipations,
      challenges,
      challengeParticipations,
      policyAcknowledgements,
      audits,
      complianceIssues,
      notifications,
      settings,
      simulatedUsers,
      currentUser,
      currentTab,
      setCurrentTab,
      
      setCurrentUserById,
      updateSettings,
      addDepartment,
      updateDepartment,
      addCategory,
      updateCategory,
      addEmissionFactor,
      updateEmissionFactor,
      addProductProfile,
      
      addCarbonTransaction,
      addCsrActivity,
      submitCsrParticipation,
      approveCsrParticipation,
      rejectCsrParticipation,
      
      addChallenge,
      updateChallengeStatus,
      submitChallengeParticipation,
      approveChallengeParticipation,
      rejectChallengeParticipation,
      
      acknowledgePolicy,
      addAudit,
      addComplianceIssue,
      resolveComplianceIssue,
      
      redeemReward,
      clearNotifications,
      markNotificationRead
    }}>
      {children}
    </ESGStoreContext.Provider>
  )
}

export const useESGStore = () => {
  const context = useContext(ESGStoreContext)
  if (!context) {
    throw new Error("useESGStore must be used within an ESGProvider")
  }
  return context
}
