"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";
import { DEFAULT_PRIMARY_HEX, normalizeHex, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function AppearanceSettings() {
  const { themePreference, setTheme, primaryHex, setPrimaryHex } = useTheme();
  const [draftPrimary, setDraftPrimary] = useState(primaryHex);

  useEffect(() => {
    setDraftPrimary(primaryHex);
  }, [primaryHex]);

  const previewHex = normalizeHex(draftPrimary) ?? DEFAULT_PRIMARY_HEX;

  function commitPrimary(raw: string) {
    const n = normalizeHex(raw);
    if (!n) return;
    setDraftPrimary(n);
    setPrimaryHex(n);
  }

  return (
    <Card className="border-border/80 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-3">
          <p className="text-sm font-medium text-text">Theme mode</p>
          <div className="inline-flex rounded-[10px] border border-border bg-app-bg/80 p-0.5" role="group" aria-label="Theme mode">
            {THEME_OPTIONS.map(({ value, label }) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant="ghost"
                className={cn(
                  "h-8 rounded-[8px] px-3.5 text-[13px] font-medium",
                  themePreference === value
                    ? "bg-surface text-text shadow-sm"
                    : "text-text-secondary hover:text-text",
                )}
                onClick={() => setTheme(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <p className="text-sm font-medium text-text">Primary accent</p>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              aria-label="Pick accent color"
              className="h-10 w-12 cursor-pointer rounded-[10px] border border-border bg-surface p-1"
              value={previewHex}
              onChange={(e) => commitPrimary(e.target.value)}
            />
            <Input
              className="h-10 w-[7.5rem] rounded-[10px] font-mono text-[13px]"
              value={draftPrimary}
              onChange={(e) => setDraftPrimary(e.target.value)}
              onBlur={() => {
                const n = normalizeHex(draftPrimary);
                if (n) commitPrimary(n);
                else setDraftPrimary(primaryHex);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const n = normalizeHex(draftPrimary);
                  if (n) commitPrimary(n);
                }
              }}
              spellCheck={false}
              placeholder="#FF6B2C"
            />
            <AccentPreview hex={previewHex} />
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

function AccentPreview({ hex }: { hex: string }) {
  return (
    <div
      className="flex h-10 items-center gap-2 rounded-[10px] border border-border bg-surface px-2.5"
      aria-hidden
    >
      <span className="h-5 w-5 shrink-0 rounded-md shadow-sm" style={{ backgroundColor: hex }} />
      <span className="h-5 w-8 shrink-0 rounded-md bg-accent shadow-sm" />
      <span className="h-5 w-5 shrink-0 rounded-full bg-accent/20 ring-1 ring-accent/30" />
    </div>
  );
}
