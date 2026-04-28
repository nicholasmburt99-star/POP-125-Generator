"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { FSAConfig, PlanFeatures, EligiblePersonsRule, AdultChildrenAgeRule, GracePeriodEnd, FSATerminationContinuation, QualifiedReservistMode, ContributionLimitMode } from "@/types";

interface Props {
  data: FSAConfig;
  features: PlanFeatures;
  onChange: (data: FSAConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCafeFSAConfig({ data, features, onChange, onNext, onBack }: Props) {
  function update<K extends keyof FSAConfig>(field: K, value: FSAConfig[K]) {
    onChange({ ...data, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  const anyHealthFSA = features.healthFSA || features.limitedPurposeFSA || features.postDeductibleFSA;
  const limitedTitle = features.limitedPurposeFSA && features.postDeductibleFSA
    ? "Limited Purpose / Post-Deductible HSA-Compatible Health FSA"
    : features.limitedPurposeFSA
    ? "Limited Purpose HSA-Compatible Health FSA"
    : "Post-Deductible HSA-Compatible Health FSA";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold mb-2">Flexible Spending Accounts</h2>
      <p className="text-sm text-gray-500 mb-4">Configure each enabled FSA. Defaults follow current Code limits.</p>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Contribution Limits</h3>
        <RadioGroup
          value={data.contributionLimitMode}
          onValueChange={(v) => update("contributionLimitMode", v as ContributionLimitMode)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="code_max" id="cl-code" />
            <Label htmlFor="cl-code" className="font-normal">Maximum amount permitted under Code section 125(i), 129(a)(2), and/or 137(b)(1)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other_amount" id="cl-other" />
            <Label htmlFor="cl-other" className="font-normal">Other amounts (specify below)</Label>
          </div>
        </RadioGroup>
        {data.contributionLimitMode === "other_amount" && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {features.healthFSA && (
              <div className="space-y-1">
                <Label className="text-sm">Health FSA limit ($)</Label>
                <Input value={data.healthFSALimit} onChange={(e) => update("healthFSALimit", e.target.value)} placeholder="3400" />
              </div>
            )}
            {(features.limitedPurposeFSA || features.postDeductibleFSA) && (
              <div className="space-y-1">
                <Label className="text-sm">{limitedTitle} limit ($)</Label>
                <Input value={data.limitedPurposeFSALimit} onChange={(e) => update("limitedPurposeFSALimit", e.target.value)} placeholder="3400" />
              </div>
            )}
            {features.dcap && (
              <div className="space-y-1">
                <Label className="text-sm">DCAP limit ($)</Label>
                <Input value={data.dcapLimit} onChange={(e) => update("dcapLimit", e.target.value)} placeholder="7500" />
              </div>
            )}
            {features.adoptionAssistanceFSA && (
              <div className="space-y-1">
                <Label className="text-sm">Adoption Assistance FSA limit ($)</Label>
                <Input value={data.adoptionAssistanceLimit} onChange={(e) => update("adoptionAssistanceLimit", e.target.value)} />
              </div>
            )}
          </div>
        )}
      </section>

      {anyHealthFSA && (
        <section className="space-y-3 rounded-lg border p-4">
          <h3 className="font-medium text-sm">Eligible Persons (Health FSAs)</h3>
          <RadioGroup
            value={data.eligiblePersons}
            onValueChange={(v) => update("eligiblePersons", v as EligiblePersonsRule)}
          >
            <div className="flex items-center space-x-2"><RadioGroupItem value="participant_spouse_dep" id="ep-psd" /><Label htmlFor="ep-psd" className="font-normal">Participant, spouse, and dependents (including children to age 26)</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="covered_under_employer" id="ep-cov" /><Label htmlFor="ep-cov" className="font-normal">Only persons covered under Employer-sponsored group health plan</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="participant_only" id="ep-only" /><Label htmlFor="ep-only" className="font-normal">Participants only</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="ep-oth" /><Label htmlFor="ep-oth" className="font-normal">Other</Label></div>
          </RadioGroup>
          {data.eligiblePersons === "other" && (
            <Input value={data.eligiblePersonsOther} onChange={(e) => update("eligiblePersonsOther", e.target.value)} />
          )}
          <div>
            <Label className="text-sm">Adult children coverage age</Label>
            <RadioGroup
              value={data.adultChildrenAge}
              onValueChange={(v) => update("adultChildrenAge", v as AdultChildrenAgeRule)}
              className="pt-1"
            >
              <div className="flex items-center space-x-2"><RadioGroupItem value="until_26" id="ac-26" /><Label htmlFor="ac-26" className="font-normal text-sm">Until the date the child attains age 26</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="until_end_of_year_26" id="ac-eoy26" /><Label htmlFor="ac-eoy26" className="font-normal text-sm">Until the last day of the calendar year in which the child attains age 26</Label></div>
            </RadioGroup>
          </div>
        </section>
      )}

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Grace Period</h3>
        <p className="text-xs text-gray-500">Cannot be combined with carryover for the same FSA.</p>
        {features.healthFSA && (
          <div className="flex items-center space-x-3"><Checkbox checked={data.gracePeriodHealthFSA} onCheckedChange={(v) => update("gracePeriodHealthFSA", !!v)} id="gp-h" /><Label htmlFor="gp-h" className="font-normal">Health FSA</Label></div>
        )}
        {(features.limitedPurposeFSA || features.postDeductibleFSA) && (
          <div className="flex items-center space-x-3"><Checkbox checked={data.gracePeriodLimitedFSA} onCheckedChange={(v) => update("gracePeriodLimitedFSA", !!v)} id="gp-l" /><Label htmlFor="gp-l" className="font-normal">{limitedTitle}</Label></div>
        )}
        {features.dcap && (
          <div className="flex items-center space-x-3"><Checkbox checked={data.gracePeriodDcap} onCheckedChange={(v) => update("gracePeriodDcap", !!v)} id="gp-d" /><Label htmlFor="gp-d" className="font-normal">DCAP</Label></div>
        )}
        {features.adoptionAssistanceFSA && (
          <div className="flex items-center space-x-3"><Checkbox checked={data.gracePeriodAdoption} onCheckedChange={(v) => update("gracePeriodAdoption", !!v)} id="gp-a" /><Label htmlFor="gp-a" className="font-normal">Adoption Assistance FSA</Label></div>
        )}
        {(data.gracePeriodHealthFSA || data.gracePeriodLimitedFSA || data.gracePeriodDcap || data.gracePeriodAdoption) && (
          <div className="pt-2">
            <Label className="text-sm">Last day of Grace Period</Label>
            <RadioGroup
              value={data.gracePeriodEnd}
              onValueChange={(v) => update("gracePeriodEnd", v as GracePeriodEnd)}
            >
              <div className="flex items-center space-x-2"><RadioGroupItem value="fifteenth_third_month" id="gpe-15" /><Label htmlFor="gpe-15" className="font-normal text-sm">15th day of the 3rd month following end of Plan Year</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="gpe-other" /><Label htmlFor="gpe-other" className="font-normal text-sm">Other</Label></div>
            </RadioGroup>
            {data.gracePeriodEnd === "other" && (
              <Input value={data.gracePeriodOther} onChange={(e) => update("gracePeriodOther", e.target.value)} className="mt-2" />
            )}
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Run-Out Period</h3>
        <div className="space-y-1">
          <Label className="text-sm">Days after end of Plan Year (if no Grace Period)</Label>
          <Input value={data.runOutDays} onChange={(e) => update("runOutDays", e.target.value)} placeholder="90" />
        </div>
      </section>

      {anyHealthFSA && (
        <section className="space-y-3 rounded-lg border p-4">
          <h3 className="font-medium text-sm">Carryover (Health FSAs only)</h3>
          {features.healthFSA && (
            <>
              <div className="flex items-center space-x-3">
                <Checkbox checked={data.carryoverHealthFSA} onCheckedChange={(v) => update("carryoverHealthFSA", !!v)} id="co-h" />
                <Label htmlFor="co-h" className="font-normal">Health FSA carryover allowed</Label>
              </div>
              {data.carryoverHealthFSA && (
                <RadioGroup
                  value={data.carryoverHealthFSAMode}
                  onValueChange={(v) => update("carryoverHealthFSAMode", v as "max_indexed" | "other")}
                  className="pl-6"
                >
                  <div className="flex items-center space-x-2"><RadioGroupItem value="max_indexed" id="coh-max" /><Label htmlFor="coh-max" className="font-normal text-sm">Maximum amount, as indexed</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="coh-oth" /><Label htmlFor="coh-oth" className="font-normal text-sm">Other</Label></div>
                </RadioGroup>
              )}
              {data.carryoverHealthFSA && data.carryoverHealthFSAMode === "other" && (
                <Input className="ml-6" value={data.carryoverHealthFSAOther} onChange={(e) => update("carryoverHealthFSAOther", e.target.value)} />
              )}
            </>
          )}
          {(features.limitedPurposeFSA || features.postDeductibleFSA) && (
            <>
              <div className="flex items-center space-x-3">
                <Checkbox checked={data.carryoverLimitedFSA} onCheckedChange={(v) => update("carryoverLimitedFSA", !!v)} id="co-l" />
                <Label htmlFor="co-l" className="font-normal">{limitedTitle} carryover allowed</Label>
              </div>
              {data.carryoverLimitedFSA && (
                <RadioGroup
                  value={data.carryoverLimitedFSAMode}
                  onValueChange={(v) => update("carryoverLimitedFSAMode", v as "max_indexed" | "other")}
                  className="pl-6"
                >
                  <div className="flex items-center space-x-2"><RadioGroupItem value="max_indexed" id="col-max" /><Label htmlFor="col-max" className="font-normal text-sm">Maximum amount, as indexed</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="col-oth" /><Label htmlFor="col-oth" className="font-normal text-sm">Other</Label></div>
                </RadioGroup>
              )}
            </>
          )}
        </section>
      )}

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Termination of Employment</h3>
        <RadioGroup
          value={data.terminationContinuation}
          onValueChange={(v) => update("terminationContinuation", v as FSATerminationContinuation)}
        >
          <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="tc-y" /><Label htmlFor="tc-y" className="font-normal text-sm">Yes — continue contributions on after-tax basis</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="yes_limited" id="tc-yl" /><Label htmlFor="tc-yl" className="font-normal text-sm">Yes, with limitations</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="tc-n" /><Label htmlFor="tc-n" className="font-normal text-sm">No</Label></div>
        </RadioGroup>
        {data.terminationContinuation === "yes_limited" && (
          <Input value={data.terminationLimitations} onChange={(e) => update("terminationLimitations", e.target.value)} placeholder="Describe limitations" />
        )}
        <div className="space-y-1">
          <Label className="text-sm">Days after termination to submit claims</Label>
          <Input value={data.terminationClaimsDays} onChange={(e) => update("terminationClaimsDays", e.target.value)} placeholder="30" />
        </div>
      </section>

      {features.healthFSA && (
        <section className="space-y-3 rounded-lg border p-4">
          <h3 className="font-medium text-sm">Qualified Reservist Distributions</h3>
          <div className="flex items-center space-x-3">
            <Checkbox checked={data.qualifiedReservistEnabled} onCheckedChange={(v) => update("qualifiedReservistEnabled", !!v)} id="qr-en" />
            <Label htmlFor="qr-en" className="font-normal">Qualified Reservist Distributions are available</Label>
          </div>
          {data.qualifiedReservistEnabled && (
            <RadioGroup
              value={data.qualifiedReservistMode}
              onValueChange={(v) => update("qualifiedReservistMode", v as QualifiedReservistMode)}
              className="pl-6"
            >
              <div className="flex items-center space-x-2"><RadioGroupItem value="entire_amount" id="qr-ent" /><Label htmlFor="qr-ent" className="font-normal text-sm">Entire amount elected for the Plan Year, less reimbursements</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="contributed_amount" id="qr-con" /><Label htmlFor="qr-con" className="font-normal text-sm">Amount contributed as of the request, less reimbursements</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="qr-oth" /><Label htmlFor="qr-oth" className="font-normal text-sm">Other</Label></div>
            </RadioGroup>
          )}
          {data.qualifiedReservistEnabled && data.qualifiedReservistMode === "other" && (
            <Input className="ml-6" value={data.qualifiedReservistOther} onChange={(e) => update("qualifiedReservistOther", e.target.value)} />
          )}
        </section>
      )}

      <section className="space-y-2 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Expenses Not Eligible (optional)</h3>
        {features.healthFSA && (
          <div><Label className="text-xs">Health FSA</Label><Textarea value={data.expensesNotEligibleHealth} onChange={(e) => update("expensesNotEligibleHealth", e.target.value)} /></div>
        )}
        {(features.limitedPurposeFSA || features.postDeductibleFSA) && (
          <div><Label className="text-xs">{limitedTitle}</Label><Textarea value={data.expensesNotEligibleLimited} onChange={(e) => update("expensesNotEligibleLimited", e.target.value)} /></div>
        )}
        {features.dcap && (
          <div><Label className="text-xs">DCAP</Label><Textarea value={data.expensesNotEligibleDcap} onChange={(e) => update("expensesNotEligibleDcap", e.target.value)} /></div>
        )}
        {features.adoptionAssistanceFSA && (
          <div><Label className="text-xs">Adoption Assistance FSA</Label><Textarea value={data.expensesNotEligibleAdoption} onChange={(e) => update("expensesNotEligibleAdoption", e.target.value)} /></div>
        )}
      </section>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
