export function formatSeasonShortLabel(season) {
  const raw = String(season?.id || season?.name || "");
  const match = raw.match(/(\d{4})\D+(\d{2,4})/);
  if (!match) return raw || "-";

  const startYear = match[1];
  const endYear = match[2].length === 4 ? match[2].slice(-2) : match[2];
  return `${startYear}-${endYear}`;
}

export function getTeamDisplayName(team) {
  return team?.canonicalName || team?.name || "-";
}
