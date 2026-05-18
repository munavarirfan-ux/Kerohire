/** ZeMeet room id + URL helpers — tied to candidate + interview round */

export function buildZeMeetRoomId(candidateId: string, roundTitle: string): string {
  const slug = roundTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return `zm-${candidateId}-${slug || "interview"}`;
}

export function parseZeMeetRoomId(roomId: string): { candidateId: string; roundSlug: string } | null {
  const match = /^zm-([^-]+)-(.+)$/.exec(roomId);
  if (!match) return null;
  return { candidateId: match[1], roundSlug: match[2] };
}

export function zeMeetPath(roomId: string): string {
  return `/meet/${roomId}`;
}

export function zeMeetJoinUrl(roomId: string, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${zeMeetPath(roomId)}`;
}
