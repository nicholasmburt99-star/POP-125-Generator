"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HIPAADesignation } from "@/types";

interface Props {
  data: HIPAADesignation;
  onChange: (data: HIPAADesignation) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepHIPAA({ data, onChange, onNext, onBack }: Props) {
  const [error, setError] = useState("");

  function update<K extends keyof HIPAADesignation>(field: K, value: HIPAADesignation[K]) {
    onChange({ ...data, [field]: value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data.privacyOfficerName.trim()) {
      setError("Privacy Officer name is required (HIPAA Privacy Rule, 45 C.F.R. §164.530(a)).");
      return;
    }
    if (data.handlesEphi && !data.securityOfficerName.trim()) {
      setError("Security Officer name is required because the Plan handles ePHI (HIPAA Security Rule, 45 C.F.R. §164.308(a)(2)).");
      return;
    }
    setError("");
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">HIPAA Privacy and Security Officer Designation</h2>
      <p className="text-sm text-gray-500">
        HIPAA requires every health plan to designate, in writing, a Privacy Officer who is
        responsible for the Plan&apos;s policies and procedures governing protected health
        information (PHI). If the Plan also creates, receives, maintains, or transmits
        electronic PHI (ePHI) — for example, through an online benefits portal — a separate
        Security Officer designation is required. The values you provide here will be rendered
        as <em>Appendix A</em> at the end of the Plan Document.
      </p>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="rounded-lg border p-4 space-y-4">
        <h3 className="font-medium text-sm">Privacy Officer (required)</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="privacyOfficerName">Name *</Label>
            <Input
              id="privacyOfficerName"
              value={data.privacyOfficerName}
              onChange={(e) => update("privacyOfficerName", e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="privacyOfficerTitle">Title</Label>
            <Input
              id="privacyOfficerTitle"
              value={data.privacyOfficerTitle}
              onChange={(e) => update("privacyOfficerTitle", e.target.value)}
              placeholder="VP, Human Resources"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">
          The Privacy Officer oversees use and disclosure of PHI, participant rights requests,
          workforce training, and breach response.
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="handlesEphi"
            checked={data.handlesEphi}
            onCheckedChange={(v) => update("handlesEphi", !!v)}
          />
          <div className="flex-1">
            <Label htmlFor="handlesEphi" className="font-normal">
              The Plan creates, receives, maintains, or transmits electronic PHI (ePHI)
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              Check this if the employer uses any electronic system (benefits portal, file
              transfers with a TPA or carrier, electronic enrollment, etc.) to handle PHI on
              behalf of the Plan. When checked, a Security Officer designation is required.
            </p>
          </div>
        </div>

        {data.handlesEphi && (
          <div className="grid grid-cols-2 gap-3 pl-7">
            <div className="space-y-1">
              <Label htmlFor="securityOfficerName">Security Officer Name *</Label>
              <Input
                id="securityOfficerName"
                value={data.securityOfficerName}
                onChange={(e) => update("securityOfficerName", e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="securityOfficerTitle">Title</Label>
              <Input
                id="securityOfficerTitle"
                value={data.securityOfficerTitle}
                onChange={(e) => update("securityOfficerTitle", e.target.value)}
                placeholder="Chief Information Officer"
              />
            </div>
          </div>
        )}
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
