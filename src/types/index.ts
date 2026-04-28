export interface EmployerInfo {
  legalBusinessName: string;
  ein: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  entityType: EntityType;
  stateOfOrganization: string;
  stateOfMainOffice: string;
  stateOfGoverningLaw: string;
  fiscalYearEnd: string;
  hasAffiliatedEmployers: boolean;
}

export type EntityType =
  | "c_corp"
  | "s_corp"
  | "llc"
  | "llp"
  | "partnership"
  | "sole_proprietorship"
  | "non_profit"
  | "union"
  | "government"
  | "other";

export const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  c_corp: "C Corporation",
  s_corp: "S Corporation",
  llc: "Limited Liability Company",
  llp: "Limited Liability Partnership",
  partnership: "Partnership",
  sole_proprietorship: "Sole Proprietorship",
  non_profit: "Non-Profit Organization",
  union: "Union",
  government: "Government Agency",
  other: "Other",
};

export interface PlanInfo {
  planType: "pop" | "cafeteria";
  setupType: "new" | "renewal";
  effectiveDate: string;
  shortPlanYear: boolean;
  planYearStart: string;
  planYearEnd: string;
}

export interface PlanBenefits {
  groupMedical: boolean;
  groupDental: boolean;
  groupVision: boolean;
}

export interface ElectionOptions {
  employeeElections: "first_year_only" | "every_year" | "not_required";
  includeElectionForms: boolean;
  allowChangeBelow30Hours: boolean;
  allowChangeMarketplace: boolean;
  allowChangeDependentMarketplace: boolean;
  includeFmlaLanguage: boolean;
}

export interface ContactInfo {
  primaryContact: Contact;
  brokerContact?: Contact;
  generalAgentContact?: Contact;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
}

export interface FormData {
  employer: EmployerInfo;
  plan: PlanInfo;
  benefits: PlanBenefits;
  elections: ElectionOptions;
  contacts: ContactInfo;
  cafeteria?: CafeteriaConfig;
}

// =====================================================================
// CAFETERIA PLAN CONFIGURATION
// Models the JT2 / APA Benefits Adoption Agreement format
// =====================================================================

export interface CafeteriaConfig {
  identity: CafeteriaIdentity;
  features: PlanFeatures;
  simpleCafeteriaPlan: SimpleCafeteriaPlan;
  eligibility: CafeteriaEligibility;
  exclusions: ExcludedEmployees;
  leave: LeaveProvisions;
  participation: ParticipationElections;
  premiumConversion: PremiumConversionConfig;
  fsa: FSAConfig;
  hsa: HSAConfig;
  flexCredits: FlexCreditsConfig;
  pto: PTOConfig;
  misc: CafeteriaMisc;
}

// ---- A. General Information & Identity ----

export interface CafeteriaIdentity {
  planNumber: string;             // e.g. "501"
  planNameLine1: string;          // typically the company name
  planNameLine2: string;          // typically "Cafeteria Plan"
  isRestatement: boolean;
  restatementDate: string;        // YYYY-MM-DD
  planYearEndDate: string;        // MM/DD format, e.g. "12/31"
  shortPlanYear: boolean;
  shortPlanYearStart: string;
  shortPlanYearEnd: string;
  faxNumber: string;
  affiliatedServiceGroup: boolean;
  affiliatedServiceGroupMembers: string;
  controlledGroup: boolean;
  controlledGroupMembers: string;
}

// ---- A.5 Plan Features (the menu of 9) ----

export interface PlanFeatures {
  premiumConversion: boolean;
  healthFSA: boolean;
  limitedPurposeFSA: boolean;
  postDeductibleFSA: boolean;
  dcap: boolean;
  adoptionAssistanceFSA: boolean;
  hsa: boolean;
  flexCredits: boolean;
  ptoPurchaseSale: boolean;
}

// ---- A.6 Simple Cafeteria Plan ----

export interface SimpleCafeteriaPlan {
  enabled: boolean;
  contributionType: "compensation_pct" | "salary_match" | null;
  compensationPct: string;        // numeric string for "% of compensation"
  salaryMatchPct: string;         // numeric string for "% match"
}

// ---- B.1-3 Eligibility ----

export type ServiceRequirementType = "none" | "hours" | "days" | "months" | "years";
export type EligibilityDateRule =
  | "immediate"
  | "first_of_month"
  | "first_of_quarter"
  | "first_of_first_or_seventh_month"
  | "first_of_plan_year";

export interface CafeteriaEligibility {
  minAge: number;                                       // 18 or 21
  serviceRequirementType: ServiceRequirementType;
  serviceRequirementAmount: string;                     // numeric string
  eligibilityDateRule: EligibilityDateRule;
  eligibilityCoincidence: "coincident" | "following";
  eligibilityModifications: string;                     // free text, B.3
}

// ---- B.4-5 Excluded Employees ----

export interface ExcludedEmployees {
  excludeUnion: boolean;
  excludeLeased: boolean;
  excludeNonResidentAliens: boolean;
  excludePartTime: boolean;
  partTimeHoursThreshold: string;                       // numeric string, default "30"
  excludeOther: boolean;
  excludeOtherDescription: string;
  definitionModifications: string;                      // B.5
}

// ---- B.6-13 Leave & Termination & Reemployment ----

export type FMLAPaymentMethod = "pre_pay" | "on_schedule" | "repay";
export type TerminationParticipationDate =
  | "last_day_employment"
  | "last_day_payroll"
  | "last_day_month"
  | "last_day_plan_year"
  | "other";
export type ReemploymentBefore30Rule = "reinstate" | "wait_until_next_year";
export type ReemploymentAfter30Rule = "reinstate" | "wait_until_next_year" | "employee_choice";

export interface LeaveProvisions {
  fmlaRevokeAllowed: boolean;
  fmlaContinueAllowed: boolean;
  fmlaRecoverContributions: boolean;
  fmlaCoverageScope: "all_benefits" | "health_only";
  fmlaPaymentMethods: FMLAPaymentMethod[];
  nonFmlaContinuationAllowed: boolean;
  terminationParticipationDate: TerminationParticipationDate;
  terminationParticipationOther: string;
  reemploymentWithin30: ReemploymentBefore30Rule;
  reemploymentAfter30: ReemploymentAfter30Rule;
}

// ---- C. Participation Elections ----

export interface DefaultElections {
  premiumConversion: boolean;
  healthFSA: boolean;
  limitedPurposeFSA: boolean;
  dcap: boolean;
  hsa: boolean;
  adoptionAssistanceFSA: boolean;
}

export type ChangeInStatusEventsRule =
  | "none"
  | "treas_reg_125_4"
  | "admin_procedures"
  | "other";

export interface ParticipationElections {
  defaultElections: DefaultElections;
  changeInStatusEvents: ChangeInStatusEventsRule;
  changeInStatusOther: string;
  marketplaceFamilyEnrollment: boolean;                 // C.3a
}

// ---- D. Premium Conversion Account ----

export interface PremiumConversionConfig {
  contractTypes: {
    employerHealth: boolean;
    employerDental: boolean;
    employerVision: boolean;
    employerSTD: boolean;
    employerLTD: boolean;
    employerGroupTermLife: boolean;
    employerADD: boolean;
    individualDental: boolean;
    individualVision: boolean;
    individualDisability: boolean;
    cobra: boolean;
    other: boolean;
    otherDescription: string;
  };
  autoEnroll: boolean;
  autoAdjust: boolean;
}

// ---- E. Flexible Spending Accounts ----

export type ContributionFormulaType =
  | "none"
  | "discretionary"
  | "pct_of_contribution_pct"     // % of participant contrib up to % of comp
  | "pct_of_contribution_dollar"  // % of participant contrib up to $
  | "other";

export type NonElectiveFormulaType =
  | "none"
  | "discretionary"
  | "pct_of_compensation"         // % of comp
  | "dollar_per_employee"         // $ per eligible employee
  | "other";

export interface FSATypeConfig {
  matchingFormula: ContributionFormulaType;
  matchingPct: string;            // e.g. "50" for 50%
  matchingComplementPct: string;  // up to % of compensation
  matchingComplementDollar: string;
  matchingOther: string;
  nonElectiveFormula: NonElectiveFormulaType;
  nonElectivePct: string;
  nonElectiveDollar: string;
  nonElectiveOther: string;
}

export type ContributionLimitMode = "code_max" | "other_amount";
export type EligiblePersonsRule =
  | "participant_spouse_dep"
  | "covered_under_employer"
  | "participant_only"
  | "other";
export type AdultChildrenAgeRule = "until_26" | "until_end_of_year_26";
export type GracePeriodEnd = "fifteenth_third_month" | "other";
export type FSATerminationContinuation = "yes" | "yes_limited" | "no";
export type QualifiedReservistMode = "entire_amount" | "contributed_amount" | "other";

export interface FSAConfig {
  // Per-FSA contribution configurations
  healthFSA: FSATypeConfig;
  limitedPurposeFSA: FSATypeConfig;
  dcap: FSATypeConfig;
  adoptionAssistanceFSA: FSATypeConfig;

  // Contribution limits
  contributionLimitMode: ContributionLimitMode;
  healthFSALimit: string;
  limitedPurposeFSALimit: string;
  dcapLimit: string;
  adoptionAssistanceLimit: string;

  // Eligible persons
  eligiblePersons: EligiblePersonsRule;
  eligiblePersonsOther: string;

  // Expenses not eligible (text fields per FSA)
  expensesNotEligibleHealth: string;
  expensesNotEligibleLimited: string;
  expensesNotEligibleDcap: string;
  expensesNotEligibleAdoption: string;

  adultChildrenAge: AdultChildrenAgeRule;

  // Reimbursement availability
  amountsAvailableDcap: boolean;
  amountsAvailableAdoption: boolean;

  // Grace Period
  gracePeriodHealthFSA: boolean;
  gracePeriodLimitedFSA: boolean;
  gracePeriodDcap: boolean;
  gracePeriodAdoption: boolean;
  gracePeriodEnd: GracePeriodEnd;
  gracePeriodOther: string;

  // Run-out period
  runOutDays: string;             // e.g. "90" if no grace period
  runOutDate: string;             // alternative explicit date
  runOutAfterGraceDays: string;
  runOutAfterGraceDate: string;

  // Automatic claim payment
  automaticPaymentHealthFSA: boolean;
  automaticPaymentLimitedFSA: boolean;

  // Carryover (only Health FSA / Limited Purpose)
  carryoverHealthFSA: boolean;
  carryoverHealthFSAMode: "max_indexed" | "other";
  carryoverHealthFSAOther: string;
  carryoverLimitedFSA: boolean;
  carryoverLimitedFSAMode: "max_indexed" | "other";
  carryoverLimitedFSAOther: string;

  // Termination of employment behavior
  terminationContinuation: FSATerminationContinuation;
  terminationLimitations: string;
  terminationClaimsDays: string;          // default 30
  terminationClaimsAfterPlanYearDays: string;

  // Qualified Reservist Distributions
  qualifiedReservistEnabled: boolean;
  qualifiedReservistMode: QualifiedReservistMode;
  qualifiedReservistOther: string;
}

// ---- F. HSA ----

export interface HSAConfig {
  matchingFormula: ContributionFormulaType;
  matchingPct: string;
  matchingComplementPct: string;
  matchingComplementDollar: string;
  matchingOther: string;
  nonElectiveFormula: NonElectiveFormulaType;
  nonElectivePct: string;
  nonElectiveDollar: string;
  nonElectiveOther: string;
  contributionLimitMode: ContributionLimitMode;
  contributionLimitAmount: string;
}

// ---- G. Flex Credits ----

export type FlexCreditEligibleScope =
  | "all_benefits"
  | "all_except"
  | "only_following"
  | "premium_health_only";
export type FlexCreditAmountMode = "dollar" | "discretionary" | "other" | "simple_cafeteria_match";
export type CashOutAllowed = "yes" | "yes_limited" | "no";
export type MaxCashOutMode = "no_limit" | "per_year_amount" | "other";
export type CashOutPaymentMethod =
  | "payroll_installments"
  | "lump_sum_start"
  | "lump_sum_end"
  | "other";

export interface FlexCreditsConfig {
  healthFlexContribution: boolean;
  eligibleScope: FlexCreditEligibleScope;
  eligibleScopeExceptions: string;
  eligibleScopeOnly: string;
  amountMode: FlexCreditAmountMode;
  amountDollar: string;
  amountOther: string;
  contribTo401k: boolean;
  qualifiedPlanName: string;
  cashOutAllowed: CashOutAllowed;
  cashOutLimitations: string;
  cashOutDollarValue: string;
  maxCashOut: MaxCashOutMode;
  maxCashOutAmount: string;
  maxCashOutOther: string;
  cashOutPayment: CashOutPaymentMethod;
  cashOutPaymentOther: string;
}

// ---- H. PTO Purchase / Sale ----

export type PTOAmountType = "none" | "hours" | "days" | "weeks" | "other";

export interface PTOConfig {
  maxPurchaseType: PTOAmountType;
  maxPurchaseAmount: string;
  maxPurchaseOther: string;
  maxSaleType: PTOAmountType;
  maxSaleAmount: string;
  maxSaleOther: string;
  noCarryoverElectivePTO: boolean;
}

// ---- I. Misc ----

export type PlanAdminType = "sponsor" | "committee" | "other";
export type IndemnificationType = "none" | "standard" | "custom";

export interface CafeteriaMisc {
  planAdminType: PlanAdminType;
  planAdminOther: string;
  indemnificationType: IndemnificationType;
  // Governing law state and state of organization are reused from EmployerInfo
}

// ---- Default factory ----

export function emptyCafeteriaConfig(): CafeteriaConfig {
  return {
    identity: {
      planNumber: "501",
      planNameLine1: "",
      planNameLine2: "Cafeteria Plan",
      isRestatement: false,
      restatementDate: "",
      planYearEndDate: "12/31",
      shortPlanYear: false,
      shortPlanYearStart: "",
      shortPlanYearEnd: "",
      faxNumber: "",
      affiliatedServiceGroup: false,
      affiliatedServiceGroupMembers: "",
      controlledGroup: false,
      controlledGroupMembers: "",
    },
    features: {
      premiumConversion: true,
      healthFSA: true,
      limitedPurposeFSA: false,
      postDeductibleFSA: false,
      dcap: true,
      adoptionAssistanceFSA: false,
      hsa: false,
      flexCredits: false,
      ptoPurchaseSale: false,
    },
    simpleCafeteriaPlan: {
      enabled: false,
      contributionType: null,
      compensationPct: "",
      salaryMatchPct: "",
    },
    eligibility: {
      minAge: 18,
      serviceRequirementType: "days",
      serviceRequirementAmount: "30",
      eligibilityDateRule: "first_of_month",
      eligibilityCoincidence: "following",
      eligibilityModifications: "",
    },
    exclusions: {
      excludeUnion: true,
      excludeLeased: true,
      excludeNonResidentAliens: true,
      excludePartTime: true,
      partTimeHoursThreshold: "30",
      excludeOther: false,
      excludeOtherDescription: "",
      definitionModifications: "",
    },
    leave: {
      fmlaRevokeAllowed: true,
      fmlaContinueAllowed: true,
      fmlaRecoverContributions: true,
      fmlaCoverageScope: "health_only",
      fmlaPaymentMethods: ["pre_pay", "on_schedule"],
      nonFmlaContinuationAllowed: true,
      terminationParticipationDate: "last_day_month",
      terminationParticipationOther: "",
      reemploymentWithin30: "reinstate",
      reemploymentAfter30: "employee_choice",
    },
    participation: {
      defaultElections: {
        premiumConversion: true,
        healthFSA: false,
        limitedPurposeFSA: false,
        dcap: false,
        hsa: false,
        adoptionAssistanceFSA: false,
      },
      changeInStatusEvents: "treas_reg_125_4",
      changeInStatusOther: "",
      marketplaceFamilyEnrollment: true,
    },
    premiumConversion: {
      contractTypes: {
        employerHealth: true,
        employerDental: true,
        employerVision: true,
        employerSTD: false,
        employerLTD: false,
        employerGroupTermLife: false,
        employerADD: false,
        individualDental: false,
        individualVision: false,
        individualDisability: false,
        cobra: false,
        other: false,
        otherDescription: "",
      },
      autoEnroll: true,
      autoAdjust: true,
    },
    fsa: {
      healthFSA: emptyFSATypeConfig(),
      limitedPurposeFSA: emptyFSATypeConfig(),
      dcap: emptyFSATypeConfig(),
      adoptionAssistanceFSA: emptyFSATypeConfig(),
      contributionLimitMode: "other_amount",
      healthFSALimit: "3400",
      limitedPurposeFSALimit: "3400",
      dcapLimit: "7500",
      adoptionAssistanceLimit: "",
      eligiblePersons: "participant_spouse_dep",
      eligiblePersonsOther: "",
      expensesNotEligibleHealth: "",
      expensesNotEligibleLimited: "",
      expensesNotEligibleDcap: "",
      expensesNotEligibleAdoption: "",
      adultChildrenAge: "until_26",
      amountsAvailableDcap: false,
      amountsAvailableAdoption: false,
      gracePeriodHealthFSA: false,
      gracePeriodLimitedFSA: false,
      gracePeriodDcap: false,
      gracePeriodAdoption: false,
      gracePeriodEnd: "fifteenth_third_month",
      gracePeriodOther: "",
      runOutDays: "90",
      runOutDate: "",
      runOutAfterGraceDays: "",
      runOutAfterGraceDate: "",
      automaticPaymentHealthFSA: false,
      automaticPaymentLimitedFSA: false,
      carryoverHealthFSA: true,
      carryoverHealthFSAMode: "max_indexed",
      carryoverHealthFSAOther: "",
      carryoverLimitedFSA: true,
      carryoverLimitedFSAMode: "max_indexed",
      carryoverLimitedFSAOther: "",
      terminationContinuation: "no",
      terminationLimitations: "",
      terminationClaimsDays: "30",
      terminationClaimsAfterPlanYearDays: "",
      qualifiedReservistEnabled: true,
      qualifiedReservistMode: "contributed_amount",
      qualifiedReservistOther: "",
    },
    hsa: {
      matchingFormula: "none",
      matchingPct: "",
      matchingComplementPct: "",
      matchingComplementDollar: "",
      matchingOther: "",
      nonElectiveFormula: "none",
      nonElectivePct: "",
      nonElectiveDollar: "",
      nonElectiveOther: "",
      contributionLimitMode: "code_max",
      contributionLimitAmount: "",
    },
    flexCredits: {
      healthFlexContribution: false,
      eligibleScope: "all_benefits",
      eligibleScopeExceptions: "",
      eligibleScopeOnly: "",
      amountMode: "dollar",
      amountDollar: "",
      amountOther: "",
      contribTo401k: false,
      qualifiedPlanName: "",
      cashOutAllowed: "no",
      cashOutLimitations: "",
      cashOutDollarValue: "1.00",
      maxCashOut: "no_limit",
      maxCashOutAmount: "",
      maxCashOutOther: "",
      cashOutPayment: "payroll_installments",
      cashOutPaymentOther: "",
    },
    pto: {
      maxPurchaseType: "none",
      maxPurchaseAmount: "",
      maxPurchaseOther: "",
      maxSaleType: "none",
      maxSaleAmount: "",
      maxSaleOther: "",
      noCarryoverElectivePTO: false,
    },
    misc: {
      planAdminType: "sponsor",
      planAdminOther: "",
      indemnificationType: "standard",
    },
  };
}

function emptyFSATypeConfig(): FSATypeConfig {
  return {
    matchingFormula: "none",
    matchingPct: "",
    matchingComplementPct: "",
    matchingComplementDollar: "",
    matchingOther: "",
    nonElectiveFormula: "none",
    nonElectivePct: "",
    nonElectiveDollar: "",
    nonElectiveOther: "",
  };
}

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
] as const;
