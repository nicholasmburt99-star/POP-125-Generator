"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { StepEmployerInfo } from "./StepEmployerInfo";
import { StepPlanInfo } from "./StepPlanInfo";
import { StepBenefits } from "./StepBenefits";
import { StepElections } from "./StepElections";
import { StepContacts } from "./StepContacts";
import { StepReview } from "./StepReview";
import { StepCafePlanIdentity } from "./cafeteria/StepPlanIdentity";
import { StepCafePlanFeatures } from "./cafeteria/StepPlanFeatures";
import { StepCafeEligibility } from "./cafeteria/StepEligibility";
import { StepCafeExclusions } from "./cafeteria/StepExclusions";
import { StepCafeLeaveProvisions } from "./cafeteria/StepLeaveProvisions";
import { StepCafeParticipationElections } from "./cafeteria/StepParticipationElections";
import { StepCafePremiumConversion } from "./cafeteria/StepPremiumConversion";
import { StepCafeFSAConfig } from "./cafeteria/StepFSAConfig";
import { StepCafeHSAConfig } from "./cafeteria/StepHSAConfig";
import { StepCafeFlexCreditsConfig } from "./cafeteria/StepFlexCreditsConfig";
import { StepCafePTOConfig } from "./cafeteria/StepPTOConfig";
import { StepCafeMisc } from "./cafeteria/StepMisc";
import type { FormData, CafeteriaConfig } from "@/types";
import { emptyCafeteriaConfig } from "@/types";

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

interface StepDescriptor {
  key: string;
  label: string;
  render: () => React.ReactNode;
}

interface FormWizardProps {
  initialData?: FormData;
  editId?: string;
}

export function FormWizard({ initialData, editId }: FormWizardProps = {}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(() => {
    const seed = initialData || defaultFormData;
    // Ensure cafeteria config exists if planType is cafeteria
    if (seed.plan.planType === "cafeteria" && !seed.cafeteria) {
      return { ...seed, cafeteria: emptyCafeteriaConfig() };
    }
    return seed;
  });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  function updateFormData<K extends keyof FormData>(section: K, data: FormData[K]) {
    setFormData((prev) => ({ ...prev, [section]: data }));
  }

  function updateCafeteria<K extends keyof CafeteriaConfig>(section: K, data: CafeteriaConfig[K]) {
    setFormData((prev) => {
      const current = prev.cafeteria || emptyCafeteriaConfig();
      return { ...prev, cafeteria: { ...current, [section]: data } };
    });
  }

  function updatePlanInfo(data: FormData["plan"]) {
    setFormData((prev) => {
      const next: FormData = { ...prev, plan: data };
      // When user switches to cafeteria, ensure config exists
      if (data.planType === "cafeteria" && !prev.cafeteria) {
        next.cafeteria = emptyCafeteriaConfig();
        // Pre-fill plan name with the employer name
        if (prev.employer.legalBusinessName) {
          next.cafeteria.identity.planNameLine1 = prev.employer.legalBusinessName;
        }
      }
      return next;
    });
  }

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function goToStep(s: number) {
    setStep(s);
  }

  // Compute the step list dynamically based on plan type and enabled features
  const steps: StepDescriptor[] = useMemo(() => {
    const list: StepDescriptor[] = [];

    list.push({
      key: "employer",
      label: "Employer",
      render: () => (
        <StepEmployerInfo
          data={formData.employer}
          onChange={(d) => updateFormData("employer", d)}
          onNext={next}
        />
      ),
    });

    list.push({
      key: "plan",
      label: "Plan Info",
      render: () => (
        <StepPlanInfo
          data={formData.plan}
          onChange={updatePlanInfo}
          onNext={next}
          onBack={back}
        />
      ),
    });

    if (formData.plan.planType === "pop") {
      list.push({
        key: "benefits",
        label: "Benefits",
        render: () => (
          <StepBenefits
            data={formData.benefits}
            onChange={(d) => updateFormData("benefits", d)}
            onNext={next}
            onBack={back}
          />
        ),
      });
      list.push({
        key: "elections",
        label: "Elections",
        render: () => (
          <StepElections
            data={formData.elections}
            onChange={(d) => updateFormData("elections", d)}
            onNext={next}
            onBack={back}
          />
        ),
      });
    } else {
      // Cafeteria flow
      const cafe = formData.cafeteria || emptyCafeteriaConfig();
      const features = cafe.features;
      const anyFSA =
        features.healthFSA ||
        features.limitedPurposeFSA ||
        features.postDeductibleFSA ||
        features.dcap ||
        features.adoptionAssistanceFSA;
      const anyHealth = features.premiumConversion || anyFSA || features.hsa;

      list.push({
        key: "cafe-identity",
        label: "Plan Identity",
        render: () => (
          <StepCafePlanIdentity
            data={cafe.identity}
            onChange={(d) => updateCafeteria("identity", d)}
            onNext={next}
            onBack={back}
          />
        ),
      });
      list.push({
        key: "cafe-features",
        label: "Plan Features",
        render: () => (
          <StepCafePlanFeatures
            features={cafe.features}
            simpleCafeteriaPlan={cafe.simpleCafeteriaPlan}
            onFeaturesChange={(d) => updateCafeteria("features", d)}
            onSimpleChange={(d) => updateCafeteria("simpleCafeteriaPlan", d)}
            onNext={next}
            onBack={back}
          />
        ),
      });
      list.push({
        key: "cafe-eligibility",
        label: "Eligibility",
        render: () => (
          <StepCafeEligibility
            data={cafe.eligibility}
            onChange={(d) => updateCafeteria("eligibility", d)}
            onNext={next}
            onBack={back}
          />
        ),
      });
      list.push({
        key: "cafe-exclusions",
        label: "Exclusions",
        render: () => (
          <StepCafeExclusions
            data={cafe.exclusions}
            onChange={(d) => updateCafeteria("exclusions", d)}
            onNext={next}
            onBack={back}
          />
        ),
      });
      if (anyHealth) {
        list.push({
          key: "cafe-leave",
          label: "Leave",
          render: () => (
            <StepCafeLeaveProvisions
              data={cafe.leave}
              onChange={(d) => updateCafeteria("leave", d)}
              onNext={next}
              onBack={back}
            />
          ),
        });
      }
      list.push({
        key: "cafe-participation",
        label: "Participation",
        render: () => (
          <StepCafeParticipationElections
            data={cafe.participation}
            features={cafe.features}
            onChange={(d) => updateCafeteria("participation", d)}
            onNext={next}
            onBack={back}
          />
        ),
      });
      if (features.premiumConversion) {
        list.push({
          key: "cafe-premium",
          label: "Premium Conversion",
          render: () => (
            <StepCafePremiumConversion
              data={cafe.premiumConversion}
              onChange={(d) => updateCafeteria("premiumConversion", d)}
              onNext={next}
              onBack={back}
            />
          ),
        });
      }
      if (anyFSA) {
        list.push({
          key: "cafe-fsa",
          label: "FSA Config",
          render: () => (
            <StepCafeFSAConfig
              data={cafe.fsa}
              features={cafe.features}
              onChange={(d) => updateCafeteria("fsa", d)}
              onNext={next}
              onBack={back}
            />
          ),
        });
      }
      if (features.hsa) {
        list.push({
          key: "cafe-hsa",
          label: "HSA",
          render: () => (
            <StepCafeHSAConfig
              data={cafe.hsa}
              onChange={(d) => updateCafeteria("hsa", d)}
              onNext={next}
              onBack={back}
            />
          ),
        });
      }
      if (features.flexCredits) {
        list.push({
          key: "cafe-flex",
          label: "Flex Credits",
          render: () => (
            <StepCafeFlexCreditsConfig
              data={cafe.flexCredits}
              onChange={(d) => updateCafeteria("flexCredits", d)}
              onNext={next}
              onBack={back}
            />
          ),
        });
      }
      if (features.ptoPurchaseSale) {
        list.push({
          key: "cafe-pto",
          label: "PTO",
          render: () => (
            <StepCafePTOConfig
              data={cafe.pto}
              onChange={(d) => updateCafeteria("pto", d)}
              onNext={next}
              onBack={back}
            />
          ),
        });
      }
      list.push({
        key: "cafe-misc",
        label: "Plan Admin",
        render: () => (
          <StepCafeMisc
            data={cafe.misc}
            onChange={(d) => updateCafeteria("misc", d)}
            onNext={next}
            onBack={back}
          />
        ),
      });
    }

    list.push({
      key: "contacts",
      label: "Contacts",
      render: () => (
        <StepContacts
          data={formData.contacts}
          onChange={(d) => updateFormData("contacts", d)}
          onNext={next}
          onBack={back}
        />
      ),
    });

    list.push({
      key: "review",
      label: "Review",
      render: () => (
        <StepReview
          formData={formData}
          onBack={back}
          onGoToStep={goToStep}
          onGenerate={handleGenerate}
          generating={generating}
        />
      ),
    });

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, generating]);

  // Clamp step if list shrunk (e.g., user disabled a feature)
  const safeStep = Math.min(step, steps.length - 1);
  const progress = ((safeStep + 1) / steps.length) * 100;

  async function handleGenerate() {
    setGenerating(true);
    setError("");

    try {
      const url = editId ? `/api/documents/${editId}` : "/api/documents";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
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
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 mb-2">
          {steps.map((s, i) => (
            <button
              key={s.key}
              onClick={() => i <= safeStep && goToStep(i)}
              className={`${
                i === safeStep
                  ? "text-blue-600 font-medium"
                  : i < safeStep
                  ? "text-gray-700 cursor-pointer hover:underline"
                  : "text-gray-400"
              }`}
              disabled={i > safeStep}
            >
              {s.label}
            </button>
          ))}
        </div>
        <Progress value={progress} />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border p-6">
        {steps[safeStep]?.render()}
      </div>
    </div>
  );
}
