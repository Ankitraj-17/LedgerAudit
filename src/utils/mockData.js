// HIGH-FIDELITY FINANCIAL LEDGER MOCK DATA

export const initialTransactions = [
  {
    id: "TXN-8472-A",
    date: "2026-06-01T10:30:00Z",
    description: "Office Renovation Wire - Phase 1",
    amount: 12500,
    budgeted: 12000,
    category: "Operations",
    status: "Approved",
    approvedBy: "James Patel",
    routingPath: ["Chase Bank (US)", "Wells Fargo (US)", "BuildCorp Escrow (US)"],
    errorCode: "NONE",
    verified: true
  },
  {
    id: "TXN-9122-B",
    date: "2026-06-02T14:15:00Z",
    description: "Global Q2 Ad Campaign Funding",
    amount: 45000,
    budgeted: 40000,
    category: "Marketing",
    status: "Approved",
    approvedBy: "James Patel",
    routingPath: ["Barclays (UK)", "HSBC Hong Kong (HK)", "AdMedia Agency (HK)"],
    errorCode: "NONE",
    verified: true
  },
  {
    id: "TXN-3304-C",
    date: "2026-06-03T09:00:00Z",
    description: "Offshore Strategic Consulting Fee",
    amount: 500000,
    budgeted: 100000,
    category: "Legal",
    status: "Flagged",
    approvedBy: "Unassigned",
    routingPath: ["Chase Bank (US)", "Cayman Islands Trust (KY)", "Zurich Safe Harbor (CH)"],
    errorCode: "TXN-SEC-ERR", // Code Checker will check this
    verified: false
  },
  {
    id: "TXN-4890-D",
    date: "2026-06-04T17:45:00Z",
    description: "Executive Corporate Retreat Lodging",
    amount: 18200,
    budgeted: 1200,
    category: "Travel",
    status: "Flagged",
    approvedBy: "Unassigned",
    routingPath: ["CitiBank (US)", "Deutsche Bank (DE)", "Alpine Lux Chalet (FR)"],
    errorCode: "TXN-LIMIT-ERR",
    verified: false
  },
  {
    id: "TXN-5511-E",
    date: "2026-06-05T11:10:00Z",
    description: "Duplicate Hardware Supplier Reimbursement",
    amount: 8400,
    budgeted: 8400,
    category: "Operations",
    status: "Flagged",
    approvedBy: "Unassigned",
    routingPath: ["CitiBank (US)", "Wells Fargo (US)", "Apex Tech Supply (US)"],
    errorCode: "TXN-DUPL-ERR",
    verified: false
  },
  {
    id: "TXN-6619-F",
    date: "2026-06-06T15:20:00Z",
    description: "External Legal Counsel Retainer",
    amount: 32000,
    budgeted: 30000,
    category: "Legal",
    status: "Approved",
    approvedBy: "Sarah Jenkins",
    routingPath: ["Wells Fargo (US)", "Sullivan & Cromwell Escrow (US)"],
    errorCode: "NONE",
    verified: true
  },
  {
    id: "TXN-7233-G",
    date: "2026-06-07T12:05:00Z",
    description: "Annual Enterprise SaaS Licenses",
    amount: 14200,
    budgeted: 15000,
    category: "Operations",
    status: "Approved",
    approvedBy: "Marcus Vance",
    routingPath: ["Barclays (UK)", "Salesforce Ltd (US)"],
    errorCode: "NONE",
    verified: true
  },
  {
    id: "TXN-8812-H",
    date: "2026-06-08T08:30:00Z",
    description: "Acquisition Advisory - Shell Corp Co",
    amount: 95000,
    budgeted: 25000,
    category: "Marketing",
    status: "Flagged",
    approvedBy: "Unassigned",
    routingPath: ["CitiBank (US)", "Cyprus Commercial (CY)", "Panama Holdings (PA)"],
    errorCode: "TXN-SHELL-ERR",
    verified: false
  },
  {
    id: "TXN-9014-I",
    date: "2026-06-08T16:40:00Z",
    description: "Server Rack Equipment Purchases",
    amount: 120000,
    budgeted: 125000,
    category: "Operations",
    status: "Approved",
    approvedBy: "James Patel",
    routingPath: ["Deutsche Bank (DE)", "Commerzbank (DE)", "SuperMicro Inc (US)"],
    errorCode: "NONE",
    verified: true
  },
  {
    id: "TXN-1011-J",
    date: "2026-06-09T10:00:00Z",
    description: "Executive Performance Bonus Scheme",
    amount: 80000,
    budgeted: 5000,
    category: "Operations",
    status: "Flagged",
    approvedBy: "Unassigned",
    routingPath: ["Deutsche Bank (DE)", "Vaduz Private Bank (LI)"],
    errorCode: "TXN-EXEC-ERR",
    verified: false
  },
  {
    id: "TXN-2210-K",
    date: "2026-06-09T14:30:00Z",
    description: "Headquarters Real Estate Lease",
    amount: 22000,
    budgeted: 22000,
    category: "Operations",
    status: "Approved",
    approvedBy: "Marcus Vance",
    routingPath: ["CitiBank (US)", "Vanguard Properties (US)"],
    errorCode: "NONE",
    verified: true
  },
  {
    id: "TXN-1100-L",
    date: "2026-06-10T11:00:00Z",
    description: "Internal Liquidity Optimization Transfer",
    amount: 50000,
    budgeted: 50000,
    category: "Operations",
    status: "Approved",
    approvedBy: "James Patel",
    routingPath: ["Chase Bank (US)", "CitiBank (US)"],
    errorCode: "NONE",
    verified: true
  }
];

export const initialSpecialists = [
  {
    id: "SPEC-1",
    name: "Sarah Jenkins",
    specialty: "Legal & Compliance",
    load: 1,
    status: "Available",
    assignedFiles: ["TXN-6619-F"]
  },
  {
    id: "SPEC-2",
    name: "Marcus Vance",
    specialty: "Operations & SaaS",
    load: 2,
    status: "Available",
    assignedFiles: ["TXN-7233-G", "TXN-2210-K"]
  },
  {
    id: "SPEC-3",
    name: "Elena Rostova",
    specialty: "Capital Transfers & Wire Audits",
    load: 0,
    status: "Available",
    assignedFiles: []
  },
  {
    id: "SPEC-4",
    name: "James Patel",
    specialty: "High Risk Travel & Perks",
    load: 4,
    status: "Busy",
    assignedFiles: ["TXN-8472-A", "TXN-9122-B", "TXN-9014-I", "TXN-1100-L"]
  }
];

// Valid Transaction Code Check Catalog (for Transaction Code Checker)
export const officialCodeDirectory = {
  "TXN-8472-A": { status: "VALID", verifiedAmount: 12500, description: "Office Renovation Wire - Phase 1" },
  "TXN-9122-B": { status: "VALID", verifiedAmount: 45000, description: "Global Q2 Ad Campaign Funding" },
  "TXN-3304-C": { status: "MISMATCH", verifiedAmount: 100000, description: "Offshore Strategic Consulting Fee (Audited expected: $100k, recorded: $500k)" },
  "TXN-4890-D": { status: "MISMATCH", verifiedAmount: 1200, description: "Executive Corporate Retreat Lodging (Recorded: $18.2k, authorized: $1.2k)" },
  "TXN-5511-E": { status: "SUSPICIOUS", verifiedAmount: 0, description: "Double Invoice detected under Apex Tech Supply (Duplicate reference detected)" },
  "TXN-6619-F": { status: "VALID", verifiedAmount: 32000, description: "External Legal Counsel Retainer" },
  "TXN-7233-G": { status: "VALID", verifiedAmount: 14200, description: "Annual Enterprise SaaS Licenses" },
  "TXN-8812-H": { status: "SUSPICIOUS", verifiedAmount: 0, description: "Acquisition Advisory - Shell Corp Co (Offshore entity check required)" },
  "TXN-9014-I": { status: "VALID", verifiedAmount: 120000, description: "Server Rack Equipment Purchases" },
  "TXN-1011-J": { status: "MISMATCH", verifiedAmount: 5000, description: "Executive Performance Bonus Scheme (Recorded: $80k, authorized: $5k)" },
  "TXN-2210-K": { status: "VALID", verifiedAmount: 22000, description: "Headquarters Real Estate Lease" },
  "TXN-1100-L": { status: "VALID", verifiedAmount: 50000, description: "Internal Liquidity Optimization Transfer" }
};
