import { prisma } from "@/lib/prisma";
import {
  calculateRoleFit,
  calculateConfidence,
  type TraitConfig,
  type TraitPercentile,
} from "@/lib/scoring";

export async function getRoleFitForCandidate(
  candidateId: string
): Promise<{
  roleFitScore: number;
  alignedTraits: string[];
  risks: { traitId: string; traitName?: string; reason: string; value: number; threshold: number }[];
  confidence: number;
}> {
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: {
      role: {
        include: {
          traitConfigs: { include: { trait: true } },
        },
      },
      assessmentResults: { include: { trait: true } },
    },
  });

  if (!candidate?.role) {
    return {
      roleFitScore: 0,
      alignedTraits: [],
      risks: [],
      confidence: calculateConfidence(),
    };
  }

  const roleConfig: TraitConfig[] = candidate.role.traitConfigs.map((c) => ({
    traitId: c.traitId,
    traitName: c.trait.name,
    weight: c.weight,
    targetMin: c.targetMin,
    targetMax: c.targetMax,
    riskBelow: c.riskBelow,
    riskAbove: c.riskAbove,
  }));

  const traitPercentiles: TraitPercentile[] = candidate.assessmentResults.map((r) => ({
    traitId: r.traitId,
    percentile: r.percentile,
  }));

  const { roleFitScore, alignedTraits, risks } = calculateRoleFit(
    traitPercentiles,
    roleConfig
  );

  return {
    roleFitScore,
    alignedTraits,
    risks: risks.map((r) => ({
      traitId: r.traitId,
      traitName: r.traitName,
      reason: r.reason,
      value: r.value,
      threshold: r.threshold,
    })),
    confidence: calculateConfidence(),
  };
}
