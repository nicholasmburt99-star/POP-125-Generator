"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { LeaveProvisions, FMLAPaymentMethod, TerminationParticipationDate, ReemploymentBefore30Rule, ReemploymentAfter30Rule } from "@/types";

interface Props {
  data: LeaveProvisions;
  onChange: (data: LeaveProvisions) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCafeLeaveProvisions({ data, onChange, onNext, onBack }: Props) {
  function update<K extends keyof LeaveProvisions>(field: K, value: LeaveProvisions[K]) {
    onChange({ ...data, [field]: value });
  }

  function togglePaymentMethod(m: FMLAPaymentMethod) {
    const has = data.fmlaPaymentMethods.includes(m);
    update("fmlaPaymentMethods", has ? data.fmlaPaymentMethods.filter(x => x !== m) : [...data.fmlaPaymentMethods, m]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold mb-2">Leave Provisions, Termination & Reemployment</h2>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">FMLA Leave (health benefits only)</h3>
        <p className="text-xs text-gray-500">Select at least one option for what a Participant may elect during FMLA:</p>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <Checkbox checked={data.fmlaRevokeAllowed} onCheckedChange={(v) => update("fmlaRevokeAllowed", !!v)} id="fr" />
            <Label htmlFor="fr" className="font-normal">Revoke coverage (reinstated upon return)</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox checked={data.fmlaContinueAllowed} onCheckedChange={(v) => update("fmlaContinueAllowed", !!v)} id="fc" />
            <Label htmlFor="fc" className="font-normal">Continue coverage but discontinue contributions during FMLA leave</Label>
          </div>
          {data.fmlaContinueAllowed && (
            <div className="pl-7 flex items-center space-x-3">
              <Checkbox checked={data.fmlaRecoverContributions} onCheckedChange={(v) => update("fmlaRecoverContributions", !!v)} id="fcr" />
              <Label htmlFor="fcr" className="font-normal text-sm">Employer may recover suspended contributions when Participant returns</Label>
            </div>
          )}
        </div>
        <div>
          <Label className="text-sm">FMLA Coverage Scope</Label>
          <RadioGroup
            value={data.fmlaCoverageScope}
            onValueChange={(v) => update("fmlaCoverageScope", v as "all_benefits" | "health_only")}
          >
            <div className="flex items-center space-x-2"><RadioGroupItem value="all_benefits" id="fcs-all" /><Label htmlFor="fcs-all" className="font-normal">All Benefits available on FMLA leave</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="health_only" id="fcs-health" /><Label htmlFor="fcs-health" className="font-normal">Health Benefits only (Premium Conversion, Health FSA, Limited Purpose FSA)</Label></div>
          </RadioGroup>
        </div>
        <div>
          <Label className="text-sm">FMLA Payment Methods (select all that apply)</Label>
          <div className="space-y-1 pt-1">
            <div className="flex items-center space-x-3">
              <Checkbox checked={data.fmlaPaymentMethods.includes("pre_pay")} onCheckedChange={() => togglePaymentMethod("pre_pay")} id="fpm-pre" />
              <Label htmlFor="fpm-pre" className="font-normal text-sm">Pre-pay before commencement of leave</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox checked={data.fmlaPaymentMethods.includes("on_schedule")} onCheckedChange={() => togglePaymentMethod("on_schedule")} id="fpm-os" />
              <Label htmlFor="fpm-os" className="font-normal text-sm">Pay on after-tax basis on the same schedule as if not on leave</Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox checked={data.fmlaPaymentMethods.includes("repay")} onCheckedChange={() => togglePaymentMethod("repay")} id="fpm-rp" />
              <Label htmlFor="fpm-rp" className="font-normal text-sm">Employer advances and Participant repays upon return</Label>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Non-FMLA Leave</h3>
        <div className="flex items-center space-x-3">
          <Checkbox checked={data.nonFmlaContinuationAllowed} onCheckedChange={(v) => update("nonFmlaContinuationAllowed", !!v)} id="nfm" />
          <Label htmlFor="nfm" className="font-normal">Participant may elect to continue coverage during unpaid non-FMLA leave</Label>
        </div>
      </section>

      <section className="space-y-2 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Termination of Participation</h3>
        <p className="text-xs text-gray-500">If a Participant remains an Employee but is no longer an Eligible Employee, participation terminates:</p>
        <RadioGroup
          value={data.terminationParticipationDate}
          onValueChange={(v) => update("terminationParticipationDate", v as TerminationParticipationDate)}
        >
          <div className="flex items-center space-x-2"><RadioGroupItem value="last_day_employment" id="tp-emp" /><Label htmlFor="tp-emp" className="font-normal">Last day of employment</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="last_day_payroll" id="tp-pay" /><Label htmlFor="tp-pay" className="font-normal">Last day of payroll period</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="last_day_month" id="tp-month" /><Label htmlFor="tp-month" className="font-normal">Last day of the month</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="last_day_plan_year" id="tp-py" /><Label htmlFor="tp-py" className="font-normal">Last day of the Plan Year</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="tp-oth" /><Label htmlFor="tp-oth" className="font-normal">Other</Label></div>
        </RadioGroup>
        {data.terminationParticipationDate === "other" && (
          <Input
            value={data.terminationParticipationOther}
            onChange={(e) => update("terminationParticipationOther", e.target.value)}
            placeholder="Describe"
          />
        )}
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Reemployment</h3>
        <div>
          <Label className="text-sm">If reemployed within 30 days of termination:</Label>
          <RadioGroup
            value={data.reemploymentWithin30}
            onValueChange={(v) => update("reemploymentWithin30", v as ReemploymentBefore30Rule)}
          >
            <div className="flex items-center space-x-2"><RadioGroupItem value="reinstate" id="rw-rein" /><Label htmlFor="rw-rein" className="font-normal">Reinstate prior elections</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="wait_until_next_year" id="rw-wait" /><Label htmlFor="rw-wait" className="font-normal">Wait until first day of subsequent Plan Year</Label></div>
          </RadioGroup>
        </div>
        <div>
          <Label className="text-sm">If reemployed more than 30 days after termination:</Label>
          <RadioGroup
            value={data.reemploymentAfter30}
            onValueChange={(v) => update("reemploymentAfter30", v as ReemploymentAfter30Rule)}
          >
            <div className="flex items-center space-x-2"><RadioGroupItem value="reinstate" id="ra-rein" /><Label htmlFor="ra-rein" className="font-normal">Reinstate prior elections</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="wait_until_next_year" id="ra-wait" /><Label htmlFor="ra-wait" className="font-normal">Wait until first day of subsequent Plan Year</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="employee_choice" id="ra-choice" /><Label htmlFor="ra-choice" className="font-normal">Employee may reinstate prior elections OR make new election</Label></div>
          </RadioGroup>
        </div>
      </section>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
