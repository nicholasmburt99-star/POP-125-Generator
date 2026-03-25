"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { EmployerInfo } from "@/types";
import { US_STATES, ENTITY_TYPE_LABELS } from "@/types";

interface Props {
  data: EmployerInfo;
  onChange: (data: EmployerInfo) => void;
  onNext: () => void;
}

export function StepEmployerInfo({ data, onChange, onNext }: Props) {
  function update(field: keyof EmployerInfo, value: string | boolean | null) {
    if (value === null) return;
    onChange({ ...data, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Employer Information</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="legalBusinessName">Legal Business Name *</Label>
          <Input
            id="legalBusinessName"
            value={data.legalBusinessName}
            onChange={(e) => update("legalBusinessName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ein">EIN (XX-XXXXXXX) *</Label>
          <Input
            id="ein"
            value={data.ein}
            onChange={(e) => update("ein", e.target.value)}
            placeholder="12-3456789"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="streetAddress">Street Address *</Label>
          <Input
            id="streetAddress"
            value={data.streetAddress}
            onChange={(e) => update("streetAddress", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={data.city}
            onChange={(e) => update("city", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>State *</Label>
          <Select value={data.state} onValueChange={(v) => update("state", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={data.zipCode}
            onChange={(e) => update("zipCode", e.target.value)}
            placeholder="12345"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Type of Entity *</Label>
          <Select
            value={data.entityType}
            onValueChange={(v) => update("entityType", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>State of Organization *</Label>
          <Select
            value={data.stateOfOrganization}
            onValueChange={(v) => update("stateOfOrganization", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>State of Main Office *</Label>
          <Select
            value={data.stateOfMainOffice}
            onValueChange={(v) => update("stateOfMainOffice", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>State of Governing Law *</Label>
          <Select
            value={data.stateOfGoverningLaw}
            onValueChange={(v) => update("stateOfGoverningLaw", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fiscalYearEnd">Fiscal Year End *</Label>
          <Input
            id="fiscalYearEnd"
            type="date"
            value={data.fiscalYearEnd}
            onChange={(e) => update("fiscalYearEnd", e.target.value)}
            required
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label>Affiliated Employers?</Label>
          <RadioGroup
            value={data.hasAffiliatedEmployers ? "yes" : "no"}
            onValueChange={(v) =>
              update("hasAffiliatedEmployers", v === "yes")
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="affiliated-no" />
              <Label htmlFor="affiliated-no">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="affiliated-yes" />
              <Label htmlFor="affiliated-yes">Yes</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}
