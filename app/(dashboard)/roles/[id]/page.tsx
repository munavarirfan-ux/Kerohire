import { notFound } from "next/navigation";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoleEditForm } from "./RoleEditForm";

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const orgId = await getAppOrgId();
  const { id } = await params;
  const role = await prisma.roleProfile.findUnique({
    where: { id, organizationId: orgId },
    include: {
      traitConfigs: { include: { trait: true } },
    },
  });

  if (!role) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>{role.name}</h1>
        <div className="flex gap-2">
          <a href={`/api/export/role/${role.id}`} download>
            <Button variant="outline">Export PDF</Button>
          </a>
          <Link href="/roles">
            <Button variant="outline">Back to roles</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trait config</CardTitle>
        </CardHeader>
        <CardContent>
          <RoleEditForm
            roleId={role.id}
            configs={role.traitConfigs.map((c) => ({
              id: c.id,
              traitId: c.traitId,
              traitName: c.trait.name,
              weight: c.weight,
              targetMin: c.targetMin,
              targetMax: c.targetMax,
              riskBelow: c.riskBelow,
              riskAbove: c.riskAbove,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
