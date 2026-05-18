"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  dialogCloseButtonClass,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { CUSTOM_FIELD_DEFS, DEPARTMENTS, LOCATIONS } from "@/lib/hiring/mockData";
import { JOB_FORM_STEPS, isJobFormStepValid } from "@/lib/hiring/jobFormSteps";
import type { CustomFieldDef, JobVisibility } from "@/lib/hiring/types";
import { cn } from "@/lib/utils";
import { dashboardCanvas } from "@/components/dashboard/dashboardTokens";
import { JobFormStepContent, type JobAdditionalDetails, type JobBasicDetails } from "./JobFormStepContent";
import { JobFormStepCard, JobFormWizardHeader } from "./JobFormStepper";

const footerBtnBase =
  "inline-flex h-11 min-h-[44px] items-center justify-center rounded-[11px] px-5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const BUILTIN_CUSTOM_FIELD_IDS = new Set(CUSTOM_FIELD_DEFS.map((f) => f.id));

const INITIAL_BASIC: JobBasicDetails = {
  title: "",
  department: DEPARTMENTS[0],
  location: LOCATIONS[0],
  workMode: "Hybrid",
  employmentType: "Full-time",
  experienceLevel: "Senior",
  hiringManager: "Elena Hoffmann",
  recruiterOwner: "Marcus Chen",
};

const INITIAL_ADDITIONAL: JobAdditionalDetails = {
  description: "",
  responsibilities: "",
  requiredSkills: "",
  niceToHave: "",
  salaryRange: "",
  openings: "1",
  deadline: "",
  visibility: "Internal + External",
};

export function NewJobFormDialog({
  open,
  onOpenChange,
  onCreated,
  returnFocusRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [showTitleError, setShowTitleError] = useState(false);
  const [customFieldCatalog, setCustomFieldCatalog] = useState<CustomFieldDef[]>(() => [
    ...CUSTOM_FIELD_DEFS,
  ]);
  const [selectedCustomFieldIds, setSelectedCustomFieldIds] = useState<string[]>([]);
  const [basic, setBasic] = useState<JobBasicDetails>(INITIAL_BASIC);
  const [additional, setAdditional] = useState<JobAdditionalDetails>(INITIAL_ADDITIONAL);

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
    setShowTitleError(false);
    setCustomFieldCatalog([...CUSTOM_FIELD_DEFS]);
    setSelectedCustomFieldIds([]);
    setBasic({ ...INITIAL_BASIC, department: DEPARTMENTS[0], location: LOCATIONS[0] });
    setAdditional({ ...INITIAL_ADDITIONAL });
  }, [open]);

  const isLastStep = stepIndex === JOB_FORM_STEPS.length - 1;
  const isStepValid = isJobFormStepValid(stepIndex, basic);
  const maxReachableStepIndex = useMemo(() => {
    let max = 0;
    for (let i = 0; i < JOB_FORM_STEPS.length; i++) {
      if (isJobFormStepValid(i, basic)) max = i;
      else break;
    }
    return max;
  }, [basic]);

  const titleError = showTitleError && !basic.title.trim() ? "Job title is required" : undefined;

  function goNext() {
    if (!isStepValid) {
      if (stepIndex === 0) setShowTitleError(true);
      return;
    }
    if (isLastStep) {
      onCreated?.();
      onOpenChange(false);
      return;
    }
    setStepIndex((i) => Math.min(i + 1, JOB_FORM_STEPS.length - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleAddCustomField(field: CustomFieldDef) {
    setCustomFieldCatalog((prev) => [...prev, field]);
  }

  function handleRemoveCustomField(id: string) {
    setCustomFieldCatalog((prev) => prev.filter((f) => f.id !== id));
    setSelectedCustomFieldIds((prev) => prev.filter((x) => x !== id));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-[230] bg-[rgba(15,23,42,0.4)] backdrop-blur-[4px]" />
        <div
          className={cn(
            "fixed inset-0 z-[230] flex items-center justify-center",
            "px-4 pt-[max(20px,env(safe-area-inset-top))]",
            "pb-[max(20px,env(safe-area-inset-bottom))] sm:px-6",
          )}
        >
          <DialogPanel
            className={cn(
              dashboardCanvas,
              "relative flex w-full max-w-[960px] flex-col overflow-hidden",
              "max-h-[min(900px,calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))]",
              "rounded-[20px] border border-[rgba(15,23,42,0.06)]",
              "shadow-[0_24px_64px_-32px_rgba(15,23,42,0.22)]",
            )}
            onCloseAutoFocus={(event) => {
              if (returnFocusRef?.current) {
                event.preventDefault();
                returnFocusRef.current.focus();
              }
            }}
          >
            <DialogTitle className="sr-only">Add New Job</DialogTitle>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "absolute right-3 top-3 z-20 h-11 w-11 min-h-[44px] min-w-[44px] rounded-[10px] focus-visible:ring-offset-2 sm:right-5 sm:top-5",
                  dialogCloseButtonClass,
                )}
                aria-label="Close add job modal"
              >
                <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Button>
            </DialogClose>

            <DialogDescription className="sr-only">
              Add New Job — configure basic details, additional details, and custom application fields.
            </DialogDescription>

            <form
              noValidate
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
              onSubmit={(e) => {
                e.preventDefault();
                goNext();
              }}
              aria-label="Add new job"
            >
              <JobFormWizardHeader
                currentStepIndex={stepIndex}
                maxReachableStepIndex={maxReachableStepIndex}
                onStepSelect={setStepIndex}
              />

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 sm:px-6">
                <div className="mx-auto w-full max-w-[900px] pb-4">
                  <JobFormStepCard stepIndex={stepIndex}>
                    <JobFormStepContent
                      stepIndex={stepIndex}
                      basic={basic}
                      onBasicChange={(next) => {
                        setBasic(next);
                        if (next.title.trim()) setShowTitleError(false);
                      }}
                      additional={additional}
                      onAdditionalChange={setAdditional}
                      customFieldCatalog={customFieldCatalog}
                      selectedCustomFieldIds={selectedCustomFieldIds}
                      onSelectedCustomFieldIdsChange={setSelectedCustomFieldIds}
                      onAddCustomField={handleAddCustomField}
                      onRemoveCustomField={handleRemoveCustomField}
                      builtinCustomFieldIds={BUILTIN_CUSTOM_FIELD_IDS}
                      titleError={titleError}
                    />
                  </JobFormStepCard>
                </div>
              </div>

              <footer
                className={cn(
                  "shrink-0 border-t border-[rgba(15,23,42,0.06)]",
                  "bg-white/95 backdrop-blur-md dark:bg-surface/95",
                  "rounded-b-[20px] px-4 pt-3 sm:px-6",
                  "pb-[max(16px,env(safe-area-inset-bottom))]",
                )}
              >
                <div className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4">
                  <div className="min-w-[5rem]">
                    {stepIndex > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          footerBtnBase,
                          "gap-1.5 border-[rgba(15,23,42,0.1)] bg-white text-[#3F3F46] hover:bg-[#FAFAFB] focus-visible:ring-forest/25 dark:bg-surface",
                        )}
                        onClick={goBack}
                      >
                        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                        Back
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          footerBtnBase,
                          "border-[rgba(15,23,42,0.1)] bg-white dark:bg-surface",
                        )}
                        onClick={() => onOpenChange(false)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className={cn(
                      footerBtnBase,
                      "min-w-[7.5rem] bg-forest text-white hover:bg-forest/90 focus-visible:ring-forest/30",
                    )}
                    disabled={!isStepValid}
                  >
                    {isLastStep ? "Create job" : "Next"}
                  </Button>
                </div>
              </footer>
            </form>
          </DialogPanel>
        </div>
      </DialogPortal>
    </Dialog>
  );
}
