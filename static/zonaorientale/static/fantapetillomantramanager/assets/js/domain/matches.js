import { MATCH_STATUSES } from "../core/constants.js";
import { getLabel } from "../core/ui.js";

export function getMatchSerieAMatchday(match) {
  const value = Number(match?.serieAMatchday ?? match?.realSerieAMatchday ?? match?.serieAGiornata ?? 0);
  return Number.isFinite(value) ? value : 0;
}

export function getCompetitionShortCode(competition) {
  const type = competition?.type || competition;
  if (type === "CAMPIONATO") return "A";
  if (type === "COPPA_ITALIA") return "CI";
  if (type === "CHAMPIONS_LEAGUE") return "CL";
  if (type === "PLAYOFF") return "PO";
  return String(competition?.name || type || "-").trim().slice(0, 3).toUpperCase() || "-";
}

export function formatMatchStage(match) {
  return match?.matchday || "-";
}

export function formatMatchResult(match) {
  if (!match || match.status !== "GIOCATA") return getLabel(MATCH_STATUSES, match?.status) || "Da giocare";
  const goals = match.homeGoals !== null && match.homeGoals !== undefined && match.awayGoals !== null && match.awayGoals !== undefined
    ? `${match.homeGoals}-${match.awayGoals}`
    : "Risultato inserito";
  const scores = match.homeScore !== null && match.homeScore !== undefined && match.awayScore !== null && match.awayScore !== undefined
    ? ` · FP ${match.homeScore}-${match.awayScore}`
    : "";
  return `${goals}${scores}`;
}
