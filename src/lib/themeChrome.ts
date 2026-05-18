import type { ChromeTone } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Shared nav link transitions — no accent bars, glows, or heavy fills. */
const navTransition =
  "transition-[color,background-color,border-color,box-shadow] duration-150 ease-out";

const navActiveDark = cn(
  navTransition,
  "border-white/[0.08] bg-white/[0.06] text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
);
const navIdleDark = cn(
  navTransition,
  "border-transparent text-white/68 hover:border-transparent hover:bg-white/[0.04] hover:text-white/92",
);
const navIconIdleDark = "text-white/45 group-hover:text-white/75";
const navIconActiveDark = "text-white/90";

const navActiveLight = cn(
  navTransition,
  "border-black/[0.06] bg-black/[0.05] text-slate-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
);
const navIdleLight = cn(
  navTransition,
  "border-transparent text-slate-600 hover:border-transparent hover:bg-black/[0.04] hover:text-slate-900",
);
const navIconIdleLight = "text-slate-500 group-hover:text-slate-700";
const navIconActiveLight = "text-slate-800";

/**
 * Sidebar chrome for nav background tone + optional custom label color (`--nav-text-rgb`).
 * Active items use a soft tinted surface — never accent borders or glow.
 */
export function navChromeClasses(tone: ChromeTone, navTextCustomRgb: string | null) {
  if (navTextCustomRgb) {
    if (tone === "dark") {
      return {
        panel: "text-[rgb(var(--nav-text-rgb))] lg:m-2 lg:rounded-[16px]",
        hairline: "border-white/[0.06]",
        brandTitle: "text-[rgb(var(--nav-text-rgb))] font-medium",
        brandSub: "text-[rgb(var(--nav-text-rgb)_/_0.5)]",
        ghostBtn:
          "text-[rgb(var(--nav-text-rgb)_/_0.65)] hover:bg-white/[0.04] hover:text-[rgb(var(--nav-text-rgb)_/_0.92)] transition-colors duration-150 ease-out",
        groupLabel: "text-[rgb(var(--nav-text-rgb)_/_0.42)]",
        divider: "bg-white/[0.06]",
        linkIdle: cn(
          navTransition,
          "border-transparent text-[rgb(var(--nav-text-rgb)_/_0.68)] hover:bg-white/[0.04] hover:text-[rgb(var(--nav-text-rgb)_/_0.92)]",
        ),
        linkActive: cn(
          navTransition,
          "border-white/[0.08] bg-white/[0.06] text-[rgb(var(--nav-text-rgb))] shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
        ),
        iconIdle: "text-[rgb(var(--nav-text-rgb)_/_0.45)] group-hover:text-[rgb(var(--nav-text-rgb)_/_0.75)]",
        iconActive: "text-[rgb(var(--nav-text-rgb)_/_0.9)]",
        settingsRow: cn(
          navTransition,
          "border-transparent text-[rgb(var(--nav-text-rgb)_/_0.68)] hover:bg-white/[0.04] hover:text-[rgb(var(--nav-text-rgb)_/_0.92)]",
        ),
        settingsActive: cn(
          navTransition,
          "border-white/[0.08] bg-white/[0.06] text-[rgb(var(--nav-text-rgb))] shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
        ),
        settingsIconIdle: "text-[rgb(var(--nav-text-rgb)_/_0.45)] group-hover:text-[rgb(var(--nav-text-rgb)_/_0.75)]",
        settingsIconActive: "text-[rgb(var(--nav-text-rgb)_/_0.9)]",
      };
    }
    return {
      panel: "text-[rgb(var(--nav-text-rgb))] lg:m-2 lg:rounded-[16px]",
      hairline: "border-black/[0.06]",
      brandTitle: "text-[rgb(var(--nav-text-rgb))] font-medium",
      brandSub: "text-[rgb(var(--nav-text-rgb)_/_0.5)]",
      ghostBtn:
        "text-[rgb(var(--nav-text-rgb)_/_0.6)] hover:bg-black/[0.04] hover:text-[rgb(var(--nav-text-rgb))] transition-colors duration-150 ease-out",
      groupLabel: "text-[rgb(var(--nav-text-rgb)_/_0.45)]",
      divider: "bg-black/[0.06]",
      linkIdle: cn(
        navTransition,
        "border-transparent text-[rgb(var(--nav-text-rgb)_/_0.62)] hover:bg-black/[0.04] hover:text-[rgb(var(--nav-text-rgb))]",
      ),
      linkActive: cn(
        navTransition,
        "border-black/[0.06] bg-black/[0.05] text-[rgb(var(--nav-text-rgb))] shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
      ),
      iconIdle: "text-[rgb(var(--nav-text-rgb)_/_0.4)] group-hover:text-[rgb(var(--nav-text-rgb)_/_0.7)]",
      iconActive: "text-[rgb(var(--nav-text-rgb)_/_0.85)]",
      settingsRow: cn(
        navTransition,
        "border-transparent text-[rgb(var(--nav-text-rgb)_/_0.62)] hover:bg-black/[0.04] hover:text-[rgb(var(--nav-text-rgb))]",
      ),
      settingsActive: cn(
        navTransition,
        "border-black/[0.06] bg-black/[0.05] text-[rgb(var(--nav-text-rgb))] shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
      ),
      settingsIconIdle: "text-[rgb(var(--nav-text-rgb)_/_0.4)] group-hover:text-[rgb(var(--nav-text-rgb)_/_0.7)]",
      settingsIconActive: "text-[rgb(var(--nav-text-rgb)_/_0.85)]",
    };
  }

  if (tone === "dark") {
    return {
      panel: "text-zinc-200 lg:m-2 lg:rounded-[16px]",
      hairline: "border-white/[0.06]",
      brandTitle: "font-medium text-zinc-100",
      brandSub: "text-zinc-500",
      ghostBtn:
        "text-zinc-400 transition-colors duration-150 ease-out hover:bg-white/[0.04] hover:text-zinc-200",
      groupLabel: "text-zinc-500",
      divider: "bg-white/[0.06]",
      linkIdle: navIdleDark,
      linkActive: navActiveDark,
      iconIdle: navIconIdleDark,
      iconActive: navIconActiveDark,
      settingsRow: navIdleDark,
      settingsActive: navActiveDark,
      settingsIconIdle: navIconIdleDark,
      settingsIconActive: navIconActiveDark,
    };
  }

  return {
    panel: "text-slate-900 lg:m-2 lg:rounded-[16px]",
    hairline: "border-black/[0.06]",
    brandTitle: "font-medium text-slate-900",
    brandSub: "text-slate-500",
    ghostBtn: "text-slate-500 transition-colors duration-150 ease-out hover:bg-black/[0.04] hover:text-slate-800",
    groupLabel: "text-slate-500",
    divider: "bg-black/[0.06]",
    linkIdle: navIdleLight,
    linkActive: navActiveLight,
    iconIdle: navIconIdleLight,
    iconActive: navIconActiveLight,
    settingsRow: navIdleLight,
    settingsActive: navActiveLight,
    settingsIconIdle: navIconIdleLight,
    settingsIconActive: navIconActiveLight,
  };
}
