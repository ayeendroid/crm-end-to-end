// Data Service - Generates realistic ISP operational data
// This service transforms our mock customer data into various operational datasets

import {
  mockBharatNetCustomers,
  type BharatNetCustomer,
} from "./mockBharatNetData";

// ============================================================================
// CONNECTION LEADS / INQUIRIES
// ============================================================================

export interface ConnectionLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: {
    city: string;
    state: string;
    pincode: string;
    address: string;
  };
  requestedPlan: {
    type: "Fiber" | "Broadband" | "Wireless";
    speed: string;
    price: number;
  };
  source: "Website" | "Referral" | "Cold Call" | "Social Media" | "Walk-in";
  status:
    | "New"
    | "Contacted"
    | "Site Survey Scheduled"
    | "Feasibility Check"
    | "Quotation Sent"
    | "Converted"
    | "Lost";
  priority: "Low" | "Medium" | "High";
  assignedTo?: string;
  createdDate: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  siteSurveyDate?: string;
  installationDate?: string;
  notes: string;
  expectedMRR: number;
  conversionProbability: number;
}

export function generateConnectionLeads(count: number = 50): ConnectionLead[] {
  const leads: ConnectionLead[] = [];
  const statuses: ConnectionLead["status"][] = [
    "New",
    "Contacted",
    "Site Survey Scheduled",
    "Feasibility Check",
    "Quotation Sent",
    "Converted",
    "Lost",
  ];
  const priorities: ConnectionLead["priority"][] = ["Low", "Medium", "High"];
  const technicians = [
    "Ramesh Kumar",
    "Sunil Yadav",
    "Prakash Singh",
    "Ajay Sharma",
    "Vijay Patel",
  ];

  // Use first 50 customers as basis for leads
  for (let i = 0; i < Math.min(count, 50); i++) {
    const customer = mockBharatNetCustomers[i];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const createdDate = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ); // Last 30 days

    leads.push({
      id: `LEAD-${1000 + i}`,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      location: customer.location,
      requestedPlan: {
        type: customer.plan.type,
        speed: customer.plan.speed,
        price: customer.plan.price,
      },
      source: customer.source,
      status,
      priority,
      assignedTo:
        status !== "New"
          ? technicians[Math.floor(Math.random() * technicians.length)]
          : undefined,
      createdDate: createdDate.toISOString(),
      lastContactDate:
        status !== "New"
          ? new Date(
              createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString()
          : undefined,
      nextFollowUpDate:
        status !== "Converted" && status !== "Lost"
          ? new Date(
              Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString()
          : undefined,
      siteSurveyDate:
        status === "Site Survey Scheduled" || status === "Feasibility Check"
          ? new Date(
              Date.now() + Math.random() * 3 * 24 * 60 * 60 * 1000
            ).toISOString()
          : undefined,
      installationDate:
        status === "Converted"
          ? new Date(
              Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000
            ).toISOString()
          : undefined,
      notes: generateLeadNotes(status),
      expectedMRR: customer.plan.price,
      conversionProbability: calculateConversionProbability(
        status,
        priority,
        customer.source
      ),
    });
  }

  return leads.sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
}

function generateLeadNotes(status: ConnectionLead["status"]): string {
  const notes: Record<ConnectionLead["status"], string[]> = {
    New: [
      "Inquiry received via website form",
      "Walk-in customer, interested in fiber connection",
      "Referred by existing customer",
      "Called about package pricing",
    ],
    Contacted: [
      "Initial call made, customer interested",
      "Sent package details via email",
      "Customer comparing with other ISPs",
      "Requested callback after weekend",
    ],
    "Site Survey Scheduled": [
      "Site survey scheduled for this Friday",
      "Technician assigned for feasibility check",
      "Customer confirmed availability for survey",
      "Need to check fiber availability in area",
    ],
    "Feasibility Check": [
      "Feasibility assessment in progress",
      "Last mile connectivity being verified",
      "Router placement discussion needed",
      "Awaiting fiber availability confirmation",
    ],
    "Quotation Sent": [
      "Detailed quotation sent via email",
      "Custom package quotation prepared",
      "Installation cost quotation shared",
      "Awaiting customer approval",
    ],
    Converted: [
      "Customer agreed! Installation scheduled",
      "Contract signed, moving to activation",
      "Payment received, scheduling installation",
      "Successfully converted to subscriber",
    ],
    Lost: [
      "Customer chose competitor",
      "Budget constraints mentioned",
      "Area not serviceable currently",
      "Customer postponed decision indefinitely",
    ],
  };
  const statusNotes = notes[status];
  return statusNotes[Math.floor(Math.random() * statusNotes.length)];
}

function calculateConversionProbability(
  status: ConnectionLead["status"],
  priority: ConnectionLead["priority"],
  source: string
): number {
  let probability = 50; // Base probability

  // Status weight
  const statusWeights: Record<ConnectionLead["status"], number> = {
    New: 20,
    Contacted: 35,
    "Site Survey Scheduled": 60,
    "Feasibility Check": 70,
    "Quotation Sent": 80,
    Converted: 100,
    Lost: 0,
  };
  probability = statusWeights[status];

  // Priority boost
  if (priority === "High") probability = Math.min(probability + 10, 95);
  if (priority === "Low") probability = Math.max(probability - 10, 5);

  // Source boost
  if (source === "Referral") probability = Math.min(probability + 15, 95);
  if (source === "Website") probability = Math.min(probability + 5, 95);

  return probability;
}

// ============================================================================
// PLAN UPGRADES / DEALS
// ============================================================================

export interface PlanUpgrade {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  location: string;
  currentPlan: {
    type: string;
    speed: string;
    price: number;
  };
  proposedPlan: {
    type: string;
    speed: string;
    price: number;
  };
  upgradeType: "Speed Upgrade" | "Plan Change" | "OTT Add-on" | "Downgrade";
  status:
    | "Proposed"
    | "Customer Contacted"
    | "Pending Approval"
    | "Approved"
    | "Implemented"
    | "Rejected";
  reason: string;
  mrrImpact: number;
  probability: number;
  createdDate: string;
  expectedCloseDate: string;
  assignedTo: string;
  notes: string;
}

export function generatePlanUpgrades(count: number = 40): PlanUpgrade[] {
  const upgrades: PlanUpgrade[] = [];
  const upgradeTypes: PlanUpgrade["upgradeType"][] = [
    "Speed Upgrade",
    "Plan Change",
    "OTT Add-on",
    "Downgrade",
  ];
  const statuses: PlanUpgrade["status"][] = [
    "Proposed",
    "Customer Contacted",
    "Pending Approval",
    "Approved",
    "Implemented",
    "Rejected",
  ];
  const salesTeam = [
    "Anita Desai",
    "Ravi Kumar",
    "Sneha Patel",
    "Manoj Sharma",
    "Priya Reddy",
  ];

  // Select random customers for upgrades
  const selectedCustomers = [...mockBharatNetCustomers]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  selectedCustomers.forEach((customer, i) => {
    if (customer.status !== "Active") return; // Only active customers can upgrade

    const upgradeType =
      upgradeTypes[Math.floor(Math.random() * upgradeTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdDate = new Date(
      Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000
    );

    const proposedPlan = generateProposedPlan(customer, upgradeType);
    const mrrImpact = proposedPlan.price - customer.plan.price;

    upgrades.push({
      id: `UPG-${2000 + i}`,
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      location: `${customer.location.city}, ${customer.location.state}`,
      currentPlan: {
        type: customer.plan.type,
        speed: customer.plan.speed,
        price: customer.plan.price,
      },
      proposedPlan,
      upgradeType,
      status,
      reason: generateUpgradeReason(upgradeType, customer),
      mrrImpact,
      probability: calculateUpgradeProbability(
        status,
        upgradeType,
        customer.npsScore
      ),
      createdDate: createdDate.toISOString(),
      expectedCloseDate: new Date(
        createdDate.getTime() + 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      assignedTo: salesTeam[Math.floor(Math.random() * salesTeam.length)],
      notes: generateUpgradeNotes(status, upgradeType),
    });
  });

  return upgrades.sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
}

function generateProposedPlan(
  customer: BharatNetCustomer,
  upgradeType: PlanUpgrade["upgradeType"]
) {
  const speedLadder = ["50Mbps", "100Mbps", "200Mbps", "500Mbps", "1Gbps"];
  const currentSpeedIndex = speedLadder.indexOf(customer.plan.speed);

  switch (upgradeType) {
    case "Speed Upgrade":
      if (currentSpeedIndex < speedLadder.length - 1) {
        const newSpeed = speedLadder[currentSpeedIndex + 1];
        return {
          type: customer.plan.type,
          speed: newSpeed,
          price: customer.plan.price + 300 * (currentSpeedIndex + 1),
        };
      }
      break;
    case "Plan Change":
      return {
        type: customer.plan.type === "Broadband" ? "Fiber" : customer.plan.type,
        speed: customer.plan.speed,
        price: customer.plan.price + 200,
      };
    case "OTT Add-on":
      return {
        type: customer.plan.type,
        speed: customer.plan.speed,
        price: customer.plan.price + 199,
      };
    case "Downgrade":
      if (currentSpeedIndex > 0) {
        const newSpeed = speedLadder[currentSpeedIndex - 1];
        return {
          type: customer.plan.type,
          speed: newSpeed,
          price: Math.max(customer.plan.price - 300, 499),
        };
      }
      break;
  }

  // Fallback
  return {
    type: customer.plan.type,
    speed: customer.plan.speed,
    price: customer.plan.price + 300,
  };
}

function generateUpgradeReason(
  upgradeType: PlanUpgrade["upgradeType"],
  customer: BharatNetCustomer
): string {
  const reasons = {
    "Speed Upgrade": [
      `High data usage: ${customer.usage.dataConsumed}GB/month - needs faster speed`,
      "Customer complained about slow speeds during peak hours",
      "Family expanded, more devices connected",
      "Started working from home, requires better bandwidth",
    ],
    "Plan Change": [
      "Wants to switch from Broadband to Fiber for better reliability",
      "Interested in premium tier with more OTT apps",
      "Requested plan with more live TV channels",
      "Looking for unlimited data plan",
    ],
    "OTT Add-on": [
      "Wants to add Netflix and Amazon Prime",
      "Requested Disney+ Hotstar for IPL season",
      "Family wants additional entertainment apps",
      "Asked about premium OTT bundle",
    ],
    Downgrade: [
      "Customer facing budget constraints",
      "Usage decreased significantly",
      "Single person household now, lower requirement",
      "Requested cost optimization",
    ],
  };

  const typeReasons = reasons[upgradeType];
  return typeReasons[Math.floor(Math.random() * typeReasons.length)];
}

function generateUpgradeNotes(
  status: PlanUpgrade["status"],
  _upgradeType: PlanUpgrade["upgradeType"]
): string {
  const notes: Record<PlanUpgrade["status"], string[]> = {
    Proposed: [
      "Opportunity identified from usage analysis",
      "Customer expressed interest during support call",
      "High usage pattern detected",
      "Recommended by retention team",
    ],
    "Customer Contacted": [
      "Initial discussion completed",
      "Customer interested, requested details",
      "Shared plan benefits and pricing",
      "Scheduled follow-up call",
    ],
    "Pending Approval": [
      "Customer agreed verbally, pending confirmation",
      "Awaiting customer decision",
      "Quotation sent, waiting for approval",
      "Customer reviewing options",
    ],
    Approved: [
      "Customer approved! Scheduling upgrade",
      "Payment confirmed, processing upgrade",
      "Contract updated, moving to implementation",
      "All approvals received",
    ],
    Implemented: [
      "Upgrade completed successfully",
      "Plan activated, customer notified",
      "Speed increased, testing confirmed",
      "Customer enjoying new plan",
    ],
    Rejected: [
      "Customer declined due to price",
      "Not interested at this time",
      "Found alternative solution",
      "Budget constraints mentioned",
    ],
  };

  const statusNotes = notes[status];
  return statusNotes[Math.floor(Math.random() * statusNotes.length)];
}

function calculateUpgradeProbability(
  status: PlanUpgrade["status"],
  upgradeType: PlanUpgrade["upgradeType"],
  npsScore: number
): number {
  let probability = 50;

  // Status weight
  const statusWeights: Record<PlanUpgrade["status"], number> = {
    Proposed: 30,
    "Customer Contacted": 50,
    "Pending Approval": 75,
    Approved: 95,
    Implemented: 100,
    Rejected: 0,
  };
  probability = statusWeights[status];

  // Upgrade type weight
  if (upgradeType === "Speed Upgrade") probability += 10;
  if (upgradeType === "Downgrade") probability -= 20;

  // NPS boost
  if (npsScore >= 9) probability += 15;
  if (npsScore >= 7) probability += 5;
  if (npsScore <= 4) probability -= 10;

  return Math.max(0, Math.min(100, probability));
}

// ============================================================================
// SUPPORT TICKETS
// ============================================================================

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  location: string;
  plan: string;
  category:
    | "Slow Internet"
    | "No Connectivity"
    | "OTT Issues"
    | "Billing Query"
    | "Router Problem"
    | "Installation"
    | "Other";
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Pending Customer" | "Resolved" | "Closed";
  subject: string;
  description: string;
  assignedTo?: string;
  createdDate: string;
  updatedDate: string;
  resolvedDate?: string;
  responseTime: number; // in minutes
  resolutionTime?: number; // in hours
  satisfaction?: 1 | 2 | 3 | 4 | 5;
}

export function generateSupportTickets(count: number = 60): SupportTicket[] {
  const tickets: SupportTicket[] = [];
  const categories: SupportTicket["category"][] = [
    "Slow Internet",
    "No Connectivity",
    "OTT Issues",
    "Billing Query",
    "Router Problem",
    "Installation",
    "Other",
  ];
  const statuses: SupportTicket["status"][] = [
    "Open",
    "In Progress",
    "Pending Customer",
    "Resolved",
    "Closed",
  ];
  const supportTeam = [
    "Tech Support - Arun",
    "Tech Support - Deepak",
    "Tech Support - Kavita",
    "Billing - Sunita",
    "Field - Ramesh",
  ];

  // Select random customers for tickets
  const selectedCustomers = [...mockBharatNetCustomers]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  selectedCustomers.forEach((customer, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const priority = determinePriority(category);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdDate = new Date(
      Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000
    ); // Last 45 days
    const responseTime = Math.floor(Math.random() * 120) + 5; // 5-125 minutes

    const ticket: SupportTicket = {
      id: `TKT-${5000 + i}`,
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      location: `${customer.location.city}, ${customer.location.state}`,
      plan: `${customer.plan.type} ${customer.plan.speed}`,
      category,
      priority,
      status,
      subject: generateTicketSubject(category),
      description: generateTicketDescription(category, customer),
      assignedTo:
        status !== "Open"
          ? supportTeam[Math.floor(Math.random() * supportTeam.length)]
          : undefined,
      createdDate: createdDate.toISOString(),
      updatedDate: new Date(
        createdDate.getTime() + responseTime * 60 * 1000
      ).toISOString(),
      responseTime,
    };

    // Add resolution info for resolved/closed tickets
    if (status === "Resolved" || status === "Closed") {
      const resolutionTime = Math.floor(Math.random() * 48) + 1; // 1-48 hours
      ticket.resolvedDate = new Date(
        createdDate.getTime() + resolutionTime * 60 * 60 * 1000
      ).toISOString();
      ticket.resolutionTime = resolutionTime;
      ticket.satisfaction = [3, 4, 4, 5, 5][Math.floor(Math.random() * 5)] as
        | 1
        | 2
        | 3
        | 4
        | 5;
    }

    tickets.push(ticket);
  });

  return tickets.sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
}

function determinePriority(
  category: SupportTicket["category"]
): SupportTicket["priority"] {
  const priorityMap: Record<
    SupportTicket["category"],
    SupportTicket["priority"][]
  > = {
    "Slow Internet": ["Low", "Medium", "Medium", "High"],
    "No Connectivity": ["Critical", "High", "High"],
    "OTT Issues": ["Low", "Low", "Medium"],
    "Billing Query": ["Low", "Medium"],
    "Router Problem": ["Medium", "High"],
    Installation: ["Medium", "High"],
    Other: ["Low", "Medium"],
  };

  const priorities = priorityMap[category];
  return priorities[Math.floor(Math.random() * priorities.length)];
}

function generateTicketSubject(category: SupportTicket["category"]): string {
  const subjects: Record<SupportTicket["category"], string[]> = {
    "Slow Internet": [
      "Internet speed very slow",
      "Unable to stream videos",
      "Speed lower than subscribed plan",
      "Page loading taking too long",
      "Buffering issues during video calls",
    ],
    "No Connectivity": [
      "No internet connection",
      "WiFi not working",
      "Complete network outage",
      "Unable to connect to internet",
      "Connection drops frequently",
    ],
    "OTT Issues": [
      "Netflix not working",
      "Cannot access Amazon Prime",
      "Hotstar shows error message",
      "OTT apps not loading",
      "Video quality poor on streaming apps",
    ],
    "Billing Query": [
      "Question about last invoice",
      "Payment not reflected",
      "Need payment receipt",
      "Billing amount discrepancy",
      "Refund request for overcharge",
    ],
    "Router Problem": [
      "Router lights blinking red",
      "WiFi password not working",
      "Router keeps restarting",
      "Cannot access router settings",
      "Need router replacement",
    ],
    Installation: [
      "Installation not completed",
      "Installation rescheduling needed",
      "Technician did not arrive",
      "Router not configured properly",
      "Need additional ethernet ports",
    ],
    Other: [
      "General inquiry",
      "Plan details needed",
      "Service area check",
      "Feedback about service",
      "Feature request",
    ],
  };

  const categorySubjects = subjects[category];
  return categorySubjects[Math.floor(Math.random() * categorySubjects.length)];
}

function generateTicketDescription(
  category: SupportTicket["category"],
  customer: BharatNetCustomer
): string {
  const descriptions: Record<SupportTicket["category"], string[]> = {
    "Slow Internet": [
      `Subscribed to ${customer.plan.speed} plan but getting only ${
        Math.floor(Math.random() * 50) + 20
      }Mbps. Please check.`,
      "Speed is very slow especially during evening hours. Unable to work from home properly.",
      "YouTube videos buffering constantly. Running speed test shows much lower speed than promised.",
      `Expected ${customer.plan.speed} but downloads are extremely slow. Please investigate.`,
    ],
    "No Connectivity": [
      "Internet stopped working suddenly. All router lights are off. Need immediate help.",
      "No connectivity since morning. Tried restarting router multiple times but not working.",
      "WiFi shows connected but no internet access. Very urgent as I work from home.",
      "Complete outage in our area since yesterday. When will service be restored?",
    ],
    "OTT Issues": [
      `${customer.plan.ottApps[0]} is not working. Shows error "Service unavailable". Please fix.`,
      "All OTT apps included in my plan are not loading. Is there a service issue?",
      "Cannot login to Disney+ Hotstar. Credentials not working even though it's in my plan.",
      "Netflix quality very poor. Constantly buffering even though internet speed is good.",
    ],
    "Billing Query": [
      `Received invoice for ₹${customer.plan.price + 200} but my plan is ₹${
        customer.plan.price
      }. Please clarify.`,
      "Made payment 3 days ago but still showing as pending in portal. Please update.",
      "Need detailed bill breakdown. Some charges are not clear to me.",
      `Outstanding shows ₹${customer.outstandingAmount} but I have paid already. Please check.`,
    ],
    "Router Problem": [
      "Router was working fine but now all lights are red. Need technical support.",
      "WiFi signal is very weak. Cannot connect from bedroom. Need stronger router or extender.",
      "Router keeps disconnecting every few hours. Have to restart it multiple times daily.",
      "Lost router admin password. Need help to reset and reconfigure.",
    ],
    Installation: [
      "Installation was scheduled for today but technician did not come. Please update.",
      "Installation done but only one ethernet port working. Need help with other ports.",
      "Technician did basic setup but WiFi not configured. Need assistance.",
      "Fiber cable installation pending for 3 days. When will it be completed?",
    ],
    Other: [
      "Want to know if your service is available in Sector 25. Please confirm.",
      `Happy with ${customer.plan.speed} plan. Want to refer to friend. What is referral benefit?`,
      "Need information about commercial plans for my office. Contact me please.",
      "Overall service is good. Just wanted to give positive feedback.",
    ],
  };

  const categoryDescriptions = descriptions[category];
  return categoryDescriptions[
    Math.floor(Math.random() * categoryDescriptions.length)
  ];
}

// ============================================================================
// EXPORT ALL GENERATORS
// ============================================================================

export const DataService = {
  getConnectionLeads: generateConnectionLeads,
  getPlanUpgrades: generatePlanUpgrades,
  getSupportTickets: generateSupportTickets,
};

// Generate and export cached data
export const connectionLeads = generateConnectionLeads(50);
export const planUpgrades = generatePlanUpgrades(40);
export const supportTickets = generateSupportTickets(60);

console.log("✅ Data Service Initialized:");
console.log(`   📡 ${connectionLeads.length} Connection Leads generated`);
console.log(`   ⚡ ${planUpgrades.length} Plan Upgrades generated`);
console.log(`   🎫 ${supportTickets.length} Support Tickets generated`);
