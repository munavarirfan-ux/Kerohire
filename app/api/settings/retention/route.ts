import { NextResponse } from "next/server";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const orgId = await getAppOrgId();

  const body = await req.json();
  const months = body.months as number | null;

  await prisma.organization.update({
    where: { id: orgId },
    data: { dataRetentionMonths: months },
  });

  return NextResponse.json({ ok: true });
}
