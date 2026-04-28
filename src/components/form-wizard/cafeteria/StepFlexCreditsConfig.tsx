"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { FlexCreditsConfig, FlexCreditEligibleScope, FlexCreditAmountMode, CashOutAllowed, MaxCashOutMode, CashOutPaymentMethod } from "@/types";

interface Props {
  data: FlexCreditsConfig;
  onChange: (data: FlexCreditsConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCafeFlexCreditsConfig({ data, onChange, onNext, onBack }: Props) {
  function update<K extends keyof FlexCreditsConfig>(field: K, value: FlexCreditsConfig[K]) {
    onChange({ ...data, [field]: value });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold mb-2">Flexible Benefit Credits</h2>

      <section className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center space-x-3">
          <Checkbox checked={data.healthFlexContribution} onCheckedChange={(v) => update("healthFlexContribution", !!v)} id="hfc" />
          <Label htmlFor="hfc" className="font-normal">
            Flex Credit qualifies as &ldquo;health flex contribution&rdquo; (Treas. Reg. 1.5000A-3(e)(3)(ii)(E)) — usable only for premiums and Health/HSA-Compatible FSAs
          </Label>
        </div>

        <div>
          <Label className="text-sm">Eligible Benefits</Label>
          <RadioGroup value={data.eligibleScope} onValueChange={(v) => update("eligibleScope", v as FlexCreditEligibleScope)}>
            <div className="flex items-center space-x-2"><RadioGroupItem value="all_benefits" id="es-all" /><Label htmlFor="es-all" className="font-normal text-sm">All Benefits offered under the Plan</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="all_except" id="es-exc" /><Label htmlFor="es-exc" className="font-normal text-sm">All Benefits except the following</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="only_following" id="es-only" /><Label htmlFor="es-only" className="font-normal text-sm">Only the following Benefits</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="premium_health_only" id="es-prem" /><Label htmlFor="es-prem" className="font-normal text-sm">Only Premium Conversion (Health portion) and Health FSA / HSA-Compatible FSA</Label></div>
          </RadioGroup>
          {data.eligibleScope === "all_except" && (
            <Textarea value={data.eligibleScopeExceptions} onChange={(e) => update("eligibleScopeExceptions", e.target.value)} className="mt-2" />
          )}
          {data.eligibleScope === "only_following" && (
            <Textarea value={data.eligibleScopeOnly} onChange={(e) => update("eligibleScopeOnly", e.target.value)} className="mt-2" />
          )}
        </div>

        <div>
          <Label className="text-sm">Amount of Flex Credit</Label>
          <RadioGroup value={data.amountMode} onValueChange={(v) => update("amountMode", v as FlexCreditAmountMode)}>
            <div className="flex items-center space-x-2"><RadioGroupItem value="dollar" id="am-dol" /><Label htmlFor="am-dol" className="font-normal text-sm">$ per Eligible Employee</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="discretionary" id="am-disc" /><Label htmlFor="am-disc" className="font-normal text-sm">Discretionary amount</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="simple_cafeteria_match" id="am-scm" /><Label htmlFor="am-scm" className="font-normal text-sm">Simple Cafeteria Plan contributions amount</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="am-oth" /><Label htmlFor="am-oth" className="font-normal text-sm">Other</Label></div>
          </RadioGroup>
          {data.amountMode === "dollar" && (
            <Input value={data.amountDollar} onChange={(e) => update("amountDollar", e.target.value)} className="mt-2" placeholder="$ per employee" />
          )}
          {data.amountMode === "other" && (
            <Input value={data.amountOther} onChange={(e) => update("amountOther", e.target.value)} className="mt-2" />
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox checked={data.contribTo401k} onCheckedChange={(v) => update("contribTo401k", !!v)} id="c401" />
          <Label htmlFor="c401" className="font-normal">Allow contribution to 401(k) Plan</Label>
        </div>
        {data.contribTo401k && (
          <Input value={data.qualifiedPlanName} onChange={(e) => update("qualifiedPlanName", e.target.value)} placeholder="Qualified Plan name(s)" />
        )}
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Cash Out</h3>
        <RadioGroup value={data.cashOutAllowed} onValueChange={(v) => update("cashOutAllowed", v as CashOutAllowed)}>
          <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="co-y" /><Label htmlFor="co-y" className="font-normal">Yes</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="yes_limited" id="co-yl" /><Label htmlFor="co-yl" className="font-normal">Yes, with limitations</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="co-n" /><Label htmlFor="co-n" className="font-normal">No</Label></div>
        </RadioGroup>
        {data.cashOutAllowed === "yes_limited" && (
          <Input value={data.cashOutLimitations} onChange={(e) => update("cashOutLimitations", e.target.value)} placeholder="Describe limitations" />
        )}
        {data.cashOutAllowed !== "no" && (
          <>
            <div className="space-y-1">
              <Label className="text-sm">Cash-out value per Flex Credit dollar</Label>
              <Input value={data.cashOutDollarValue} onChange={(e) => update("cashOutDollarValue", e.target.value)} placeholder="1.00" />
            </div>
            <div>
              <Label className="text-sm">Maximum Cash-Out</Label>
              <RadioGroup value={data.maxCashOut} onValueChange={(v) => update("maxCashOut", v as MaxCashOutMode)}>
                <div className="flex items-center space-x-2"><RadioGroupItem value="no_limit" id="mc-no" /><Label htmlFor="mc-no" className="font-normal text-sm">No limit</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="per_year_amount" id="mc-pya" /><Label htmlFor="mc-pya" className="font-normal text-sm">$ amount per calendar year</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="mc-oth" /><Label htmlFor="mc-oth" className="font-normal text-sm">Other</Label></div>
              </RadioGroup>
              {data.maxCashOut === "per_year_amount" && (
                <Input value={data.maxCashOutAmount} onChange={(e) => update("maxCashOutAmount", e.target.value)} className="mt-2" />
              )}
              {data.maxCashOut === "other" && (
                <Input value={data.maxCashOutOther} onChange={(e) => update("maxCashOutOther", e.target.value)} className="mt-2" />
              )}
            </div>
            <div>
              <Label className="text-sm">Payment Method</Label>
              <RadioGroup value={data.cashOutPayment} onValueChange={(v) => update("cashOutPayment", v as CashOutPaymentMethod)}>
                <div className="flex items-center space-x-2"><RadioGroupItem value="payroll_installments" id="pm-pi" /><Label htmlFor="pm-pi" className="font-normal text-sm">Equal payroll installments</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="lump_sum_start" id="pm-ls" /><Label htmlFor="pm-ls" className="font-normal text-sm">Lump sum at start of Plan Year</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="lump_sum_end" id="pm-le" /><Label htmlFor="pm-le" className="font-normal text-sm">Lump sum at end of Plan Year</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="pm-oth" /><Label htmlFor="pm-oth" className="font-normal text-sm">Other</Label></div>
              </RadioGroup>
              {data.cashOutPayment === "other" && (
                <Input value={data.cashOutPaymentOther} onChange={(e) => update("cashOutPaymentOther", e.target.value)} className="mt-2" />
              )}
            </div>
          </>
        )}
      </section>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
