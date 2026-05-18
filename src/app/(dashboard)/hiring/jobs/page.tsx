import { Suspense } from "react";
import { JobsDashboard } from "@/components/hiring/JobsDashboard";

export default function HiringJobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsDashboard />
    </Suspense>
  );
}
