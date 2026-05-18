import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  const orgId = await getAppOrgId();
  if (session && session.user.role !== "HR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const enabled = !!body.enabled;

  await prisma.organization.update({
    where: { id: orgId },
    data: { anonymizedScreening: enabled },
  });

  return NextResponse.json({ ok: true });
}
