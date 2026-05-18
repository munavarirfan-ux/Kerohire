import Link from "next/link";
import { getAppOrgId } from "@/lib/auth";
import { JobCreateForm } from "./JobCreateForm";

export default async function NewJobPage() {
  const orgId = await getAppOrgId();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/jobs" className="text-chrome-icon hover:text-chrome-active transition-subtle">← Jobs</Link>
        <h1 className="text-chrome-active">Create job</h1>
      </div>
      <JobCreateForm orgId={orgId} />
    </div>
  );
}
