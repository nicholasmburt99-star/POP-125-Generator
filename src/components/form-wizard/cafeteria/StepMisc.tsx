"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CafeteriaMisc, PlanAdminType, IndemnificationType } from "@/types";

interface Props {
  data: CafeteriaMisc;
  onChange: (data: CafeteriaMisc) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepCafeMisc({ data, onChange, onNext, onBack }: Props) {
  function update<K extends keyof CafeteriaMisc>(field: K, value: CafeteriaMisc[K]) {
    onChange({ ...data, [field]: value });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-semibold mb-2">Plan Administration</h2>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Plan Administrator</h3>
        <RadioGroup value={data.planAdminType} onValueChange={(v) => update("planAdminType", v as PlanAdminType)}>
          <div className="flex items-center space-x-2"><RadioGroupItem value="sponsor" id="pa-sp" /><Label htmlFor="pa-sp" className="font-normal">Plan Sponsor (Employer)</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="committee" id="pa-co" /><Label htmlFor="pa-co" className="font-normal">Committee appointed by Plan Sponsor</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="other" id="pa-oth" /><Label htmlFor="pa-oth" className="font-normal">Other</Label></div>
        </RadioGroup>
        {data.planAdminType === "other" && (
          <Input value={data.planAdminOther} onChange={(e) => update("planAdminOther", e.target.value)} placeholder="Describe" />
        )}
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h3 className="font-medium text-sm">Indemnification</h3>
        <RadioGroup value={data.indemnificationType} onValueChange={(v) => update("indemnificationType", v as IndemnificationType)}>
          <div className="flex items-center space-x-2"><RadioGroupItem value="none" id="in-none" /><Label htmlFor="in-none" className="font-normal">None — Company will not indemnify the Plan Administrator</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="standard" id="in-std" /><Label htmlFor="in-std" className="font-normal">Standard (as provided in Section 14.02 of the Basic Plan Document)</Label></div>
          <div className="flex items-center space-x-2"><RadioGroupItem value="custom" id="in-cust" /><Label htmlFor="in-cust" className="font-normal">Custom (per Addendum to the Adoption Agreement)</Label></div>
        </RadioGroup>
      </section>

      <p className="text-xs text-gray-500">Governing Law and State of Organization are taken from the Employer Information you provided earlier.</p>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
