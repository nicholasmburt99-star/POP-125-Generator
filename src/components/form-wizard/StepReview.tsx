"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { FormData } from "@/types";
import { ENTITY_TYPE_LABELS } from "@/types";
import { US_STATES } from "@/types";
import { Loader2, Pencil } from "lucide-react";

interface Props {
  formData: FormData;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  onGenerate: () => void;
  generating: boolean;
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
}: Props) {
  const { employer, plan, benefits, elections, contacts } = formData;

  const benefitList = [
    benefits.groupMedical && "Group Medical",
    benefits.groupDental && "Group Dental",
    benefits.groupVision && "Group Vision",
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

      <Section title="Elections & Options" step={3} onEdit={onGoToStep}>
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
          label="Election Forms"
          value={elections.includeElectionForms ? "Yes" : "No"}
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

      <Section title="Contacts" step={4} onEdit={onGoToStep}>
        <Row
          label="Primary Contact"
          value={`${contacts.primaryContact.name} (${contacts.primaryContact.email})`}
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
