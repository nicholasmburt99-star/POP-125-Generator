"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { HSAConfig, ContributionFormulaType, NonElectiveFormulaType, ContributionLimitMode } from "@/types";

interface Props {
  data: HSAConfig;
  onChange: (data: HSAConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCafeHSAConfig({ data, onChange, onNext, onBack }: Props) {
  function update<K extends keyof HSAConfig>(field: K, value: HSAConfig[K]) {
    onChange({ ...data, [field]: value });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold mb-2">Health Savings Account (HSA)</h2>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Employer Matching Contributions</h3>
        <RadioGroup value={data.matchingFormula} onValueChange={(v) => update("matchingFormula", v as ContributionFormulaType)}>
          <div className="flex items-center space-x-2"><RadioGroupItem value="none" id="hsam-none" /><Label htmlFor="hsam-none" className="font-normal">None</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="discretionary" id="hsam-disc" /><Label htmlFor="hsam-disc" className="font-normal">Discretionary</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="pct_of_contribution_pct" id="hsam-pct" /><Label htmlFor="hsam-pct" className="font-normal">% of Participant&apos;s HSA contribution up to % of Compensation</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="pct_of_contribution_dollar" id="hsam-dol" /><Label htmlFor="hsam-dol" className="font-normal">% of Participant&apos;s HSA contribution up to $ amount</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="hsam-oth" /><Label htmlFor="hsam-oth" className="font-normal">Other</Label></div>
        </RadioGroup>
        {data.matchingFormula === "pct_of_contribution_pct" && (
          <div className="grid grid-cols-2 gap-2 pl-6">
            <div><Label className="text-xs">Match %</Label><Input value={data.matchingPct} onChange={(e) => update("matchingPct", e.target.value)} /></div>
            <div><Label className="text-xs">Up to % of Comp</Label><Input value={data.matchingComplementPct} onChange={(e) => update("matchingComplementPct", e.target.value)} /></div>
          </div>
        )}
        {data.matchingFormula === "pct_of_contribution_dollar" && (
          <div className="grid grid-cols-2 gap-2 pl-6">
            <div><Label className="text-xs">Match %</Label><Input value={data.matchingPct} onChange={(e) => update("matchingPct", e.target.value)} /></div>
            <div><Label className="text-xs">Up to $</Label><Input value={data.matchingComplementDollar} onChange={(e) => update("matchingComplementDollar", e.target.value)} /></div>
          </div>
        )}
        {data.matchingFormula === "other" && (
          <Input className="ml-6" value={data.matchingOther} onChange={(e) => update("matchingOther", e.target.value)} />
        )}
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Employer Non-Elective Contributions</h3>
        <RadioGroup value={data.nonElectiveFormula} onValueChange={(v) => update("nonElectiveFormula", v as NonElectiveFormulaType)}>
          <div className="flex items-center space-x-2"><RadioGroupItem value="none" id="hsan-none" /><Label htmlFor="hsan-none" className="font-normal">None</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="discretionary" id="hsan-disc" /><Label htmlFor="hsan-disc" className="font-normal">Discretionary</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="pct_of_compensation" id="hsan-pct" /><Label htmlFor="hsan-pct" className="font-normal">% of Compensation</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="dollar_per_employee" id="hsan-dol" /><Label htmlFor="hsan-dol" className="font-normal">$ per Eligible Employee</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="hsan-oth" /><Label htmlFor="hsan-oth" className="font-normal">Other</Label></div>
        </RadioGroup>
        {data.nonElectiveFormula === "pct_of_compensation" && (
          <div className="pl-6"><Label className="text-xs">% of Compensation</Label><Input value={data.nonElectivePct} onChange={(e) => update("nonElectivePct", e.target.value)} /></div>
        )}
        {data.nonElectiveFormula === "dollar_per_employee" && (
          <div className="pl-6"><Label className="text-xs">$ Amount</Label><Input value={data.nonElectiveDollar} onChange={(e) => update("nonElectiveDollar", e.target.value)} /></div>
        )}
        {data.nonElectiveFormula === "other" && (
          <Input className="ml-6" value={data.nonElectiveOther} onChange={(e) => update("nonElectiveOther", e.target.value)} />
        )}
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Contribution Limits</h3>
        <RadioGroup value={data.contributionLimitMode} onValueChange={(v) => update("contributionLimitMode", v as ContributionLimitMode)}>
          <div className="flex items-center space-x-2"><RadioGroupItem value="code_max" id="hsacl-code" /><Label htmlFor="hsacl-code" className="font-normal">Max permitted under Code section 223(b), reduced by Employer contributions</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="other_amount" id="hsacl-oth" /><Label htmlFor="hsacl-oth" className="font-normal">Other amount</Label></div>
        </RadioGroup>
        {data.contributionLimitMode === "other_amount" && (
          <Input className="ml-6" value={data.contributionLimitAmount} onChange={(e) => update("contributionLimitAmount", e.target.value)} placeholder="Cannot exceed Code section 223(b) maximum" />
        )}
      </section>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
