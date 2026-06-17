import { normalizeKey } from "../core/utils.js";

export function normalizePlayerName(value) {
  return normalizeKey(value);
}

export function normalizeRosterKey(value) {
  return normalizeKey(value)
    .replace(/\b(f c|fc|a c|ac|a s|as|asd|u s|us|s s|ss)\b/g, "")
    .replace(/\s+/g, "")
    .trim();
}

export function getRosterAliasKeys(seasonTeam) {
  return [
    seasonTeam?.name,
    seasonTeam?.rosterAlias,
    seasonTeam?.rosterName,
    seasonTeam?.excelRosterName,
    seasonTeam?.teamName
  ]
    .filter(Boolean)
    .flatMap((value) => [normalizeKey(value), normalizeRosterKey(value)])
    .filter(Boolean);
}

export function mapStaticRosterPlayers(staticRoster, seasonId, seasonTeamId) {
  return (staticRoster?.players || []).map((player, index) => ({
    id: `static_${seasonTeamId}_${index}`,
    seasonId,
    seasonTeamId,
    playerName: player.playerName,
    realTeam: player.realTeam || "",
    rosterRole: player.role || player.rosterRole || "",
    classicRole: player.role || player.classicRole || "",
    mantraRoles: player.mantraRoles || "",
    cost: player.cost ?? player.rosterCost ?? "",
    status: "ACTIVE",
    source: "static-roster"
  }));
}
