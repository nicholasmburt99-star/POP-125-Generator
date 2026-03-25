"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PlanInfo } from "@/types";

interface Props {
  data: PlanInfo;
  onChange: (data: PlanInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepPlanInfo({ data, onChange, onNext, onBack }: Props) {
  function update(field: keyof PlanInfo, value: string | boolean) {
    onChange({ ...data, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Plan Information</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Plan Type *</Label>
          <RadioGroup
            value={data.planType}
            onValueChange={(v) => update("planType", v)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pop" id="plan-pop" />
              <Label htmlFor="plan-pop" className="font-normal">
                Premium Only Plan (POP) — Qualifies under POP safe harbor rules
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cafeteria" id="plan-cafeteria" />
              <Label htmlFor="plan-cafeteria" className="font-normal">
                Cafeteria Plan — Full nondiscrimination testing
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Setup Type *</Label>
          <RadioGroup
            value={data.setupType}
            onValueChange={(v) => update("setupType", v)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="setup-new" />
              <Label htmlFor="setup-new">New Plan</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="renewal" id="setup-renewal" />
              <Label htmlFor="setup-renewal">Renewal</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Effective Date *</Label>
            <Input
              id="effectiveDate"
              type="date"
              value={data.effectiveDate}
              onChange={(e) => update("effectiveDate", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Short Plan Year?</Label>
            <RadioGroup
              value={data.shortPlanYear ? "yes" : "no"}
              onValueChange={(v) => update("shortPlanYear", v === "yes")}
              className="flex gap-4 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="short-no" />
                <Label htmlFor="short-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="short-yes" />
                <Label htmlFor="short-yes">Yes</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="planYearStart">Plan Year Start *</Label>
            <Input
              id="planYearStart"
              type="date"
              value={data.planYearStart}
              onChange={(e) => update("planYearStart", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="planYearEnd">Plan Year End *</Label>
            <Input
              id="planYearEnd"
              type="date"
              value={data.planYearEnd}
              onChange={(e) => update("planYearEnd", e.target.value)}
              required
            />
          </div>
        </div>
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
