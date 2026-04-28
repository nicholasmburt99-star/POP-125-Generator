"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PlanFeatures, SimpleCafeteriaPlan } from "@/types";

interface Props {
  features: PlanFeatures;
  simpleCafeteriaPlan: SimpleCafeteriaPlan;
  onFeaturesChange: (data: PlanFeatures) => void;
  onSimpleChange: (data: SimpleCafeteriaPlan) => void;
  onNext: () => void;
  onBack: () => void;
}

const FEATURE_LIST: { key: keyof PlanFeatures; label: string; description?: string }[] = [
  { key: "premiumConversion", label: "Premium Conversion Account", description: "Pay insurance premiums pre-tax" },
  { key: "healthFSA", label: "Health Flexible Spending Account" },
  { key: "limitedPurposeFSA", label: "Limited Purpose HSA-Compatible Health FSA" },
  { key: "postDeductibleFSA", label: "Post-Deductible HSA-Compatible Health FSA" },
  { key: "dcap", label: "Dependent Care Assistance Plan Account (DCAP)" },
  { key: "adoptionAssistanceFSA", label: "Adoption Assistance Flexible Spending Account" },
  { key: "hsa", label: "Health Savings Account (HSA)" },
  { key: "flexCredits", label: "Flexible Benefit Credits" },
  { key: "ptoPurchaseSale", label: "PTO Purchase / Sale" },
];

export function StepCafePlanFeatures({
  features, simpleCafeteriaPlan,
  onFeaturesChange, onSimpleChange,
  onNext, onBack,
}: Props) {
  function toggle(key: keyof PlanFeatures) {
    onFeaturesChange({ ...features, [key]: !features[key] });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  const anySelected = Object.values(features).some(Boolean);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Plan Features</h2>
      <p className="text-sm text-gray-500 mb-4">
        Select all benefits that will be included in this Cafeteria Plan. The
        wizard adjusts to ask configuration questions for each enabled benefit.
      </p>

      <div className="space-y-2">
        {FEATURE_LIST.map((f) => (
          <div key={f.key} className="flex items-start space-x-3 rounded-lg border p-3">
            <Checkbox
              id={f.key}
              checked={features[f.key]}
              onCheckedChange={() => toggle(f.key)}
            />
            <div className="flex-1">
              <Label htmlFor={f.key} className="text-base font-normal">{f.label}</Label>
              {f.description && (
                <p className="text-xs text-gray-500">{f.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {!anySelected && (
        <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-700">
          Please select at least one benefit.
        </div>
      )}

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="simpleCaf"
            checked={simpleCafeteriaPlan.enabled}
            onCheckedChange={(v) => onSimpleChange({ ...simpleCafeteriaPlan, enabled: !!v })}
          />
          <Label htmlFor="simpleCaf" className="font-normal">
            This is a Simple Cafeteria Plan under Code section 125(j)
          </Label>
        </div>
        {simpleCafeteriaPlan.enabled && (
          <div className="space-y-3 pl-6">
            <RadioGroup
              value={simpleCafeteriaPlan.contributionType || ""}
              onValueChange={(v) => onSimpleChange({ ...simpleCafeteriaPlan, contributionType: v as "compensation_pct" | "salary_match" })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compensation_pct" id="sc-comp" />
                <Label htmlFor="sc-comp" className="font-normal">% of Compensation (no less than 2%)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="salary_match" id="sc-match" />
                <Label htmlFor="sc-match" className="font-normal">% match of salary reduction (at least 200%, no less than 6% of compensation)</Label>
              </div>
            </RadioGroup>
            {simpleCafeteriaPlan.contributionType === "compensation_pct" && (
              <div className="space-y-1">
                <Label>Percentage</Label>
                <Input
                  value={simpleCafeteriaPlan.compensationPct}
                  onChange={(e) => onSimpleChange({ ...simpleCafeteriaPlan, compensationPct: e.target.value })}
                  placeholder="2"
                />
              </div>
            )}
            {simpleCafeteriaPlan.contributionType === "salary_match" && (
              <div className="space-y-1">
                <Label>Match Percentage</Label>
                <Input
                  value={simpleCafeteriaPlan.salaryMatchPct}
                  onChange={(e) => onSimpleChange({ ...simpleCafeteriaPlan, salaryMatchPct: e.target.value })}
                  placeholder="200"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit" disabled={!anySelected}>Next</Button>
      </div>
    </form>
  );
}
