import { HIRING_CANDIDATES, getJobById } from "@/lib/hiring/mockData";
import { getNavigationForRole } from "@/config/navigationByRole";
import type { PreviewRole } from "@/config/previewRole";

export type GlobalSearchItem = {
  id: string;
  label: string;
  href: string;
  group: string;
  keywords: string;
  subtitle?: string;
};

const STATIC_ITEMS: GlobalSearchItem[] = [
  { id: "dash", label: "Dashboard", href: "/dashboard", group: "Navigate", keywords: "home overview dashboard" },
  { id: "jobs", label: "Jobs", href: "/hiring/jobs", group: "Navigate", keywords: "hiring roles jobs" },
  { id: "candidates", label: "Candidates", href: "/candidates", group: "Navigate", keywords: "applicants people candidates" },
  { id: "interviews", label: "Interviews", href: "/interviews", group: "Navigate", keywords: "panels schedule interviews" },
];

function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

function candidateSearchItems(): GlobalSearchItem[] {
  return HIRING_CANDIDATES.map((c) => {
    const job = getJobById(c.jobId);
    const jobTitle = job?.title ?? "Job";
    const phoneDigits = normalizeDigits(c.phone);

    return {
      id: `hiring-candidate-${c.id}`,
      label: c.name,
      subtitle: `${c.email} · ${c.phone}`,
      href: `/hiring/jobs/${c.jobId}?tab=applicants&candidate=${c.id}`,
      group: "Candidates",
      keywords: [
        c.name,
        c.email,
        c.phone,
        phoneDigits,
        c.location,
        c.currentStage,
        c.currentSubstage,
        c.recruiterOwner,
        jobTitle,
        c.skills.join(" "),
        c.jobId,
      ]
        .join(" ")
        .toLowerCase(),
    };
  });
}

const CANDIDATE_ITEMS = candidateSearchItems();

function allItemsForRole(role: PreviewRole): GlobalSearchItem[] {
  const nav = getNavigationForRole(role).flatMap((g) =>
    g.items.map((item) => ({
      id: item.href,
      label: item.label,
      href: item.href,
      group: g.label,
      keywords: `${g.label} ${item.label} ${item.href}`.toLowerCase(),
    })),
  );
  const merged = [
    ...STATIC_ITEMS,
    ...nav.filter((n) => !STATIC_ITEMS.some((s) => s.href === n.href)),
    ...CANDIDATE_ITEMS,
  ];
  return merged;
}

function matchesQuery(item: GlobalSearchItem, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const haystack = `${item.label} ${item.subtitle ?? ""} ${item.keywords} ${item.href}`.toLowerCase();
  const qDigits = normalizeDigits(q);
  const haystackDigits = normalizeDigits(haystack);

  if (haystack.includes(q)) return true;
  if (qDigits.length >= 3 && haystackDigits.includes(qDigits)) return true;

  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token) || haystackDigits.includes(normalizeDigits(token)));
}

export function filterGlobalSearchItems(role: PreviewRole, query: string, limit = 12): GlobalSearchItem[] {
  const merged = allItemsForRole(role);
  const q = query.trim();
  if (!q) return merged.slice(0, limit);

  const candidates = merged.filter((item) => item.group === "Candidates" && matchesQuery(item, q));
  const other = merged.filter((item) => item.group !== "Candidates" && matchesQuery(item, q));

  return [...candidates, ...other].slice(0, limit);
}

export function groupGlobalSearchItems(items: GlobalSearchItem[]): [string, GlobalSearchItem[]][] {
  const order = ["Candidates", "Navigate", "Hiring", "People", "Operations"];
  const map = new Map<string, GlobalSearchItem[]>();
  for (const item of items) {
    const list = map.get(item.group) ?? [];
    list.push(item);
    map.set(item.group, list);
  }

  const entries = Array.from(map.entries());
  entries.sort(([a], [b]) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  return entries;
}
