"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { FormData } from "@/types";
import { ENTITY_TYPE_LABELS, COVERAGE_TYPE_LABELS } from "@/types";
import { US_STATES } from "@/types";
import { AlertTriangle, Loader2, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";

interface DuplicateMatch {
  id: string;
  employerName: string;
  createdAt: string;
  planType: string;
}

interface Props {
  formData: FormData;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  onGenerate: () => void;
  generating: boolean;
  duplicateMatch?: DuplicateMatch;
}

function stateName(code: string) {
  return US_STATES.find((s) => s.value === code)?.label || code;
}

function Section({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-blue-600"
          onClick={() => onEdit(step)}
        >
          <Pencil className="h-3 w-3" />
          Edit
        </Button>
      </div>
      <div className="text-sm text-gray-600 space-y-1">{children}</div>
      <Separator className="mt-4" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex">
      <span className="w-48 text-gray-500">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

export function StepReview({
  formData,
  onBack,
  onGoToStep,
  onGenerate,
  generating,
  duplicateMatch,
}: Props) {
  const { employer, plan, benefits, elections, contacts, hipaa, insurancePolicies } = formData;
  const isPop = plan.planType === "pop";
  // POP step order: Employer(0) Plan(1) Benefits(2) Policies(3) HIPAA(4) Elections(5) Contacts(6) Review(7)
  const policiesStep = isPop ? 3 : 3; // cafeteria has policies near the end too; index varies — keep at 3 as best effort
  const hipaaStep = 4;
  const electionsStep = isPop ? 5 : 3;
  const contactsStep = isPop ? 6 : 4;

  const benefitList = [
    benefits.groupMedical && "Group Medical",
    benefits.groupDental && "Group Dental",
    benefits.groupVision && "Group Vision",
    benefits.groupTermLife && "Group Term Life (up to $50K pre-tax)",
    benefits.hsa && "HSA (pre-tax HDHP-paired)",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Review & Generate</h2>
      <p className="text-sm text-gray-500">
        Review all information before generating documents.
      </p>

      <Section title="Employer Information" step={0} onEdit={onGoToStep}>
        <Row label="Business Name" value={employer.legalBusinessName} />
        <Row label="EIN" value={employer.ein} />
        <Row
          label="Address"
          value={`${employer.streetAddress}, ${employer.city}, ${employer.state} ${employer.zipCode}`}
        />
        <Row label="Phone" value={employer.phone} />
        <Row
          label="Entity Type"
          value={ENTITY_TYPE_LABELS[employer.entityType]}
        />
        <Row
          label="State of Organization"
          value={stateName(employer.stateOfOrganization)}
        />
        <Row
          label="State of Governing Law"
          value={stateName(employer.stateOfGoverningLaw)}
        />
        <Row label="Fiscal Year End" value={employer.fiscalYearEnd} />
        <Row
          label="Affiliated Employers"
          value={employer.hasAffiliatedEmployers ? "Yes" : "No"}
        />
        <Row
          label="Number of Employees"
          value={employer.numberOfEmployees || "Not provided"}
        />
      </Section>

      <Section title="Plan Information" step={1} onEdit={onGoToStep}>
        <Row
          label="Plan Type"
          value={plan.planType === "pop" ? "Premium Only Plan (POP)" : "Cafeteria Plan"}
        />
        <Row
          label="Setup Type"
          value={plan.setupType === "new" ? "New Plan" : "Renewal"}
        />
        <Row label="Effective Date" value={plan.effectiveDate} />
        <Row label="Plan Year" value={`${plan.planYearStart} to ${plan.planYearEnd}`} />
        <Row label="Short Plan Year" value={plan.shortPlanYear ? "Yes" : "No"} />
      </Section>

      <Section title="Plan Benefits" step={2} onEdit={onGoToStep}>
        <Row label="Benefits" value={benefitList} />
      </Section>

      {isPop && (
        <Section title="HIPAA Privacy and Security Officer" step={hipaaStep} onEdit={onGoToStep}>
          <Row
            label="Privacy Officer"
            value={
              hipaa.privacyOfficerName
                ? `${hipaa.privacyOfficerName}${hipaa.privacyOfficerTitle ? ` (${hipaa.privacyOfficerTitle})` : ""}`
                : "Not provided"
            }
          />
          <Row label="Plan handles ePHI" value={hipaa.handlesEphi ? "Yes" : "No"} />
          {hipaa.handlesEphi && (
            <Row
              label="Security Officer"
              value={
                hipaa.securityOfficerName
                  ? `${hipaa.securityOfficerName}${hipaa.securityOfficerTitle ? ` (${hipaa.securityOfficerTitle})` : ""}`
                  : "Not provided"
              }
            />
          )}
        </Section>
      )}

      <Section title="Elections & Options" step={electionsStep} onEdit={onGoToStep}>
        <Row
          label="Employee Elections"
          value={
            elections.employeeElections === "first_year_only"
              ? "Required First Year Only"
              : elections.employeeElections === "every_year"
              ? "Required Every Year"
              : "Not Required"
          }
        />
        <Row
          label="Below 30 Hours Change"
          value={elections.allowChangeBelow30Hours ? "Yes" : "No"}
        />
        <Row
          label="Marketplace Enrollment"
          value={elections.allowChangeMarketplace ? "Yes" : "No"}
        />
        <Row
          label="FMLA Language"
          value={elections.includeFmlaLanguage ? "Yes" : "No"}
        />
      </Section>

      <Section title="In-Force Insurance Policies" step={policiesStep} onEdit={onGoToStep}>
        {insurancePolicies.length === 0 ? (
          <Row label="Policies" value="None entered" />
        ) : (
          insurancePolicies.map((p) => (
            <Row
              key={p.id}
              label={
                p.coverageType === "other" && p.coverageTypeOther
                  ? p.coverageTypeOther
                  : COVERAGE_TYPE_LABELS[p.coverageType]
              }
              value={`${p.carrierName || "—"}${p.policyNumber ? ` (Policy #${p.policyNumber})` : ""}${p.effectiveDate ? `, effective ${p.effectiveDate}` : ""}`}
            />
          ))
        )}
      </Section>

      <Section title="Contacts" step={contactsStep} onEdit={onGoToStep}>
        <Row
          label="Primary Contact"
          value={`${contacts.primaryContact.name}${contacts.primaryContact.title ? `, ${contacts.primaryContact.title}` : ""} (${contacts.primaryContact.email})`}
        />
        {contacts.brokerContact && (
          <Row
            label="Broker"
            value={`${contacts.brokerContact.name} (${contacts.brokerContact.email})`}
          />
        )}
        {contacts.generalAgentContact && (
          <Row
            label="General Agent"
            value={`${contacts.generalAgentContact.name} (${contacts.generalAgentContact.email})`}
          />
        )}
      </Section>

      {duplicateMatch && (
        <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-900">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p>
                <strong>A document set already exists for &ldquo;{duplicateMatch.employerName}&rdquo;</strong>{" "}
                (created {format(parseISO(duplicateMatch.createdAt), "MMM d, yyyy")}, plan type{" "}
                <em>{duplicateMatch.planType === "cafeteria" ? "Cafeteria" : "POP"}</em>).
              </p>
              <p>
                Only one Section 125 plan document can be operative at a time. If you meant to
                update the existing entry, open it and use <em>Edit &amp; Regenerate</em>. If
                you really want to create a second document set for this employer, click
                Generate Documents below.
              </p>
              <Link
                href={`/dashboard/generate/${duplicateMatch.id}`}
                className="inline-block text-blue-600 hover:underline font-medium"
              >
                Open existing entry &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onGenerate} disabled={generating} className="gap-2">
          {generating && <Loader2 className="h-4 w-4 animate-spin" />}
          {generating ? "Generating..." : formData === undefined ? "Generate Documents" : "Generate Documents"}
        </Button>
      </div>
    </div>
  );
}
