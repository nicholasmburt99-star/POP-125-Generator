import { z } from "zod";

export const employerSchema = z.object({
  legalBusinessName: z.string().min(1, "Business name is required"),
  ein: z
    .string()
    .regex(/^\d{2}-?\d{7}$/, "EIN must be in XX-XXXXXXX format"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  phone: z.string().min(10, "Phone number is required"),
  entityType: z.enum([
    "c_corp",
    "s_corp",
    "llc",
    "partnership",
    "sole_proprietorship",
    "non_profit",
  ]),
  stateOfOrganization: z.string().min(2, "State of organization is required"),
  stateOfMainOffice: z.string().min(2, "State of main office is required"),
  stateOfGoverningLaw: z.string().min(2, "State of governing law is required"),
  fiscalYearEnd: z.string().min(1, "Fiscal year end is required"),
  hasAffiliatedEmployers: z.boolean(),
});

export const planSchema = z.object({
  planType: z.enum(["pop", "cafeteria"]),
  setupType: z.enum(["new", "renewal"]),
  effectiveDate: z.string().min(1, "Effective date is required"),
  shortPlanYear: z.boolean(),
  planYearStart: z.string().min(1, "Plan year start is required"),
  planYearEnd: z.string().min(1, "Plan year end is required"),
});

export const benefitsSchema = z
  .object({
    groupMedical: z.boolean(),
    groupDental: z.boolean(),
    groupVision: z.boolean(),
  })
  .refine((data) => data.groupMedical || data.groupDental || data.groupVision, {
    message: "At least one benefit must be selected",
  });

export const electionsSchema = z.object({
  employeeElections: z.enum([
    "first_year_only",
    "every_year",
    "not_required",
  ]),
  includeElectionForms: z.boolean(),
  allowChangeBelow30Hours: z.boolean(),
  allowChangeMarketplace: z.boolean(),
  allowChangeDependentMarketplace: z.boolean(),
  includeFmlaLanguage: z.boolean(),
});

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
});

export const contactsSchema = z.object({
  primaryContact: contactSchema,
  brokerContact: contactSchema.optional(),
  generalAgentContact: contactSchema.optional(),
});

export const fullFormSchema = z.object({
  employer: employerSchema,
  plan: planSchema,
  benefits: benefitsSchema,
  elections: electionsSchema,
  contacts: contactsSchema,
});
