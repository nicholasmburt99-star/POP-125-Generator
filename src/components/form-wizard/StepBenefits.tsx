"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { PlanBenefits } from "@/types";

interface Props {
  data: PlanBenefits;
  onChange: (data: PlanBenefits) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepBenefits({ data, onChange, onNext, onBack }: Props) {
  const [error, setError] = useState("");

  function toggle(field: keyof PlanBenefits) {
    onChange({ ...data, [field]: !data[field] });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.groupMedical && !data.groupDental && !data.groupVision) {
      setError("At least one benefit must be selected");
      return;
    }
    setError("");
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Plan Benefits</h2>
      <p className="text-sm text-gray-500 mb-4">
        Select the benefits that will be included in this plan. At least one is
        required.
      </p>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-3 rounded-lg border p-4">
          <Checkbox
            id="groupMedical"
            checked={data.groupMedical}
            onCheckedChange={() => toggle("groupMedical")}
          />
          <Label htmlFor="groupMedical" className="text-base font-normal">
            Group Medical Insurance
          </Label>
        </div>
        <div className="flex items-center space-x-3 rounded-lg border p-4">
          <Checkbox
            id="groupDental"
            checked={data.groupDental}
            onCheckedChange={() => toggle("groupDental")}
          />
          <Label htmlFor="groupDental" className="text-base font-normal">
            Group Dental Insurance
          </Label>
        </div>
        <div className="flex items-center space-x-3 rounded-lg border p-4">
          <Checkbox
            id="groupVision"
            checked={data.groupVision}
            onCheckedChange={() => toggle("groupVision")}
          />
          <Label htmlFor="groupVision" className="text-base font-normal">
            Group Vision Insurance
          </Label>
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
