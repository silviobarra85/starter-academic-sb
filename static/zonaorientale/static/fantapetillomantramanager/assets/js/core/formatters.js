import { escapeHtml } from "./utils.js";

export function formatStadium(stadium) {
  if (!stadium) return "-";
  const name = stadium.name || "Stadio";
  const level = stadium.level ?? 0;
  return `${name} · L${level}`;
}

export function formatListoneNumber(value) {
  if (value === null || value === undefined || value === "") return "-";
  return escapeHtml(value);
}

export function formatFm(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? `${number} FM` : `${number.toFixed(2).replace(".", ",")} FM`;
}

export function getRosterRoleSortValue(player) {
  const rawRole = String(player?.rosterRole || player?.classicRole || player?.role || "").trim().toUpperCase();
  const primaryRole = rawRole.charAt(0);
  const order = { P: 1, D: 2, C: 3, A: 4 };
  return order[primaryRole] || 99;
}

export function sortRosterPlayersByRole(players) {
  return [...(players || [])].sort((a, b) => {
    const roleDiff = getRosterRoleSortValue(a) - getRosterRoleSortValue(b);
    if (roleDiff) return roleDiff;

    const nameA = String(a?.playerName || "");
    const nameB = String(b?.playerName || "");
    return nameA.localeCompare(nameB, "it", { sensitivity: "base" });
  });
}
