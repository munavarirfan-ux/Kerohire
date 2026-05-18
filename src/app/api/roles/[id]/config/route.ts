import { NextResponse } from "next/server";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const orgId = await getAppOrgId();

  const { id: roleId } = await params;
  const role = await prisma.roleProfile.findFirst({
    where: { id: roleId, organizationId: orgId },
  });
  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  const body = await req.json();
  const { configs } = body as {
    configs: Array<{
      id: string;
      weight: number;
      targetMin: number;
      targetMax: number;
      riskBelow: number | null;
      riskAbove: number | null;
    }>;
  };

  for (const c of configs) {
    await prisma.roleTraitConfig.updateMany({
      where: { id: c.id, roleId },
      data: {
        weight: c.weight,
        targetMin: c.targetMin,
        targetMax: c.targetMax,
        riskBelow: c.riskBelow,
        riskAbove: c.riskAbove,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
