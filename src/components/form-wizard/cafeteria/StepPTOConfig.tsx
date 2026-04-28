"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PTOConfig, PTOAmountType } from "@/types";

interface Props {
  data: PTOConfig;
  onChange: (data: PTOConfig) => void;
  onNext: () => void;
  onBack: () => void;
}

function PTOAmountField({
  label, type, amount, other,
  onTypeChange, onAmountChange, onOtherChange,
}: {
  label: string;
  type: PTOAmountType; amount: string; other: string;
  onTypeChange: (v: PTOAmountType) => void;
  onAmountChange: (v: string) => void;
  onOtherChange: (v: string) => void;
}) {
  return (
    <section className="space-y-3 rounded-lg border p-4">
      <h3 className="font-medium text-sm">{label}</h3>
      <RadioGroup value={type} onValueChange={(v) => onTypeChange(v as PTOAmountType)}>
        <div className="flex items-center space-x-2"><RadioGroupItem value="none" id={`${label}-n`} /><Label htmlFor={`${label}-n`} className="font-normal text-sm">None</Label></div>
        <div className="flex items-center space-x-2"><RadioGroupItem value="hours" id={`${label}-h`} /><Label htmlFor={`${label}-h`} className="font-normal text-sm">Hours</Label></div>
        <div className="flex items-center space-x-2"><RadioGroupItem value="days" id={`${label}-d`} /><Label htmlFor={`${label}-d`} className="font-normal text-sm">Days</Label></div>
        <div className="flex items-center space-x-2"><RadioGroupItem value="weeks" id={`${label}-w`} /><Label htmlFor={`${label}-w`} className="font-normal text-sm">Weeks</Label></div>
        <div className="flex items-center space-x-2"><RadioGroupItem value="other" id={`${label}-o`} /><Label htmlFor={`${label}-o`} className="font-normal text-sm">Other</Label></div>
      </RadioGroup>
      {(type === "hours" || type === "days" || type === "weeks") && (
        <Input value={amount} onChange={(e) => onAmountChange(e.target.value)} placeholder="Amount" />
      )}
      {type === "other" && (
        <Input value={other} onChange={(e) => onOtherChange(e.target.value)} />
      )}
    </section>
  );
}

export function StepCafePTOConfig({ data, onChange, onNext, onBack }: Props) {
  function update<K extends keyof PTOConfig>(field: K, value: PTOConfig[K]) {
    onChange({ ...data, [field]: value });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold mb-2">PTO Purchase / Sale</h2>

      <PTOAmountField
        label="Maximum PTO Purchase per Plan Year"
        type={data.maxPurchaseType}
        amount={data.maxPurchaseAmount}
        other={data.maxPurchaseOther}
        onTypeChange={(v) => update("maxPurchaseType", v)}
        onAmountChange={(v) => update("maxPurchaseAmount", v)}
        onOtherChange={(v) => update("maxPurchaseOther", v)}
      />

      <PTOAmountField
        label="Maximum PTO Sale per Plan Year"
        type={data.maxSaleType}
        amount={data.maxSaleAmount}
        other={data.maxSaleOther}
        onTypeChange={(v) => update("maxSaleType", v)}
        onAmountChange={(v) => update("maxSaleAmount", v)}
        onOtherChange={(v) => update("maxSaleOther", v)}
      />

      <section className="space-y-2 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Carryover</h3>
        <div className="flex items-center space-x-3">
          <Checkbox checked={data.noCarryoverElectivePTO} onCheckedChange={(v) => update("noCarryoverElectivePTO", !!v)} id="nco" />
          <Label htmlFor="nco" className="font-normal">No carryover — unused elective PTO is paid in cash on or prior to the last day of the Plan Year</Label>
        </div>
        <p className="text-xs text-gray-500">If unchecked, unused elective PTO will be forfeited as of the last day of the Plan Year.</p>
      </section>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
