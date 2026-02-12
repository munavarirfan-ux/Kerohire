import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { RoleConfigSummaryPDF } from "@/lib/pdf/roleConfigSummary";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const role = await prisma.roleProfile.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: { traitConfigs: { include: { trait: true } } },
  });

  if (!role) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const configs = role.traitConfigs.map((c) => ({
    traitName: c.trait.name,
    weight: c.weight,
    targetMin: c.targetMin,
    targetMax: c.targetMax,
    riskBelow: c.riskBelow,
    riskAbove: c.riskAbove,
  }));

  const buffer = await renderToBuffer(
    React.createElement(RoleConfigSummaryPDF, {
      roleName: role.name,
      configs,
    }) as React.ReactElement
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="role-${role.name.replace(/\s+/g, "-")}.pdf"`,
    },
  });
}
