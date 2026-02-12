import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId || session.user.role !== "HR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const enabled = !!body.enabled;

  await prisma.organization.update({
    where: { id: session.user.organizationId },
    data: { anonymizedScreening: enabled },
  });

  return NextResponse.json({ ok: true });
}
