import { NextResponse } from "next/server";
import { getAppOrgId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoleFitForCandidate } from "@/lib/scoring-server";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { CompareSnapshotPDF } from "@/lib/pdf/compareSnapshot";

export async function GET(req: Request) {
  const orgId = await getAppOrgId();

  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  if (ids.length === 0 || ids.length > 4) {
    return NextResponse.json(
      { error: "Provide 2–4 candidate ids as query param: ids=id1,id2" },
      { status: 400 }
    );
  }

  const candidates = await prisma.candidate.findMany({
    where: {
      id: { in: ids },
      organizationId: orgId,
    },
    include: { role: true },
  });

  if (candidates.length !== ids.length) {
    return NextResponse.json({ error: "Some candidates not found" }, { status: 404 });
  }

  const rows = await Promise.all(
    candidates.map(async (c) => {
      const fit = await getRoleFitForCandidate(c.id);
      return {
        name: c.name,
        roleFitScore: fit.roleFitScore,
        riskCount: fit.risks.length,
        confidence: fit.confidence,
        topStrengths: fit.alignedTraits.slice(0, 3).join(", ") || "—",
      };
    })
  );

  const buffer = await renderToBuffer(
    React.createElement(CompareSnapshotPDF, { rows }) as React.ReactElement
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=compare.pdf",
    },
  });
}
