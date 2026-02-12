import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { JobCreateForm } from "./JobCreateForm";

export default async function NewJobPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/jobs" className="text-chrome-icon hover:text-chrome-active transition-subtle">← Jobs</Link>
        <h1 className="text-chrome-active">Create job</h1>
      </div>
      <JobCreateForm orgId={session.user.organizationId} />
    </div>
  );
}
