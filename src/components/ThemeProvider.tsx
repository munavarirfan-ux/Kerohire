"use client";

import * as React from "react";
import {
  applyAccentPaletteToDocument,
  applyNavbarRgbToDocument,
  applyNavbarTextRgbToDocument,
  applyPrimaryToDocument,
  applyThemeClassToDocument,
  buildAccentPalette,
  chromeToneFromRgb,
  clearLegacyNavColorStorage,
  DEFAULT_PRIMARY_HEX,
  persistThemePreference,
  readStoredPrimary,
  readStoredThemePreference,
  resolveThemeMode,
  resolvedNavbarRgb,
  normalizeHex,
  PRIMARY_STORAGE_KEY,
  type ThemeMode,
  type ThemePreference,
  type ChromeTone,
} from "@/lib/theme";

type ThemeContextValue = {
  /** Stored user preference (light / dark / system) */
  themePreference: ThemePreference;
  /** Resolved mode applied to the UI */
  theme: ThemeMode;
  setTheme: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  primaryHex: string;
  setPrimaryHex: (hex: string) => void;
  /** Space-separated "R G B" for sidebar background (automatic) */
  navRgb: string;
  navTone: ChromeTone;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function persistPrimary(hex: string) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(PRIMARY_STORAGE_KEY, hex);
  } catch {
    /* quota / private mode */
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themePreference, setThemePreferenceState] = React.useState<ThemePreference>("light");
  const [resolvedTheme, setResolvedTheme] = React.useState<ThemeMode>("light");
  const [primaryHex, setPrimaryHexState] = React.useState(DEFAULT_PRIMARY_HEX);

  const applyResolvedTheme = React.useCallback((mode: ThemeMode, accent: string) => {
    setResolvedTheme(mode);
    applyThemeClassToDocument(mode);
    applyPrimaryToDocument(accent, mode);
    applyNavbarRgbToDocument(resolvedNavbarRgb(mode));
    applyNavbarTextRgbToDocument(null);
  }, []);

  React.useLayoutEffect(() => {
    clearLegacyNavColorStorage();
    const pref = readStoredThemePreference();
    const accent = readStoredPrimary();
    const mode = resolveThemeMode(pref);
    setThemePreferenceState(pref);
    setPrimaryHexState(accent);
    applyResolvedTheme(mode, accent);
  }, [applyResolvedTheme]);

  React.useEffect(() => {
    if (themePreference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyResolvedTheme(resolveThemeMode("system"), primaryHex);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [themePreference, primaryHex, applyResolvedTheme]);

  const setTheme = React.useCallback(
    (preference: ThemePreference) => {
      setThemePreferenceState(preference);
      persistThemePreference(preference);
      applyResolvedTheme(resolveThemeMode(preference), primaryHex);
    },
    [primaryHex, applyResolvedTheme],
  );

  const toggleTheme = React.useCallback(() => {
    const next: ThemeMode = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
  }, [resolvedTheme, setTheme]);

  const setPrimaryHex = React.useCallback(
    (hex: string) => {
      const n = normalizeHex(hex);
      if (!n) return;
      setPrimaryHexState(n);
      persistPrimary(n);
      applyAccentPaletteToDocument(buildAccentPalette(n, resolvedTheme));
    },
    [resolvedTheme],
  );

  React.useLayoutEffect(() => {
    applyAccentPaletteToDocument(buildAccentPalette(primaryHex, resolvedTheme));
  }, [primaryHex, resolvedTheme]);

  const navRgb = React.useMemo(() => resolvedNavbarRgb(resolvedTheme), [resolvedTheme]);
  const navTone = React.useMemo(() => chromeToneFromRgb(navRgb), [navRgb]);

  React.useLayoutEffect(() => {
    applyNavbarRgbToDocument(navRgb);
  }, [navRgb]);

  const value = React.useMemo(
    () => ({
      themePreference,
      theme: resolvedTheme,
      setTheme,
      toggleTheme,
      primaryHex,
      setPrimaryHex,
      navRgb,
      navTone,
    }),
    [themePreference, resolvedTheme, setTheme, toggleTheme, primaryHex, setPrimaryHex, navRgb, navTone],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className="min-h-screen min-w-0 w-full bg-app-bg font-sans text-text antialiased">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
