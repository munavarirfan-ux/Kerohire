import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) redirect("/login");

  const orgId = session.user.organizationId;
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  return (
    <div className="space-y-6">
      <h1>Settings</h1>
      <div className="flex gap-4">
        <Link href="/settings/audit">
          <Button variant="outline">Audit log</Button>
        </Link>
      </div>
      <SettingsClient
        orgId={orgId}
        dataRetentionMonths={org?.dataRetentionMonths ?? null}
        anonymizedScreening={org?.anonymizedScreening ?? false}
        isHr={session.user.role === "HR"}
      />
    </div>
  );
}
