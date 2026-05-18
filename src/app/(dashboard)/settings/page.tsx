import { getServerSession } from "next-auth";
import { authOptions, getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppearanceSettings } from "./AppearanceSettings";
import { SettingsClient } from "./SettingsClient";

export default async function SettingsPage() {
  const orgId = await getAppOrgId();
  const session = await getServerSession(authOptions);
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
      <AppearanceSettings />
      <SettingsClient
        orgId={orgId}
        dataRetentionMonths={org?.dataRetentionMonths ?? null}
        anonymizedScreening={org?.anonymizedScreening ?? false}
        isHr={session?.user?.role === "HR"}
      />
    </div>
  );
}
