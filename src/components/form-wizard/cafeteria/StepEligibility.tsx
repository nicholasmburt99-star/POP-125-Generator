"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { CafeteriaEligibility, ServiceRequirementType, EligibilityDateRule } from "@/types";

interface Props {
  data: CafeteriaEligibility;
  onChange: (data: CafeteriaEligibility) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCafeEligibility({ data, onChange, onNext, onBack }: Props) {
  function update<K extends keyof CafeteriaEligibility>(field: K, value: CafeteriaEligibility[K]) {
    onChange({ ...data, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Eligibility</h2>
      <p className="text-sm text-gray-500 mb-4">When can an Employee become eligible to participate?</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minAge">Minimum Age</Label>
          <Input
            id="minAge"
            type="number"
            value={data.minAge}
            onChange={(e) => update("minAge", parseInt(e.target.value) || 18)}
            min={0}
            max={21}
          />
          <p className="text-xs text-gray-400">Cannot exceed 21 for Simple Cafeteria Plan.</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Service Requirement</Label>
        <RadioGroup
          value={data.serviceRequirementType}
          onValueChange={(v) => update("serviceRequirementType", v as ServiceRequirementType)}
        >
          <div className="flex items-center space-x-2"><RadioGroupItem value="none" id="sr-none" /><Label htmlFor="sr-none" className="font-normal">None</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="hours" id="sr-hours" /><Label htmlFor="sr-hours" className="font-normal">Completion of [N] hours of service</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="days" id="sr-days" /><Label htmlFor="sr-days" className="font-normal">Completion of [N] days of service</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="months" id="sr-months" /><Label htmlFor="sr-months" className="font-normal">Completion of [N] months of service</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="years" id="sr-years" /><Label htmlFor="sr-years" className="font-normal">Completion of [N] years of service</Label></div>
        </RadioGroup>
        {data.serviceRequirementType !== "none" && (
          <div className="pl-6 pt-2">
            <Label>Amount</Label>
            <Input
              value={data.serviceRequirementAmount}
              onChange={(e) => update("serviceRequirementAmount", e.target.value)}
              placeholder="30"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Effective Date of Eligibility</Label>
        <RadioGroup
          value={data.eligibilityDateRule}
          onValueChange={(v) => update("eligibilityDateRule", v as EligibilityDateRule)}
        >
          <div className="flex items-center space-x-2"><RadioGroupItem value="immediate" id="ed-imm" /><Label htmlFor="ed-imm" className="font-normal">Immediately upon meeting requirements</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="first_of_month" id="ed-mo" /><Label htmlFor="ed-mo" className="font-normal">First day of each calendar month</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="first_of_quarter" id="ed-qtr" /><Label htmlFor="ed-qtr" className="font-normal">First day of each plan quarter</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="first_of_first_or_seventh_month" id="ed-first-seventh" /><Label htmlFor="ed-first-seventh" className="font-normal">First day of the 1st and 7th month of the Plan Year</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="first_of_plan_year" id="ed-py" /><Label htmlFor="ed-py" className="font-normal">First day of the Plan Year</Label></div>
        </RadioGroup>
      </div>

      {data.eligibilityDateRule !== "immediate" && (
        <div className="space-y-2">
          <Label>Coincidence</Label>
          <RadioGroup
            value={data.eligibilityCoincidence}
            onValueChange={(v) => update("eligibilityCoincidence", v as "coincident" | "following")}
          >
            <div className="flex items-center space-x-2"><RadioGroupItem value="coincident" id="co-co" /><Label htmlFor="co-co" className="font-normal">Coincident with or next following the period</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="following" id="co-fo" /><Label htmlFor="co-fo" className="font-normal">Following the completion of the period</Label></div>
          </RadioGroup>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="modifications">Other Eligibility Modifications (optional)</Label>
        <Textarea
          id="modifications"
          value={data.eligibilityModifications}
          onChange={(e) => update("eligibilityModifications", e.target.value)}
          placeholder="Any other modifications to the eligibility rules..."
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
