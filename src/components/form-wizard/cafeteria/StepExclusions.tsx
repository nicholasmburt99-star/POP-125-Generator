"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ExcludedEmployees } from "@/types";

interface Props {
  data: ExcludedEmployees;
  onChange: (data: ExcludedEmployees) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCafeExclusions({ data, onChange, onNext, onBack }: Props) {
  function update<K extends keyof ExcludedEmployees>(field: K, value: ExcludedEmployees[K]) {
    onChange({ ...data, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Excluded Employees</h2>
      <p className="text-sm text-gray-500 mb-4">
        Select categories of Employees that are NOT eligible to participate.
      </p>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Checkbox id="exUnion" checked={data.excludeUnion} onCheckedChange={(v) => update("excludeUnion", !!v)} />
          <Label htmlFor="exUnion" className="font-normal">Union Employees (covered by collective bargaining)</Label>
        </div>
        <div className="flex items-center space-x-3">
          <Checkbox id="exLeased" checked={data.excludeLeased} onCheckedChange={(v) => update("excludeLeased", !!v)} />
          <Label htmlFor="exLeased" className="font-normal">Leased Employees</Label>
        </div>
        <div className="flex items-center space-x-3">
          <Checkbox id="exNRA" checked={data.excludeNonResidentAliens} onCheckedChange={(v) => update("excludeNonResidentAliens", !!v)} />
          <Label htmlFor="exNRA" className="font-normal">Non-Resident Aliens (per Code section 410(b)(3)(C))</Label>
        </div>
        <div className="flex items-center space-x-3">
          <Checkbox id="exPT" checked={data.excludePartTime} onCheckedChange={(v) => update("excludePartTime", !!v)} />
          <Label htmlFor="exPT" className="font-normal">Part-time Employees (working fewer than the threshold)</Label>
        </div>
        {data.excludePartTime && (
          <div className="pl-7 space-y-1">
            <Label htmlFor="ptHours">Hours per week threshold</Label>
            <Input
              id="ptHours"
              value={data.partTimeHoursThreshold}
              onChange={(e) => update("partTimeHoursThreshold", e.target.value)}
              placeholder="30"
            />
          </div>
        )}
        <div className="flex items-center space-x-3">
          <Checkbox id="exOther" checked={data.excludeOther} onCheckedChange={(v) => update("excludeOther", !!v)} />
          <Label htmlFor="exOther" className="font-normal">Other (must satisfy Code section 125(g))</Label>
        </div>
        {data.excludeOther && (
          <div className="pl-7">
            <Input
              value={data.excludeOtherDescription}
              onChange={(e) => update("excludeOtherDescription", e.target.value)}
              placeholder="Describe the excluded category"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="defModifications">Modifications to definition of Eligible Employee (optional)</Label>
        <Textarea
          id="defModifications"
          value={data.definitionModifications}
          onChange={(e) => update("definitionModifications", e.target.value)}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
