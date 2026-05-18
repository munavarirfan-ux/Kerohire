"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { buildAccentPalette, getChartColorsFromPalette, type ChartAccentColors } from "@/lib/theme";

export function useChartAccentColors(): ChartAccentColors {
  const { primaryHex, theme } = useTheme();
  return useMemo(
    () => getChartColorsFromPalette(buildAccentPalette(primaryHex, theme)),
    [primaryHex, theme],
  );
}
