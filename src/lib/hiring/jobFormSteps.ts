export const JOB_FORM_STEPS = [
  { id: 1, key: "basic", label: "Basic Details" },
  { id: 2, key: "additional", label: "Additional Details" },
  { id: 3, key: "custom", label: "Custom Fields" },
  { id: 4, key: "hiring-stages", label: "Hiring Stages" },
] as const;

export type JobFormStepId = (typeof JOB_FORM_STEPS)[number]["id"];

export function isJobFormStepValid(
  stepIndex: number,
  data: { title: string },
  hiringStages?: { stageName: string }[],
): boolean {
  const step = JOB_FORM_STEPS[stepIndex];
  if (!step) return false;
  if (step.key === "basic") return data.title.trim().length > 0;
  if (step.key === "hiring-stages") {
    return (
      (hiringStages?.length ?? 0) > 0 &&
      hiringStages.some((s) => s.stageName.trim().length > 0)
    );
  }
  return true;
}
