"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CafeteriaIdentity } from "@/types";

interface Props {
  data: CafeteriaIdentity;
  onChange: (data: CafeteriaIdentity) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCafePlanIdentity({ data, onChange, onNext, onBack }: Props) {
  function update<K extends keyof CafeteriaIdentity>(field: K, value: CafeteriaIdentity[K]) {
    onChange({ ...data, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Plan Identity</h2>
      <p className="text-sm text-gray-500">Identifying information for the Adoption Agreement.</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="planNumber">Plan Number *</Label>
          <Input
            id="planNumber"
            value={data.planNumber}
            onChange={(e) => update("planNumber", e.target.value)}
            placeholder="501"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="faxNumber">Fax Number (optional)</Label>
          <Input
            id="faxNumber"
            value={data.faxNumber}
            onChange={(e) => update("faxNumber", e.target.value)}
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="planNameLine1">Plan Name (Line 1) *</Label>
          <Input
            id="planNameLine1"
            value={data.planNameLine1}
            onChange={(e) => update("planNameLine1", e.target.value)}
            placeholder="Company Name"
            required
          />
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="planNameLine2">Plan Name (Line 2) *</Label>
          <Input
            id="planNameLine2"
            value={data.planNameLine2}
            onChange={(e) => update("planNameLine2", e.target.value)}
            placeholder="Cafeteria Plan"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="planYearEndDate">Plan Year End (MM/DD) *</Label>
          <Input
            id="planYearEndDate"
            value={data.planYearEndDate}
            onChange={(e) => update("planYearEndDate", e.target.value)}
            placeholder="12/31"
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
              <RadioGroupItem value="no" id="spy-no" />
              <Label htmlFor="spy-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="spy-yes" />
              <Label htmlFor="spy-yes">Yes</Label>
            </div>
          </RadioGroup>
        </div>

        {data.shortPlanYear && (
          <>
            <div className="space-y-2">
              <Label htmlFor="shortStart">Short Plan Year Start</Label>
              <Input
                id="shortStart"
                type="date"
                value={data.shortPlanYearStart}
                onChange={(e) => update("shortPlanYearStart", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortEnd">Short Plan Year End</Label>
              <Input
                id="shortEnd"
                type="date"
                value={data.shortPlanYearEnd}
                onChange={(e) => update("shortPlanYearEnd", e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="isRestatement"
            checked={data.isRestatement}
            onCheckedChange={(v) => update("isRestatement", !!v)}
          />
          <Label htmlFor="isRestatement" className="font-normal">
            This is a restatement of a previously-adopted plan
          </Label>
        </div>
        {data.isRestatement && (
          <div className="space-y-2">
            <Label htmlFor="restatementDate">Restatement Effective Date</Label>
            <Input
              id="restatementDate"
              type="date"
              value={data.restatementDate}
              onChange={(e) => update("restatementDate", e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Controlled Groups / Affiliated Service Groups</h3>
        <div className="flex items-center space-x-3">
          <Checkbox
            id="affiliated"
            checked={data.affiliatedServiceGroup}
            onCheckedChange={(v) => update("affiliatedServiceGroup", !!v)}
          />
          <Label htmlFor="affiliated" className="font-normal">Plan Sponsor is a member of an affiliated service group</Label>
        </div>
        {data.affiliatedServiceGroup && (
          <Textarea
            value={data.affiliatedServiceGroupMembers}
            onChange={(e) => update("affiliatedServiceGroupMembers", e.target.value)}
            placeholder="List members (other than the Plan Sponsor)"
          />
        )}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="controlled"
            checked={data.controlledGroup}
            onCheckedChange={(v) => update("controlledGroup", !!v)}
          />
          <Label htmlFor="controlled" className="font-normal">Plan Sponsor is a member of a controlled group</Label>
        </div>
        {data.controlledGroup && (
          <Textarea
            value={data.controlledGroupMembers}
            onChange={(e) => update("controlledGroupMembers", e.target.value)}
            placeholder="List members (other than the Plan Sponsor)"
          />
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
