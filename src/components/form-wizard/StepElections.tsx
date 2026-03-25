"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import type { ElectionOptions } from "@/types";

interface Props {
  data: ElectionOptions;
  onChange: (data: ElectionOptions) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepElections({ data, onChange, onNext, onBack }: Props) {
  function update(field: keyof ElectionOptions, value: string | boolean) {
    onChange({ ...data, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold mb-4">Elections & Plan Options</h2>

      <div className="space-y-2">
        <Label>Employee Elections *</Label>
        <RadioGroup
          value={data.employeeElections}
          onValueChange={(v) => update("employeeElections", v)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="first_year_only" id="elect-first" />
            <Label htmlFor="elect-first" className="font-normal">
              Election Required First Year Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="every_year" id="elect-every" />
            <Label htmlFor="elect-every" className="font-normal">
              Election Required Every Year
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not_required" id="elect-none" />
            <Label htmlFor="elect-none" className="font-normal">
              No Election Required
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="includeElectionForms"
            checked={data.includeElectionForms}
            onCheckedChange={(v) => update("includeElectionForms", !!v)}
          />
          <Label htmlFor="includeElectionForms" className="font-normal">
            Include Participant Election Forms
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="allowChangeBelow30Hours"
            checked={data.allowChangeBelow30Hours}
            onCheckedChange={(v) => update("allowChangeBelow30Hours", !!v)}
          />
          <Label htmlFor="allowChangeBelow30Hours" className="font-normal">
            Allow Change of Status if employee drops below 30 hours
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="allowChangeMarketplace"
            checked={data.allowChangeMarketplace}
            onCheckedChange={(v) => update("allowChangeMarketplace", !!v)}
          />
          <Label htmlFor="allowChangeMarketplace" className="font-normal">
            Allow Change of Status for Marketplace special/annual enrollment
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="allowChangeDependentMarketplace"
            checked={data.allowChangeDependentMarketplace}
            onCheckedChange={(v) =>
              update("allowChangeDependentMarketplace", !!v)
            }
          />
          <Label
            htmlFor="allowChangeDependentMarketplace"
            className="font-normal"
          >
            Allow Change of Status for dependent Marketplace enrollment
          </Label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="includeFmlaLanguage"
            checked={data.includeFmlaLanguage}
            onCheckedChange={(v) => update("includeFmlaLanguage", !!v)}
          />
          <Label htmlFor="includeFmlaLanguage" className="font-normal">
            Include FMLA Language
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
