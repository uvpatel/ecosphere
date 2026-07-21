import "dotenv/config";
import { db } from "../lib/db";
import * as schema from "./schema";

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Clear existing data in reverse order of dependencies
    console.log("🧹 Clearing existing database tables...");
    await db.delete(schema.policyAcknowledgements);
    await db.delete(schema.challengeParticipations);
    await db.delete(schema.employeeParticipations);
    await db.delete(schema.carbonTransactions);
    await db.delete(schema.complianceIssues);
    await db.delete(schema.notifications);
    await db.delete(schema.audits);
    await db.delete(schema.csrActivities);
    await db.delete(schema.challenges);
    await db.delete(schema.products);
    await db.delete(schema.goals);
    await db.delete(schema.policies);
    await db.delete(schema.badges);
    await db.delete(schema.rewards);
    await db.delete(schema.emissionFactors);
    await db.delete(schema.categories);
    await db.delete(schema.simulatedUsers);
    await db.delete(schema.departments);
    await db.delete(schema.settings);

    // 2. Insert Departments
    console.log("🏢 Seeding departments...");
    await db.insert(schema.departments).values([
      { id: "dept-1", name: "Research & Development", code: "RND", head: "Dr. Angela Martin", employeeCount: 45, status: "Active" },
      { id: "dept-2", name: "Marketing & Sales", code: "MKT", head: "Sarah Chen", employeeCount: 30, status: "Active" },
      { id: "dept-3", name: "Operations & Logistics", code: "OPS", head: "Marcus Vance", employeeCount: 120, status: "Active" },
      { id: "dept-4", name: "Human Resources", code: "HR", head: "Toby Flenderson", employeeCount: 10, status: "Active" },
    ]);

    // 3. Insert Categories
    console.log("📁 Seeding categories...");
    await db.insert(schema.categories).values([
      { id: "cat-1", name: "Energy Conservation", type: "Challenge", status: "Active" },
      { id: "cat-2", name: "Waste Reduction", type: "Challenge", status: "Active" },
      { id: "cat-3", name: "Community Service", type: "CSR Activity", status: "Active" },
      { id: "cat-4", name: "Environmental Cleanup", type: "CSR Activity", status: "Active" },
    ]);

    // 4. Insert Emission Factors
    console.log("⚡ Seeding emission factors...");
    await db.insert(schema.emissionFactors).values([
      { id: "ef-1", name: "Grid Electricity", category: "Electricity", factor: 0.385, unit: "kWh", status: "Active" },
      { id: "ef-2", name: "Natural Gas Heating", category: "Natural Gas", factor: 2.05, unit: "m³", status: "Active" },
      { id: "ef-3", name: "Generator Diesel", category: "Diesel", factor: 2.68, unit: "L", status: "Active" },
      { id: "ef-4", name: "Company Fleet Petrol", category: "Petrol", factor: 2.31, unit: "L", status: "Active" },
    ]);

    // 5. Insert Products
    console.log("📦 Seeding products...");
    await db.insert(schema.products).values([
      { id: "prod-1", name: "EcoWidget Pro", sku: "WID-ECO-01", carbonFootprint: 1.25, recycledMaterialPct: 75, ethicalSourcingRating: "A" },
      { id: "prod-2", name: "Standard Widget", sku: "WID-STD-02", carbonFootprint: 4.80, recycledMaterialPct: 10, ethicalSourcingRating: "C" },
    ]);

    // 6. Insert Goals
    console.log("🎯 Seeding goals...");
    await db.insert(schema.goals).values([
      { id: "goal-1", title: "Reduce Carbon Emissions by 20%", targetValue: 50000, currentValue: 42000, unit: "kg CO2e", category: "Emissions", deadline: "2026-12-31", status: "In Progress" },
      { id: "goal-2", title: "Transition to 80% Recycled Material", targetValue: 80, currentValue: 55, unit: "%", category: "Material", deadline: "2026-10-31", status: "In Progress" },
      { id: "goal-3", title: "Zero Single-Use Plastics in Office", targetValue: 100, currentValue: 100, unit: "%", category: "Waste", deadline: "2026-06-30", status: "Achieved" },
    ]);

    // 7. Insert Policies
    console.log("📄 Seeding policies...");
    await db.insert(schema.policies).values([
      { id: "pol-1", title: "Sustainable Procurement Policy", code: "ESG-POL-001", category: "Governance", version: "v2.1", publishDate: "2026-01-15", status: "Active", content: "This policy establishes standards for purchasing goods and services that minimize environmental impacts, encourage recycling, and require suppliers to comply with ethical working conditions." },
      { id: "pol-2", title: "Office Energy Efficiency Standard", code: "ESG-POL-002", category: "Environmental", version: "v1.0", publishDate: "2026-03-01", status: "Active", content: "Guidelines for energy usage in office spaces, including mandatory shutdown procedures for workstations, smart thermostat levels, and energy-efficient lighting standards." },
      { id: "pol-3", title: "Diversity & Inclusion Charter", code: "ESG-POL-003", category: "Social", version: "v3.0", publishDate: "2025-10-01", status: "Active", content: "Outlines EcoSphere's commitment to building a diverse workforce and providing safe, inclusive environments where employees of all backgrounds thrive." }
    ]);

    // 8. Insert Badges
    console.log("🏅 Seeding badges...");
    await db.insert(schema.badges).values([
      { id: "badge-1", name: "Eco Novice", description: "Earn your first 100 XP in ESG activities", unlockRuleType: "xp", unlockRuleValue: 100, icon: "🌱" },
      { id: "badge-2", name: "Green Champion", description: "Reach a total of 500 XP", unlockRuleType: "xp", unlockRuleValue: 500, icon: "🏆" },
      { id: "badge-3", name: "Task Master", description: "Complete 3 sustainability challenges", unlockRuleType: "challenges", unlockRuleValue: 3, icon: "⚡" },
    ]);

    // 9. Insert Rewards
    console.log("🎁 Seeding rewards...");
    await db.insert(schema.rewards).values([
      { id: "reward-1", name: "Plant a Tree in Your Name", description: "We will partner with OneTreePlanted to plant a tree in a reforestation zone and mail you a certificate.", pointsRequired: 50, stock: 99, status: "Active" },
      { id: "reward-2", name: "Eco-Friendly Coffee Mug", description: "Insulated, double-walled travel mug made from 100% recycled coffee husks.", pointsRequired: 150, stock: 12, status: "Active" },
      { id: "reward-3", name: "$25 Organic Food Voucher", description: "Redeemable at local organic and zero-waste grocery stores.", pointsRequired: 250, stock: 5, status: "Active" },
    ]);

    // 10. Insert Carbon Transactions
    console.log("🚗 Seeding carbon transactions...");
    await db.insert(schema.carbonTransactions).values([
      { id: "tx-1", sourceType: "Fleet", sourceId: "FLEET-001", description: "Q2 Operations Logistics Delivery", departmentId: "dept-3", quantity: 1500, unit: "L", emissionFactorId: "ef-4", calculatedEmissions: 3465, date: "2026-06-15" },
      { id: "tx-2", sourceType: "Purchase", sourceId: "PO-4091", description: "HQ Office Electricity Usage May", departmentId: "dept-4", quantity: 8200, unit: "kWh", emissionFactorId: "ef-1", calculatedEmissions: 3157, date: "2026-05-31" },
      { id: "tx-3", sourceType: "Manufacturing", sourceId: "JOB-291", description: "Production Line B Generator Run", departmentId: "dept-1", quantity: 450, unit: "L", emissionFactorId: "ef-3", calculatedEmissions: 1206, date: "2026-07-02" },
    ]);

    // 11. Insert CSR Activities
    console.log("🤝 Seeding CSR activities...");
    await db.insert(schema.csrActivities).values([
      { id: "csr-1", title: "Local Park Reforestation", category: "Environmental Cleanup", description: "Volunteering to plant native saplings and clean trails at Oakwood Nature Park.", date: "2026-07-28", location: "Oakwood Park", points: 40, maxParticipants: 30, status: "Upcoming" },
      { id: "csr-2", title: "Tech Mentorship for Local High Schools", category: "Community Service", description: "Hosting coding and design workshops for underrepresented students.", date: "2026-07-10", location: "R&D Lab 1", points: 60, maxParticipants: 10, status: "Completed" },
    ]);

    // 12. Insert Employee Participations
    console.log("👤 Seeding employee participations...");
    await db.insert(schema.employeeParticipations).values([
      { id: "part-1", employeeId: "emp-2", employeeName: "Alex Rivera", activityId: "csr-2", activityTitle: "Tech Mentorship for Local High Schools", proofName: "mentorship_photo.jpg", proofUrl: "/proofs/mentorship_photo.jpg", approvalStatus: "Approved", pointsEarned: 60, completionDate: "2026-07-10" },
      { id: "part-2", employeeId: "emp-3", employeeName: "Sarah Chen", activityId: "csr-2", activityTitle: "Tech Mentorship for Local High Schools", proofName: "attendance_sheet.pdf", proofUrl: "/proofs/attendance_sheet.pdf", approvalStatus: "Approved", pointsEarned: 60, completionDate: "2026-07-10" },
    ]);

    // 13. Insert Challenges
    console.log("⚔️ Seeding challenges...");
    await db.insert(schema.challenges).values([
      { id: "chal-1", title: "No-Drive Work Week", category: "Energy Conservation", description: "Commute to work using public transit, walking, or cycling for 5 consecutive days.", xp: 120, difficulty: "Medium", evidenceRequired: true, deadline: "2026-07-31", status: "Active" },
      { id: "chal-2", title: "Office Plastic Detox", category: "Waste Reduction", description: "Bring a reusable lunchbox and steel water bottle to work, avoiding single-use plastics.", xp: 80, difficulty: "Easy", evidenceRequired: true, deadline: "2026-08-15", status: "Active" },
      { id: "chal-3", title: "Optimize Server Standby Times", category: "Energy Conservation", description: "Configure lab machines to auto-suspend after 15 minutes of inactivity.", xp: 200, difficulty: "Hard", evidenceRequired: true, deadline: "2026-07-15", status: "Completed" },
    ]);

    // 14. Insert Challenge Participations
    console.log("🛡️ Seeding challenge participations...");
    await db.insert(schema.challengeParticipations).values([
      { id: "cp-1", challengeId: "chal-3", challengeTitle: "Optimize Server Standby Times", employeeId: "emp-2", employeeName: "Alex Rivera", progress: 100, proofName: "cron_script_screenshot.png", proofUrl: "/proofs/cron_script_screenshot.png", approvalStatus: "Approved", xpAwarded: 200, completionDate: "2026-07-14" },
      { id: "cp-2", challengeId: "chal-1", challengeTitle: "No-Drive Work Week", employeeId: "emp-2", employeeName: "Alex Rivera", progress: 60, approvalStatus: "Under Review", xpAwarded: 0 },
    ]);

    // 15. Insert Policy Acknowledgements
    console.log("✍️ Seeding policy acknowledgements...");
    await db.insert(schema.policyAcknowledgements).values([
      { id: "ack-1", policyId: "pol-1", policyTitle: "Sustainable Procurement Policy", employeeId: "emp-2", employeeName: "Alex Rivera", acknowledgedDate: "2026-01-20" },
      { id: "ack-2", policyId: "pol-3", policyTitle: "Diversity & Inclusion Charter", employeeId: "emp-3", employeeName: "Sarah Chen", acknowledgedDate: "2026-02-14" },
    ]);

    // 16. Insert Audits
    console.log("🕵️‍♂️ Seeding audits...");
    await db.insert(schema.audits).values([
      { id: "audit-1", title: "Annual Carbon Accounting Audit", type: "External", scope: "Environmental", leadAuditor: "SustainCorp LLC", date: "2026-05-10", status: "Completed", findingsCount: 2 },
      { id: "audit-2", title: "Q3 Governance & Compliance Review", type: "Internal", scope: "Governance", leadAuditor: "Marcus Vance", date: "2026-07-15", status: "In Progress", findingsCount: 1 },
    ]);

    // 17. Insert Compliance Issues
    console.log("🚨 Seeding compliance issues...");
    await db.insert(schema.complianceIssues).values([
      { id: "issue-1", auditId: "audit-1", severity: "Medium", description: "Fleet fuel logs were missing exact pump receipts for March transactions.", owner: "Marcus Vance", dueDate: "2026-06-30", status: "Open" },
      { id: "issue-2", auditId: "audit-2", severity: "High", description: "Unacknowledged procurement policy violations observed in minor office supply purchases.", owner: "Sarah Chen", dueDate: "2026-08-10", status: "In Progress" },
    ]);

    // 18. Insert Notifications
    console.log("🔔 Seeding notifications...");
    await db.insert(schema.notifications).values([
      { id: "not-1", type: "compliance", title: "Overdue Compliance Issue", message: "Compliance issue regarding 'Fleet fuel logs' is open past its due date (2026-06-30). Please address immediately.", date: "2026-07-01", read: false },
    ]);

    // 19. Insert Simulated Users
    console.log("👥 Seeding simulated users...");
    await db.insert(schema.simulatedUsers).values([
      { id: "emp-admin", name: "ESG Administrator", email: "admin@ecosphere.com", role: "Admin", departmentId: "dept-4", xp: 0, points: 0, badges: [] },
      { id: "emp-2", name: "Alex Rivera", email: "alex.rivera@ecosphere.com", role: "Employee", departmentId: "dept-1", xp: 260, points: 60, badges: ["badge-1"] },
      { id: "emp-3", name: "Sarah Chen", email: "sarah.chen@ecosphere.com", role: "Employee", departmentId: "dept-2", xp: 480, points: 380, badges: ["badge-1"] },
    ]);

    // 20. Insert Settings
    console.log("⚙️ Seeding settings...");
    await db.insert(schema.settings).values([
      {
        id: "global",
        weightEnvironmental: 40,
        weightSocial: 30,
        weightGovernance: 30,
        autoEmissionCalculation: true,
        evidenceRequirement: true,
        badgeAutoAward: true
      }
    ]);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

main();
