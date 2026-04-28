"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ParticipationElections, PlanFeatures, DefaultElections, ChangeInStatusEventsRule } from "@/types";

interface Props {
  data: ParticipationElections;
  features: PlanFeatures;
  onChange: (data: ParticipationElections) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCafeParticipationElections({ data, features, onChange, onNext, onBack }: Props) {
  function setDefault<K extends keyof DefaultElections>(field: K, value: boolean) {
    onChange({ ...data, defaultElections: { ...data.defaultElections, [field]: value } });
  }

  function update<K extends keyof ParticipationElections>(field: K, value: ParticipationElections[K]) {
    onChange({ ...data, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold mb-2">Participation Elections</h2>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Default Elections (rollover)</h3>
        <p className="text-xs text-gray-500">For each enabled benefit, check if the prior year&apos;s election should automatically roll forward when no new election is made.</p>
        {features.premiumConversion && (
          <div className="flex items-center space-x-3">
            <Checkbox checked={data.defaultElections.premiumConversion} onCheckedChange={(v) => setDefault("premiumConversion", !!v)} id="dp" />
            <Label htmlFor="dp" className="font-normal">Premium Conversion Account</Label>
          </div>
        )}
        {features.healthFSA && (
          <div className="flex items-center space-x-3">
            <Checkbox checked={data.defaultElections.healthFSA} onCheckedChange={(v) => setDefault("healthFSA", !!v)} id="dhf" />
            <Label htmlFor="dhf" className="font-normal">Health FSA</Label>
          </div>
        )}
        {(features.limitedPurposeFSA || features.postDeductibleFSA) && (
          <div className="flex items-center space-x-3">
            <Checkbox checked={data.defaultElections.limitedPurposeFSA} onCheckedChange={(v) => setDefault("limitedPurposeFSA", !!v)} id="dlf" />
            <Label htmlFor="dlf" className="font-normal">Limited Purpose / Post-Deductible FSA</Label>
          </div>
        )}
        {features.dcap && (
          <div className="flex items-center space-x-3">
            <Checkbox checked={data.defaultElections.dcap} onCheckedChange={(v) => setDefault("dcap", !!v)} id="dd" />
            <Label htmlFor="dd" className="font-normal">DCAP</Label>
          </div>
        )}
        {features.hsa && (
          <div className="flex items-center space-x-3">
            <Checkbox checked={data.defaultElections.hsa} onCheckedChange={(v) => setDefault("hsa", !!v)} id="dh" />
            <Label htmlFor="dh" className="font-normal">HSA</Label>
          </div>
        )}
        {features.adoptionAssistanceFSA && (
          <div className="flex items-center space-x-3">
            <Checkbox checked={data.defaultElections.adoptionAssistanceFSA} onCheckedChange={(v) => setDefault("adoptionAssistanceFSA", !!v)} id="da" />
            <Label htmlFor="da" className="font-normal">Adoption Assistance FSA</Label>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Change in Status Events</h3>
        <RadioGroup
          value={data.changeInStatusEvents}
          onValueChange={(v) => update("changeInStatusEvents", v as ChangeInStatusEventsRule)}
        >
          <div className="flex items-center space-x-2"><RadioGroupItem value="none" id="cis-none" /><Label htmlFor="cis-none" className="font-normal">None permitted</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="treas_reg_125_4" id="cis-tr" /><Label htmlFor="cis-tr" className="font-normal">Any event in Treas. Reg. 1.125-4 and other IRS-permitted events</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="admin_procedures" id="cis-ad" /><Label htmlFor="cis-ad" className="font-normal">Pursuant to written Plan Administrative Procedures</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="cis-oth" /><Label htmlFor="cis-oth" className="font-normal">Other</Label></div>
        </RadioGroup>
        {data.changeInStatusEvents === "other" && (
          <Input
            value={data.changeInStatusOther}
            onChange={(e) => update("changeInStatusOther", e.target.value)}
            placeholder="Describe"
          />
        )}
      </section>

      <section className="space-y-2 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Marketplace Family Enrollment</h3>
        <div className="flex items-center space-x-3">
          <Checkbox checked={data.marketplaceFamilyEnrollment} onCheckedChange={(v) => update("marketplaceFamilyEnrollment", !!v)} id="mfe" />
          <Label htmlFor="mfe" className="font-normal">
            Permit Participants to revoke group health plan coverage when a family member enrolls in a Marketplace Qualified Health Plan
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
