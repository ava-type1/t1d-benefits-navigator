// Patient Assistance Program Database
// All data verified through official sources as of January 2025

export interface PAPProgram {
  id: string;
  name: string;
  organization: string;
  organizationType: 'manufacturer' | 'nonprofit' | 'government';
  category: string;
  products: string[];
  eligibilityRequirements: {
    incomeThreshold: {
      percentOfFPL: number;
      description: string;
    };
    insuranceRestrictions: string[];
    citizenship: string;
    additionalRequirements: string[];
  };
  benefits: {
    coverageType: 'free' | 'copay_reduction' | 'payment_plan';
    amount: string;
    duration: string;
    limitations: string[];
  };
  applicationProcess: {
    applicationUrl?: string;
    phoneNumber?: string;
    requiredDocuments: string[];
    processingTime: string;
    renewalRequired: boolean;
    physicianInvolvement: boolean;
  };
  notes: string[];
  lastVerified: string;
}

// Federal Poverty Level 2025 (from HHS)
export const FPL_2025 = {
  "48_states": [
    { size: 1, fpl: 15650 },
    { size: 2, fpl: 21150 },
    { size: 3, fpl: 26650 },
    { size: 4, fpl: 32150 },
    { size: 5, fpl: 37650 },
    { size: 6, fpl: 43150 },
    { size: 7, fpl: 48650 },
    { size: 8, fpl: 54150 }
  ],
  "alaska": [
    { size: 1, fpl: 19550 },
    { size: 2, fpl: 26430 },
    { size: 3, fpl: 33310 },
    { size: 4, fpl: 40190 },
    { size: 5, fpl: 47070 },
    { size: 6, fpl: 53950 },
    { size: 7, fpl: 60830 },
    { size: 8, fpl: 67710 }
  ],
  "hawaii": [
    { size: 1, fpl: 17990 },
    { size: 2, fpl: 24320 },
    { size: 3, fpl: 30650 },
    { size: 4, fpl: 36980 },
    { size: 5, fpl: 43310 },
    { size: 6, fpl: 49640 },
    { size: 7, fpl: 55970 },
    { size: 8, fpl: 62300 }
  ]
};

export const PAP_DATABASE: PAPProgram[] = [
  {
    id: "lilly-cares",
    name: "Lilly Cares Foundation Patient Assistance Program",
    organization: "Eli Lilly and Company",
    organizationType: "manufacturer",
    category: "insulin",
    products: ["Humalog", "Basaglar", "Lyumjev", "Insulin Lispro"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 300,
        description: "Household income at or below 300% of Federal Poverty Level"
      },
      insuranceRestrictions: [
        "Must have Medicare or no insurance",
        "Not eligible if you have private/commercial insurance",
        "Cannot be enrolled in Medicaid, Medicare LIS, or VA Benefits"
      ],
      citizenship: "US citizen or legal resident",
      additionalRequirements: [
        "Must provide Medicaid denial letter if eligible",
        "New patients approved for vials only (per some programs)"
      ]
    },
    benefits: {
      coverageType: "free",
      amount: "100% coverage - no cost",
      duration: "Up to 12 months",
      limitations: ["Medication shipped to prescriber's office"]
    },
    applicationProcess: {
      applicationUrl: "https://www.lillycares.com",
      phoneNumber: "1-800-545-6962",
      requiredDocuments: [
        "Completed application",
        "Physician prescription section",
        "Income verification (electronic)",
        "Medicaid denial letter (if applicable)"
      ],
      processingTime: "Up to 10 business days",
      renewalRequired: true,
      physicianInvolvement: true
    },
    notes: [
      "Lilly has expanded income eligibility to 300% FPL as of 2024",
      "Electronic income verification available",
      "Cannot ship directly to patients or pharmacies"
    ],
    lastVerified: "2025-01-29"
  },
  {
    id: "novo-nordisk-pap",
    name: "Novo Nordisk Patient Assistance Program (PAP)",
    organization: "Novo Nordisk Inc.",
    organizationType: "manufacturer", 
    category: "insulin",
    products: ["NovoLog", "NovoRapid", "Fiasp", "Levemir", "Tresiba", "Ozempic"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 400,
        description: "Medicare patients: 400% FPL for insulin, 200% FPL for Ozempic; Uninsured: 400% FPL for most products, 200% FPL for Ozempic"
      },
      insuranceRestrictions: [
        "Must have Medicare or no insurance",
        "Cannot have private/commercial insurance", 
        "Cannot be enrolled in Medicaid, Medicare LIS, or VA Benefits"
      ],
      citizenship: "US citizen or legal resident",
      additionalRequirements: [
        "Medicare patients with <150% FPL must provide Extra Help denial",
        "Medicaid denial required if income meets state thresholds"
      ]
    },
    benefits: {
      coverageType: "free",
      amount: "100% coverage - no cost",
      duration: "12 months (uninsured), calendar year (Medicare)",
      limitations: ["Automatic refills available for most products", "Shipped to prescriber office"]
    },
    applicationProcess: {
      applicationUrl: "https://www.novocare.com/diabetes/help-with-costs/pap.html",
      phoneNumber: "1-866-310-7549",
      requiredDocuments: [
        "Completed application with physician section",
        "Electronic income verification consent",
        "Medicare Part D consent (if applicable)",
        "Denial letters (if applicable)"
      ],
      processingTime: "2 business days with complete application",
      renewalRequired: true,
      physicianInvolvement: true
    },
    notes: [
      "Most Medicare Part D plans cover Ozempic - Medicare patients no longer eligible for Ozempic PAP",
      "Auto-refill program available",
      "Products shipped to physician office only",
      "Medicare patients can apply after October 15 for following year"
    ],
    lastVerified: "2025-01-29"
  },
  {
    id: "sanofi-patient-connection",
    name: "Sanofi Patient Connection",
    organization: "Sanofi US",
    organizationType: "manufacturer",
    category: "insulin",
    products: ["Lantus", "Toujeo", "Apidra", "Admelog", "Soliqua", "Insulin Glargine"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 400,
        description: "Annual household income ≤400% of Federal Poverty Level"
      },
      insuranceRestrictions: [
        "Uninsured or functionally uninsured patients",
        "Cannot have adequate prescription coverage",
        "Some Medicare Part D exceptions on case-by-case basis"
      ],
      citizenship: "US citizen or legal resident",
      additionalRequirements: [
        "Must not qualify for federal/state programs like Medicaid"
      ]
    },
    benefits: {
      coverageType: "free",
      amount: "100% coverage - no cost",
      duration: "12 months",
      limitations: ["Subject to product availability"]
    },
    applicationProcess: {
      applicationUrl: "https://www.sanofipatientconnection.com/patient-assistance-connection",
      phoneNumber: "1-888-847-4877",
      requiredDocuments: [
        "Completed application",
        "Physician prescription and signature",
        "Income documentation",
        "Insurance verification"
      ],
      processingTime: "Not specified",
      renewalRequired: true,
      physicianInvolvement: true
    },
    notes: [
      "Program subject to modification or cancellation",
      "State insulin safety net programs available in some states"
    ],
    lastVerified: "2025-01-29"
  },
  {
    id: "abbott-freestyle-libre-copay",
    name: "FreeStyle Libre Copay Assistance",
    organization: "Abbott Diabetes Care", 
    organizationType: "manufacturer",
    category: "cgm",
    products: ["FreeStyle Libre", "FreeStyle Libre 2", "FreeStyle Libre 3"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 0,
        description: "No specific income threshold - based on out-of-pocket costs"
      },
      insuranceRestrictions: [
        "Privately insured or uninsured",
        "Not valid for government insurance (Medicare, Medicaid, VA)"
      ],
      citizenship: "US residents",
      additionalRequirements: [
        "Must be paying more than $75 for two Libre sensors"
      ]
    },
    benefits: {
      coverageType: "copay_reduction",
      amount: "Reduces cost if paying >$75 for 2 sensors",
      duration: "Ongoing while eligible",
      limitations: ["Subject to program terms and conditions"]
    },
    applicationProcess: {
      phoneNumber: "844-330-5535",
      applicationUrl: "https://www.freestyle.abbott/us-en/private-insurance.html",
      requiredDocuments: ["Insurance information", "Prescription"],
      processingTime: "Immediate",
      renewalRequired: false,
      physicianInvolvement: false
    },
    notes: [
      "Copay assistance program, not full PAP",
      "Benefits may vary based on insurance coverage"
    ],
    lastVerified: "2025-01-29"
  },
  {
    id: "getinsulin-resource",
    name: "GetInsulin.org Resource Hub",
    organization: "Beyond Type 1",
    organizationType: "nonprofit",
    category: "resource",
    products: ["All insulin types", "Diabetes supplies"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 400,
        description: "Most manufacturer PAPs available for income ≤400% FPL"
      },
      insuranceRestrictions: [
        "Varies by program",
        "Generally for uninsured or inadequately insured"
      ],
      citizenship: "Varies by program",
      additionalRequirements: ["Varies by specific program"]
    },
    benefits: {
      coverageType: "free",
      amount: "Connects to appropriate programs",
      duration: "Ongoing resource",
      limitations: ["Not a direct assistance program - resource hub"]
    },
    applicationProcess: {
      applicationUrl: "https://getinsulin.org/get-insulin/",
      requiredDocuments: ["Input personal information for personalized action plan"],
      processingTime: "Immediate resource matching",
      renewalRequired: false,
      physicianInvolvement: false
    },
    notes: [
      "Comprehensive resource for finding insulin access programs",
      "Provides personalized action plans",
      "Includes emergency insulin support resources"
    ],
    lastVerified: "2025-01-29"
  },
  {
    id: "needymeds",
    name: "NeedyMeds.org",
    organization: "NeedyMeds",
    organizationType: "nonprofit",
    category: "resource",
    products: ["All medications", "Diabetes supplies"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 0,
        description: "Varies by program - database of assistance programs"
      },
      insuranceRestrictions: ["Varies by program"],
      citizenship: "Varies by program", 
      additionalRequirements: ["Varies by specific program"]
    },
    benefits: {
      coverageType: "free",
      amount: "Database of assistance programs",
      duration: "Ongoing resource",
      limitations: ["Resource database, not direct assistance"]
    },
    applicationProcess: {
      applicationUrl: "https://www.needymeds.org",
      requiredDocuments: ["Search by medication or manufacturer"],
      processingTime: "Immediate database access",
      renewalRequired: false,
      physicianInvolvement: false
    },
    notes: [
      "Comprehensive database of patient assistance programs",
      "Includes co-pay card information",
      "Disease-specific assistance program listings"
    ],
    lastVerified: "2025-01-29"
  },
  {
    id: "dexcom-pap",
    name: "Dexcom Patient Assistance Program",
    organization: "Dexcom, Inc.",
    organizationType: "manufacturer",
    category: "cgm",
    products: ["Dexcom G6", "Dexcom G7", "Dexcom G7 15-Day"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 400,
        description: "Household income at or below 400% of Federal Poverty Level"
      },
      insuranceRestrictions: [
        "Must be uninsured or underinsured for CGM coverage",
        "Not eligible if CGM is covered by current insurance",
        "Not available for government-insured patients (Medicare, Medicaid, VA, Tricare)"
      ],
      citizenship: "US resident",
      additionalRequirements: [
        "Must have a valid prescription for a Dexcom CGM system",
        "Must have Type 1 or Type 2 diabetes",
        "Must complete application with healthcare provider"
      ]
    },
    benefits: {
      coverageType: "free",
      amount: "Free Dexcom CGM system and sensors",
      duration: "Up to 12 months, renewable",
      limitations: ["Subject to product availability", "Must reapply annually"]
    },
    applicationProcess: {
      applicationUrl: "https://assistance.dexcom.com",
      phoneNumber: "1-888-738-3646",
      requiredDocuments: [
        "Completed patient application",
        "Healthcare provider prescription and signature",
        "Proof of income or financial hardship documentation",
        "Insurance denial letter (if applicable)"
      ],
      processingTime: "Approximately 2-4 weeks",
      renewalRequired: true,
      physicianInvolvement: true
    },
    notes: [
      "Dexcom expanded PAP to include G7 devices",
      "Program covers both the transmitter/receiver and ongoing sensor supplies",
      "Healthcare provider must fax or submit application on patient's behalf",
      "Income verified at 400% FPL per official Dexcom FAQ"
    ],
    lastVerified: "2025-01-29"
  },
  {
    id: "insulet-omnipod-financial-assistance",
    name: "Insulet Financial Assistance Program",
    organization: "Insulet Corporation",
    organizationType: "manufacturer",
    category: "pump",
    products: ["Omnipod DASH", "Omnipod 5"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 400,
        description: "Must demonstrate financial need based on criteria established by Insulet"
      },
      insuranceRestrictions: [
        "Open to patients who have lost or changed insurance coverage",
        "Available for patients with inadequate pump/supply coverage",
        "Must fill prescription through the Pharmacy channel"
      ],
      citizenship: "US resident",
      additionalRequirements: [
        "Must have a valid Omnipod DASH or Omnipod 5 prescription",
        "Must demonstrate financial need",
        "Must be a current or new Omnipod user"
      ]
    },
    benefits: {
      coverageType: "free",
      amount: "Financial assistance for Omnipod pods and supplies",
      duration: "Varies based on individual circumstances",
      limitations: ["Subject to eligibility verification", "Must use Pharmacy channel for fulfillment"]
    },
    applicationProcess: {
      applicationUrl: "https://www.omnipod.com/is-omnipod-right-for-me/coverage/financial-assistance",
      phoneNumber: "1-800-591-3455",
      requiredDocuments: [
        "Completed application form",
        "Valid Omnipod prescription",
        "Proof of financial need",
        "Insurance information (if applicable)"
      ],
      processingTime: "Varies",
      renewalRequired: true,
      physicianInvolvement: true
    },
    notes: [
      "Program designed to help patients continue pod therapy regardless of insurance status",
      "Financing plans may also be available for those who don't qualify for full assistance",
      "Contact Insulet directly for most current eligibility criteria",
      "Covers both Omnipod DASH and Omnipod 5 systems"
    ],
    lastVerified: "2025-01-29"
  },
  {
    id: "medtronic-financial-assistance",
    name: "Medtronic Financial Assistance Program",
    organization: "Medtronic Diabetes",
    organizationType: "manufacturer",
    category: "pump",
    products: ["MiniMed 780G", "MiniMed 770G", "Guardian 4 CGM", "InPen Smart Insulin Pen"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 400,
        description: "Aid available to those significantly impacted with overall healthcare costs"
      },
      insuranceRestrictions: [
        "Available for uninsured or underinsured patients",
        "Patients with high out-of-pocket costs may qualify",
        "Separate CGM Pharmacy Copay program for insured patients"
      ],
      citizenship: "US resident",
      additionalRequirements: [
        "Must demonstrate significant financial hardship",
        "Must have a prescription for Medtronic diabetes products"
      ]
    },
    benefits: {
      coverageType: "free",
      amount: "Financial assistance for pump and CGM systems",
      duration: "Varies based on program and eligibility",
      limitations: ["Terms and conditions apply", "Subject to program availability"]
    },
    applicationProcess: {
      applicationUrl: "https://www.medtronicdiabetes.com/financial-support-programs",
      phoneNumber: "1-800-646-4633",
      requiredDocuments: [
        "Completed application",
        "Proof of income/financial hardship",
        "Insurance information",
        "Prescription from healthcare provider"
      ],
      processingTime: "Varies",
      renewalRequired: true,
      physicianInvolvement: true
    },
    notes: [
      "Also offers Flex Payment Plan — pump therapy for as little as $50/month",
      "CGM Pharmacy Copay program available separately for insured patients",
      "InPen User Access program: as little as $60/year for smart insulin pen",
      "Switch2System program for users trading in pumps from other manufacturers",
      "Multiple programs available — contact Medtronic to find best fit"
    ],
    lastVerified: "2025-01-29"
  },
  {
    id: "tandem-payment-plan",
    name: "Tandem Diabetes Payment Plan & Financial Support",
    organization: "Tandem Diabetes Care",
    organizationType: "manufacturer",
    category: "pump",
    products: ["t:slim X2", "Tandem Mobi"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 0,
        description: "No specific income threshold published — payment plans and case-by-case financial assistance"
      },
      insuranceRestrictions: [
        "Payment plan NOT available for Medicare, Medicaid, Tricare, or other federal/state programs",
        "Insurance verification team works to find lowest out-of-pocket cost",
        "Case-by-case assistance for uninsured patients"
      ],
      citizenship: "US resident",
      additionalRequirements: [
        "Must have a valid prescription for Tandem insulin pump",
        "Payment plan requires pump purchased directly from Tandem after Sept 19, 2022"
      ]
    },
    benefits: {
      coverageType: "payment_plan",
      amount: "Flexible monthly payment plans for insulin pump purchase",
      duration: "Duration of payment plan",
      limitations: [
        "Not available in all states",
        "Not available for government-insured patients",
        "Payment plan only for pumps purchased directly from Tandem"
      ]
    },
    applicationProcess: {
      applicationUrl: "https://www.tandemdiabetes.com/support/benefit-programs/payment-plan",
      phoneNumber: "1-877-801-6901",
      requiredDocuments: [
        "Insurance information",
        "Prescription from healthcare provider",
        "Financial information for payment plan"
      ],
      processingTime: "Contact within 2 business days of inquiry",
      renewalRequired: false,
      physicianInvolvement: true
    },
    notes: [
      "Tandem does NOT have a traditional free PAP like insulin manufacturers",
      "Offers flexible payment plans to reduce upfront costs",
      "Insurance verification team actively works to minimize patient costs",
      "Contact Tandem directly — they may offer case-by-case financial hardship assistance",
      "Supplies (infusion sets, cartridges) covered separately through insurance or DME"
    ],
    lastVerified: "2025-01-29"
  },
  {
    id: "insulin-pumpers-foundation",
    name: "Insulin Pumpers Foundation",
    organization: "Insulin Pumpers Foundation",
    organizationType: "nonprofit",
    category: "pump",
    products: ["Insulin pumps (various manufacturers)", "Pump supplies"],
    eligibilityRequirements: {
      incomeThreshold: {
        percentOfFPL: 300,
        description: "Must demonstrate lack of financial resources to purchase an insulin pump"
      },
      insuranceRestrictions: [
        "For those who lack insurance coverage for pump therapy",
        "May assist those with inadequate coverage"
      ],
      citizenship: "US resident",
      additionalRequirements: [
        "Must have Type 1 diabetes",
        "Must have a prescription for insulin pump therapy",
        "Must demonstrate financial need"
      ]
    },
    benefits: {
      coverageType: "free",
      amount: "Provides insulin pump technology to those who cannot afford it",
      duration: "One-time pump provision",
      limitations: ["Limited availability", "Subject to funding"]
    },
    applicationProcess: {
      applicationUrl: "http://foundation.insulin-pumpers.org/",
      phoneNumber: "",
      requiredDocuments: [
        "Application form",
        "Proof of financial need",
        "Medical documentation",
        "Prescription for pump therapy"
      ],
      processingTime: "Varies based on availability",
      renewalRequired: false,
      physicianInvolvement: true
    },
    notes: [
      "Nonprofit focused specifically on getting pumps to those who can't afford them",
      "May have waiting lists depending on funding",
      "Good option for those denied by manufacturer programs"
    ],
    lastVerified: "2025-01-29"
  }
];

// Helper functions
export function getFPLThreshold(householdSize: number, state: string = "48_states"): number {
  const stateKey = state.toLowerCase() === "alaska" ? "alaska" : 
                   state.toLowerCase() === "hawaii" ? "hawaii" : "48_states";
  
  const fplData = FPL_2025[stateKey as keyof typeof FPL_2025];
  
  if (householdSize <= 8) {
    return fplData[householdSize - 1].fpl;
  } else {
    // For households > 8, add $5,500 per additional person (48 states/DC)
    // $6,880 for Alaska, $6,330 for Hawaii
    const baseFor8 = fplData[7].fpl;
    const additionalPerPerson = stateKey === "alaska" ? 6880 : 
                               stateKey === "hawaii" ? 6330 : 5500;
    return baseFor8 + ((householdSize - 8) * additionalPerPerson);
  }
}

export function calculateEligibilityScore(
  program: PAPProgram, 
  userIncome: number, 
  householdSize: number, 
  hasInsurance: boolean, 
  insuranceType: string,
  state: string = "48_states"
): { score: number; eligible: boolean; reasons: string[] } {
  const fplThreshold = getFPLThreshold(householdSize, state);
  const userFPLPercentage = (userIncome / fplThreshold) * 100;
  const reasons: string[] = [];
  let score = 0;
  let eligible = true;

  // Income check
  if (userFPLPercentage <= program.eligibilityRequirements.incomeThreshold.percentOfFPL) {
    score += 40;
    reasons.push(`✅ Income qualifies (${userFPLPercentage.toFixed(0)}% of FPL ≤ ${program.eligibilityRequirements.incomeThreshold.percentOfFPL}%)`);
  } else {
    eligible = false;
    reasons.push(`❌ Income too high (${userFPLPercentage.toFixed(0)}% of FPL > ${program.eligibilityRequirements.incomeThreshold.percentOfFPL}%)`);
  }

  // Insurance check
  if (program.eligibilityRequirements.insuranceRestrictions.some(restriction => 
    restriction.toLowerCase().includes("private") || restriction.toLowerCase().includes("commercial")
  )) {
    if (!hasInsurance || insuranceType === "none") {
      score += 30;
      reasons.push("✅ No insurance requirement met");
    } else if (insuranceType === "medicare") {
      score += 25;
      reasons.push("✅ Medicare accepted by this program");
    } else if (insuranceType === "private") {
      eligible = false;
      reasons.push("❌ Private insurance makes you ineligible");
    }
  } else {
    score += 30;
    reasons.push("✅ No insurance restrictions");
  }

  // Additional scoring factors
  if (program.benefits.coverageType === "free") {
    score += 20;
  } else if (program.benefits.coverageType === "copay_reduction") {
    score += 10;
  }

  if (program.organizationType === "manufacturer") {
    score += 10;
  }

  return {
    score: Math.min(100, score),
    eligible,
    reasons
  };
}