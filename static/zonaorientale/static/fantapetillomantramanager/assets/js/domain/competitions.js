import { state } from "../core/state.js";

export function getCompetitionTypeOrderV52(competition) {
  const order = {
    CAMPIONATO: 0,
    CHAMPIONS_LEAGUE: 1,
    COPPA_ITALIA: 2,
    PLAYOFF: 3,
    ALTRO: 4
  };
  return order[competition?.type] ?? 99;
}

export function competitionHasProgrammedMatchesV52(competition) {
  if (!competition?.id) return false;
  return (state.raw.competitionMatches || []).some((match) => {
    if (match.competitionId !== competition.id) return false;
    const status = String(match.status || "").toUpperCase();
    return status !== "GIOCATA" && status !== "CONCLUSA" && status !== "ANNULLATA";
  });
}

export function getCompetitionDisplayPriorityV52(competition) {
  const status = String(competition?.status || "").toUpperCase();
  if (status === "ATTIVA" && competitionHasProgrammedMatchesV52(competition)) return 0;
  if (status === "ATTIVA") return 1;
  if (status === "PROGRAMMATA") return 2;
  if (status === "CONCLUSA") return 3;
  return 4;
}

export function compareCompetitionsForPublicDisplayV52(a, b) {
  const priorityCompare = getCompetitionDisplayPriorityV52(a) - getCompetitionDisplayPriorityV52(b);
  if (priorityCompare) return priorityCompare;

  const sortA = Number(a?.sortOrder ?? a?.order ?? Number.NaN);
  const sortB = Number(b?.sortOrder ?? b?.order ?? Number.NaN);
  if (Number.isFinite(sortA) || Number.isFinite(sortB)) {
    const sortCompare = (Number.isFinite(sortA) ? sortA : 999) - (Number.isFinite(sortB) ? sortB : 999);
    if (sortCompare) return sortCompare;
  }

  const typeCompare = getCompetitionTypeOrderV52(a) - getCompetitionTypeOrderV52(b);
  if (typeCompare) return typeCompare;

  return String(a?.name || a?.id || "").localeCompare(
    String(b?.name || b?.id || ""),
    "it",
    { numeric: true, sensitivity: "base" }
  );
}

export function getSeasonCompetitionsForPublicDisplayV52(seasonId) {
  return (state.raw.competitions || [])
    .filter((competition) => competition.seasonId === seasonId)
    .sort(compareCompetitionsForPublicDisplayV52);
}
