/**
 * Role-fit scoring and risk detection from assessment percentiles vs role config.
 */

export type TraitConfig = {
  traitId: string;
  traitName?: string;
  weight: number;
  targetMin: number;
  targetMax: number;
  riskBelow: number | null;
  riskAbove: number | null;
};

export type TraitPercentile = {
  traitId: string;
  percentile: number;
};

export type RoleFitResult = {
  roleFitScore: number; // 0–100
  alignedTraits: string[];
  risks: Risk[];
};

export type Risk = {
  traitId: string;
  traitName?: string;
  reason: "below" | "above";
  value: number;
  threshold: number;
};

/**
 * 100% weight if percentile inside target range,
 * 70% if slightly outside,
 * 40% if below risk threshold (or above risk threshold).
 */
function traitContribution(percentile: number, config: TraitConfig): number {
  const { targetMin, targetMax, riskBelow, riskAbove } = config;
  if (percentile >= targetMin && percentile <= targetMax) return 1;
  if (riskBelow != null && percentile < riskBelow) return 0.4;
  if (riskAbove != null && percentile > riskAbove) return 0.4;
  const slightlyOutside =
    (percentile >= targetMin - 10 && percentile < targetMin) ||
    (percentile > targetMax && percentile <= targetMax + 10);
  return slightlyOutside ? 0.7 : 0.4;
}

/**
 * Calculate overall role fit score and list of aligned traits.
 */
export function calculateRoleFit(
  traitPercentiles: TraitPercentile[],
  roleConfig: TraitConfig[]
): RoleFitResult {
  const byTrait = new Map(traitPercentiles.map((t) => [t.traitId, t.percentile]));
  let weightedSum = 0;
  let totalWeight = 0;
  const alignedTraits: string[] = [];

  for (const config of roleConfig) {
    const p = byTrait.get(config.traitId);
    if (p == null) continue;
    const contrib = traitContribution(p, config);
    weightedSum += config.weight * contrib;
    totalWeight += config.weight;
    if (contrib === 1) alignedTraits.push(config.traitName ?? config.traitId);
  }

  const roleFitScore =
    totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 100) : 0;

  const risks = detectRisks(traitPercentiles, roleConfig);

  return { roleFitScore: Math.min(100, Math.max(0, roleFitScore)), alignedTraits, risks };
}

/**
 * Trigger risk if percentile < riskBelow or > riskAbove.
 */
export function detectRisks(
  traitPercentiles: TraitPercentile[],
  roleConfig: TraitConfig[]
): Risk[] {
  const byTrait = new Map(traitPercentiles.map((t) => [t.traitId, t.percentile]));
  const risks: Risk[] = [];

  for (const config of roleConfig) {
    const p = byTrait.get(config.traitId);
    if (p == null) continue;
    if (config.riskBelow != null && p < config.riskBelow) {
      risks.push({
        traitId: config.traitId,
        traitName: config.traitName,
        reason: "below",
        value: p,
        threshold: config.riskBelow,
      });
    }
    if (config.riskAbove != null && p > config.riskAbove) {
      risks.push({
        traitId: config.traitId,
        traitName: config.traitName,
        reason: "above",
        value: p,
        threshold: config.riskAbove,
      });
    }
  }

  return risks;
}

/**
 * Demo confidence score (85–95).
 */
export function calculateConfidence(): number {
  return 85 + Math.floor(Math.random() * 11);
}
