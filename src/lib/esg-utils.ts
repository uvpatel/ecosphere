import {
  Department,
  CarbonTransaction,
  EmployeeParticipation,
  ChallengeParticipation,
  PolicyAcknowledgement,
  EsgPolicy,
  ComplianceIssue,
  OrganizationSettings
} from "@/hooks/use-esg-store"

export interface DepartmentESGScore {
  departmentId: string
  departmentName: string
  code: string
  employeeCount: number
  environmentalScore: number
  socialScore: number
  governanceScore: number
  totalScore: number
}

export function calculateESGData(
  departments: Department[],
  carbonTransactions: CarbonTransaction[],
  csrParticipations: EmployeeParticipation[],
  challengeParticipations: ChallengeParticipation[],
  policyAcks: PolicyAcknowledgement[],
  policies: EsgPolicy[],
  complianceIssues: ComplianceIssue[],
  settings: OrganizationSettings,
  simulatedUsers: any[]
) {
  const activePolicies = policies.filter(p => p.status === "Active")
  const totalPoliciesCount = activePolicies.length

  const deptScores: DepartmentESGScore[] = departments.map(dept => {
    // 1. Environmental Score (based on carbon emissions per capita)
    // Find all carbon transactions for this department
    const deptTx = carbonTransactions.filter(tx => tx.departmentId === dept.id)
    const totalEmissions = deptTx.reduce((acc, tx) => acc + tx.calculatedEmissions, 0)
    
    // Calculate emissions per employee (in kg CO2e)
    const emissionsPerCapita = dept.employeeCount > 0 ? totalEmissions / dept.employeeCount : 0
    
    // Score out of 100 (standardized: baseline is 200 kg CO2e/employee. More emissions decreases score)
    let envScore = 95 - (emissionsPerCapita / 50) * 10
    envScore = Math.max(30, Math.min(100, envScore))

    // 2. Social Score (based on CSR and Challenge participation rates)
    // Find employees belonging to this department
    const deptUsers = simulatedUsers.filter(u => u.departmentId === dept.id)
    const deptUserIds = deptUsers.map(u => u.id)

    // Approved CSR participations by this department
    const approvedCsrCount = csrParticipations.filter(
      p => deptUserIds.includes(p.employeeId) && p.approvalStatus === "Approved"
    ).length

    // Approved Challenge participations
    const approvedChallengeCount = challengeParticipations.filter(
      p => deptUserIds.includes(p.employeeId) && p.approvalStatus === "Approved"
    ).length

    const totalApprovedParticipations = approvedCsrCount + approvedChallengeCount
    const participationRate = dept.employeeCount > 0 ? (totalApprovedParticipations / dept.employeeCount) * 100 : 0
    
    // Score based on rate (50% base + participation rate contribution)
    let socScore = 70 + (participationRate / 2)
    socScore = Math.max(40, Math.min(100, socScore))

    // 3. Governance Score (policy acknowledgments & compliance issues)
    // Find all policy acknowledgements from employees in this department
    const deptAcks = policyAcks.filter(ack => deptUserIds.includes(ack.employeeId))
    const totalPossibleAcks = dept.employeeCount * totalPoliciesCount
    const ackRate = totalPossibleAcks > 0 ? (deptAcks.length / totalPossibleAcks) * 100 : 90

    // Compliance deductions: subtract 10 points for each open compliance issue owned by someone in the department
    // Let's match by department head or owner name containing department members
    const deptUserNames = deptUsers.map(u => u.name)
    const openIssuesInDept = complianceIssues.filter(
      issue => (issue.status === "Open" || issue.status === "In Progress") && 
               (deptUserNames.includes(issue.owner) || issue.owner === dept.head)
    ).length
    
    let govScore = ackRate - (openIssuesInDept * 15)
    govScore = Math.max(20, Math.min(100, govScore))

    // 4. Department Total Score
    const totalScore = (
      envScore * settings.weightEnvironmental +
      socScore * settings.weightSocial +
      govScore * settings.weightGovernance
    ) / 100

    return {
      departmentId: dept.id,
      departmentName: dept.name,
      code: dept.code,
      employeeCount: dept.employeeCount,
      environmentalScore: Math.round(envScore * 10) / 10,
      socialScore: Math.round(socScore * 10) / 10,
      governanceScore: Math.round(govScore * 10) / 10,
      totalScore: Math.round(totalScore * 10) / 10
    }
  })

  // Calculate Overall Organizational ESG Score weighted by department employee count
  const totalEmployees = departments.reduce((acc, d) => acc + d.employeeCount, 0)
  
  let overallScore = 0
  let totalE = 0
  let totalS = 0
  let totalG = 0

  if (totalEmployees > 0) {
    deptScores.forEach(ds => {
      const weight = ds.employeeCount / totalEmployees
      overallScore += ds.totalScore * weight
      totalE += ds.environmentalScore * weight
      totalS += ds.socialScore * weight
      totalG += ds.governanceScore * weight
    })
  } else {
    overallScore = 80
    totalE = 80
    totalS = 80
    totalG = 80
  }

  return {
    departmentScores: deptScores,
    overallScore: Math.round(overallScore * 10) / 10,
    overallE: Math.round(totalE * 10) / 10,
    overallS: Math.round(totalS * 10) / 10,
    overallG: Math.round(totalG * 10) / 10,
    totalEmployees
  }
}
