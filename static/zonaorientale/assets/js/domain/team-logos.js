import { normalizeKey } from "../core/utils.js";

const TEAM_LOGO_ALIASES = new Map([
  ["due fratelli", "due_fratelli.png"],
  ["beetlejuice", "beetlejuice.png"],
  ["real mappine", "real_mappine.png"],
  ["paperopoli", "paperopoli.png"],
  ["baronissi", "baronissi.png"],
  ["river plaid", "river_plaid.png"],
  ["prestige", "prestige.png"],
  ["prestige worldwide", "prestige.png"],
  ["ac milan", "acmilan.png"],
  ["milan", "acmilan.png"],
  ["real pisistrius", "real_pisistrius.png"],
  ["olympic salerno", "olympic_salerno.png"],
  ["olympic salerno fc", "olympic_salerno.png"]
]);

export function guessTeamLogoByName(value) {
  const key = normalizeKey(value || "");
  if (!key) return "";
  if (TEAM_LOGO_ALIASES.has(key)) return TEAM_LOGO_ALIASES.get(key);
  const simplified = key
    .replace(/\b(fc|football club|asd|asdc|calcio|worldwide)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (TEAM_LOGO_ALIASES.has(simplified)) return TEAM_LOGO_ALIASES.get(simplified);
  const compact = simplified.replace(/\s+/g, "");
  for (const [alias, file] of TEAM_LOGO_ALIASES.entries()) {
    const aliasCompact = alias.replace(/\s+/g, "");
    if (compact === aliasCompact || simplified.includes(alias) || alias.includes(simplified)) return file;
  }
  return "";
}

export function getSeasonTeamNameCandidates(seasonTeam, team) {
  return [
    seasonTeam?.name,
    seasonTeam?.displayName,
    seasonTeam?.shortName,
    team?.canonicalName,
    team?.name,
    team?.shortName
  ].filter(Boolean);
}
