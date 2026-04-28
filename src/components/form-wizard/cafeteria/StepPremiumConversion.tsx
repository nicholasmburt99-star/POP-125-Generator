"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PremiumConversionConfig } from "@/types";

interface Props {
  data: PremiumConversionConfig;
  onChange: (data: PremiumConversionConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

const CONTRACT_TYPES: { key: keyof PremiumConversionConfig["contractTypes"]; label: string }[] = [
  { key: "employerHealth", label: "Employer Health" },
  { key: "employerDental", label: "Employer Dental" },
  { key: "employerVision", label: "Employer Vision" },
  { key: "employerSTD", label: "Employer Short-Term Disability" },
  { key: "employerLTD", label: "Employer Long-Term Disability" },
  { key: "employerGroupTermLife", label: "Employer Group Term Life" },
  { key: "employerADD", label: "Employer Accidental Death & Dismemberment" },
  { key: "individualDental", label: "Individually-Owned Dental" },
  { key: "individualVision", label: "Individually-Owned Vision" },
  { key: "individualDisability", label: "Individually-Owned Disability" },
  { key: "cobra", label: "COBRA continuation coverage" },
  { key: "other", label: "Other" },
];

export function StepCafePremiumConversion({ data, onChange, onNext, onBack }: Props) {
  function toggleContract(key: keyof PremiumConversionConfig["contractTypes"]) {
    if (key === "otherDescription") return;
    const current = data.contractTypes[key] as boolean;
    onChange({
      ...data,
      contractTypes: { ...data.contractTypes, [key]: !current },
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Premium Conversion Account</h2>
      <p className="text-sm text-gray-500 mb-4">Select the types of insurance contracts under which Participants may pay premiums on a pre-tax basis.</p>

      <div className="space-y-2">
        {CONTRACT_TYPES.map((c) => (
          <div key={c.key} className="flex items-center space-x-3">
            <Checkbox
              id={c.key}
              checked={data.contractTypes[c.key] as boolean}
              onCheckedChange={() => toggleContract(c.key)}
            />
            <Label htmlFor={c.key} className="font-normal">{c.label}</Label>
          </div>
        ))}
      </div>

      {data.contractTypes.other && (
        <div className="space-y-1">
          <Label>Describe other contract type</Label>
          <Input
            value={data.contractTypes.otherDescription}
            onChange={(e) => onChange({ ...data, contractTypes: { ...data.contractTypes, otherDescription: e.target.value } })}
          />
        </div>
      )}

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Auto-enrollment & Adjustments</h3>
        <div className="flex items-center space-x-3">
          <Checkbox checked={data.autoEnroll} onCheckedChange={(v) => onChange({ ...data, autoEnroll: !!v })} id="auto-enroll" />
          <Label htmlFor="auto-enroll" className="font-normal">
            Automatically enroll all Employees in Premium Conversion at hire (deemed election to contribute the entire premium)
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <Checkbox checked={data.autoAdjust} onCheckedChange={(v) => onChange({ ...data, autoAdjust: !!v })} id="auto-adjust" />
          <Label htmlFor="auto-adjust" className="font-normal">
            Participant elections automatically adjust for changes in Employer-sponsored contract costs (Treas. Reg. 1.125-4(f)(2)(i))
          </Label>
        </div>
      </section>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
