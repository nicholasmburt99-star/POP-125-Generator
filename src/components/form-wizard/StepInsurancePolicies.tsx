"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { CoverageType, InsurancePolicy } from "@/types";
import { COVERAGE_TYPE_LABELS } from "@/types";

interface Props {
  data: InsurancePolicy[];
  onChange: (data: InsurancePolicy[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const COVERAGE_OPTIONS: CoverageType[] = [
  "medical",
  "dental",
  "vision",
  "life",
  "std",
  "ltd",
  "ad_d",
  "other",
];

function newPolicy(): InsurancePolicy {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2),
    carrierName: "",
    policyNumber: "",
    coverageType: "medical",
    coverageTypeOther: "",
    effectiveDate: "",
  };
}

export function StepInsurancePolicies({ data, onChange, onNext, onBack }: Props) {
  function updatePolicy(id: string, patch: Partial<InsurancePolicy>) {
    onChange(data.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removePolicy(id: string) {
    onChange(data.filter((p) => p.id !== id));
  }

  function addPolicy() {
    onChange([...data, newPolicy()]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">In-Force Insurance Policies</h2>
      <p className="text-sm text-gray-500">
        List every employer-sponsored welfare benefit plan that participants pay for, in whole or
        in part, through pre-tax salary redirections under this Plan. The list is rendered as
        <em> Exhibit B — Underlying ERISA Welfare Benefit Plans</em> at the end of the Plan
        Document and as a summary in the Summary Plan Description. You can leave this empty
        and fill it in later, but the document will include a placeholder note in that case.
      </p>

      <div className="space-y-3">
        {data.length === 0 && (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-gray-500">
            No policies added yet. Click <strong>+ Add Policy</strong> below to begin.
          </div>
        )}

        {data.map((policy, idx) => (
          <div key={policy.id} className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Policy #{idx + 1}</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-600 gap-1"
                onClick={() => removePolicy(policy.id)}
              >
                <Trash2 className="h-3 w-3" /> Remove
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`coverage-${policy.id}`}>Coverage Type</Label>
                <select
                  id={`coverage-${policy.id}`}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={policy.coverageType}
                  onChange={(e) =>
                    updatePolicy(policy.id, { coverageType: e.target.value as CoverageType })
                  }
                >
                  {COVERAGE_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {COVERAGE_TYPE_LABELS[c]}
                    </option>
                  ))}
                </select>
              </div>
              {policy.coverageType === "other" && (
                <div className="space-y-1">
                  <Label htmlFor={`coverageOther-${policy.id}`}>Other Coverage Type</Label>
                  <Input
                    id={`coverageOther-${policy.id}`}
                    value={policy.coverageTypeOther}
                    onChange={(e) =>
                      updatePolicy(policy.id, { coverageTypeOther: e.target.value })
                    }
                    placeholder="e.g., Critical Illness"
                  />
                </div>
              )}
              <div className="space-y-1">
                <Label htmlFor={`carrier-${policy.id}`}>Carrier Name</Label>
                <Input
                  id={`carrier-${policy.id}`}
                  value={policy.carrierName}
                  onChange={(e) => updatePolicy(policy.id, { carrierName: e.target.value })}
                  placeholder="Anthem Blue Cross"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`policyNumber-${policy.id}`}>Policy Number</Label>
                <Input
                  id={`policyNumber-${policy.id}`}
                  value={policy.policyNumber}
                  onChange={(e) => updatePolicy(policy.id, { policyNumber: e.target.value })}
                  placeholder="PO-12345"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`effective-${policy.id}`}>Effective Date</Label>
                <Input
                  id={`effective-${policy.id}`}
                  type="date"
                  value={policy.effectiveDate}
                  onChange={(e) => updatePolicy(policy.id, { effectiveDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addPolicy} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Policy
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
