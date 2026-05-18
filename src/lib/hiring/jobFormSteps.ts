export const JOB_FORM_STEPS = [
  { id: 1, key: "basic", label: "Basic details" },
  { id: 2, key: "additional", label: "Additional details" },
  { id: 3, key: "custom", label: "Custom fields" },
] as const;

export type JobFormStepId = (typeof JOB_FORM_STEPS)[number]["id"];

export function isJobFormStepValid(
  stepIndex: number,
  data: { title: string },
): boolean {
  const step = JOB_FORM_STEPS[stepIndex];
  if (!step) return false;
  if (step.key === "basic") return data.title.trim().length > 0;
  return true;
}
