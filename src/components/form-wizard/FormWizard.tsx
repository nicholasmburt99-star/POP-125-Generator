"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepEmployerInfo } from "./StepEmployerInfo";
import { StepPlanInfo } from "./StepPlanInfo";
import { StepBenefits } from "./StepBenefits";
import { StepElections } from "./StepElections";
import { StepContacts } from "./StepContacts";
import { StepReview } from "./StepReview";
import type { FormData } from "@/types";

const STEPS = [
  "Employer Info",
  "Plan Info",
  "Benefits",
  "Elections",
  "Contacts",
  "Review",
];

const defaultFormData: FormData = {
  employer: {
    legalBusinessName: "",
    ein: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    entityType: "c_corp",
    stateOfOrganization: "",
    stateOfMainOffice: "",
    stateOfGoverningLaw: "",
    fiscalYearEnd: "",
    hasAffiliatedEmployers: false,
  },
  plan: {
    planType: "pop",
    setupType: "new",
    effectiveDate: "",
    shortPlanYear: false,
    planYearStart: "",
    planYearEnd: "",
  },
  benefits: {
    groupMedical: true,
    groupDental: false,
    groupVision: false,
  },
  elections: {
    employeeElections: "first_year_only",
    includeElectionForms: true,
    allowChangeBelow30Hours: true,
    allowChangeMarketplace: true,
    allowChangeDependentMarketplace: true,
    includeFmlaLanguage: false,
  },
  contacts: {
    primaryContact: { name: "", email: "", phone: "" },
  },
};

export function FormWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const progress = ((step + 1) / STEPS.length) * 100;

  function updateFormData(section: keyof FormData, data: FormData[keyof FormData]) {
    setFormData((prev) => ({ ...prev, [section]: data }));
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  function goToStep(s: number) {
    setStep(s);
  }

  async function handleGenerate() {
    setGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      router.push(`/dashboard/generate/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setGenerating(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              onClick={() => i < step && goToStep(i)}
              className={`${
                i === step
                  ? "text-blue-600 font-medium"
                  : i < step
                  ? "text-gray-700 cursor-pointer hover:underline"
                  : "text-gray-400"
              }`}
              disabled={i > step}
            >
              {label}
            </button>
          ))}
        </div>
        <Progress value={progress} />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg border p-6">
        {step === 0 && (
          <StepEmployerInfo
            data={formData.employer}
            onChange={(d) => updateFormData("employer", d)}
            onNext={next}
          />
        )}
        {step === 1 && (
          <StepPlanInfo
            data={formData.plan}
            onChange={(d) => updateFormData("plan", d)}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 2 && (
          <StepBenefits
            data={formData.benefits}
            onChange={(d) => updateFormData("benefits", d)}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 3 && (
          <StepElections
            data={formData.elections}
            onChange={(d) => updateFormData("elections", d)}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 4 && (
          <StepContacts
            data={formData.contacts}
            onChange={(d) => updateFormData("contacts", d)}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 5 && (
          <StepReview
            formData={formData}
            onBack={back}
            onGoToStep={goToStep}
            onGenerate={handleGenerate}
            generating={generating}
          />
        )}
      </div>
    </div>
  );
}
