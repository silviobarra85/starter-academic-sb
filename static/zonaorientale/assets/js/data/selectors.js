import { state } from "../core/state.js";
import { escapeHtml, normalizeKey } from "../core/utils.js";
import { renderTeamLogo } from "../core/ui.js";

export function getRosterSnapshotForSeason(seasonId = getCurrentSeasonId()) {
  const seasonal = state.rosters.filter((item) => item.seasonId === seasonId);
  return seasonal[0] || state.rosters[0] || null;
}

export function buildRosterPlayerIndex(seasonId = getCurrentSeasonId()) {
  const snapshot = getRosterSnapshotForSeason(seasonId);
  const index = new Map();
  if (!snapshot) return index;

  snapshot.rosters.forEach((roster) => {
    (roster.players || []).forEach((player) => {
      index.set(normalizeKey(player.playerName), {
        ...player,
        fantasyRoster: roster.name
      });
    });
  });
  return index;
}

export function enrichListoneWithRosters(listone) {
  if (!listone) return null;
  const rosterIndex = buildRosterPlayerIndex(listone.seasonId || getCurrentSeasonId());
  if (!rosterIndex.size) return listone;

  return {
    ...listone,
    players: (listone.players || []).map((player) => {
      if (player.fantasyRoster) return player;
      const rosterPlayer = rosterIndex.get(normalizeKey(player.playerName));
      if (!rosterPlayer) return { ...player, fantasyRoster: "Svincolati" };
      return {
        ...player,
        fantasyRoster: rosterPlayer.fantasyRoster,
        rosterRole: rosterPlayer.role || player.rosterRole || "",
        rosterCost: rosterPlayer.cost ?? player.rosterCost ?? ""
      };
    })
  };
}

export function getRosterForSeasonTeam(seasonTeam) {
  const snapshot = getRosterSnapshotForSeason(seasonTeam?.seasonId || getCurrentSeasonId());
  if (!snapshot || !seasonTeam) return null;
  const target = normalizeKey(seasonTeam.name || "");
  return snapshot.rosters.find((roster) => normalizeKey(roster.name) === target) || null;
}

export function buildMaps() {
  return {
    presidentsById: new Map(state.raw.presidents.map((item) => [item.id, item])),
    teamsById: new Map(state.raw.teams.map((item) => [item.id, item])),
    seasonsById: new Map(state.raw.seasons.map((item) => [item.id, item])),
    seasonTeamsById: new Map(state.raw.seasonTeams.map((item) => [item.id, item])),
    competitionsById: new Map(state.raw.competitions.map((item) => [item.id, item])),
    stadiumsBySeasonTeamId: new Map(state.raw.stadiums.map((item) => [item.seasonTeamId, item])),
    fifaRankingsByTeamId: new Map(state.raw.fifaRankings.map((item) => [item.teamId, item]))
  };
}

export function getLeagueSettings() {
  return state.raw.leagueSettings.find((item) => item.id === "main") || state.raw.leagueSettings[0] || null;
}

export function getDefaultSeasonId() {
  const league = getLeagueSettings();
  if (league?.currentSeasonId) return league.currentSeasonId;
  const current = state.raw.seasons.find((season) => season.isCurrent);
  if (current) return current.id;
  return state.raw.seasons[0]?.id || "";
}

export function getCurrentSeasonId() {
  if (state.selectedSeasonId) return state.selectedSeasonId;
  return getDefaultSeasonId();
}

export function getFirstSeasonId() {
  return state.raw.seasons[0]?.id || "";
}

export function getValidSeasonSelection(key) {
  const currentValue = state[key];
  if (currentValue && state.raw.seasons.some((season) => season.id === currentValue)) {
    return currentValue;
  }

  const fallback = getFirstSeasonId();
  state[key] = fallback;
  return fallback;
}

export function getSeasonName(id) {
  const { seasonsById } = buildMaps();
  return seasonsById.get(id)?.name || id || "-";
}

export function formatSeasonShortLabel(season) {
  const raw = String(season?.id || season?.name || "");
  const match = raw.match(/(\d{4})\D+(\d{2,4})/);
  if (!match) return raw || "-";

  const startYear = match[1];
  const endYear = match[2].length === 4 ? match[2].slice(-2) : match[2];
  return `${startYear}-${endYear}`;
}

export function getPresidentNames(ids = []) {
  const { presidentsById } = buildMaps();
  const names = ids
    .map((id) => presidentsById.get(id)?.name)
    .filter(Boolean);
  return names.length ? names.join(", ") : "-";
}

export function getTeamDisplayName(team) {
  return team?.canonicalName || team?.name || "-";
}

export function getSeasonTeamsForSeason(seasonId) {
  return state.raw.seasonTeams.filter((seasonTeam) => seasonTeam.seasonId === seasonId);
}

export function getSeasonTeamById(seasonTeamId) {
  const { seasonTeamsById } = buildMaps();
  return seasonTeamsById.get(seasonTeamId) || null;
}

export function getSeasonTeamDisplayName(seasonTeamId) {
  const seasonTeam = getSeasonTeamById(seasonTeamId);
  if (!seasonTeam) return "-";
  return seasonTeam.name || getTeamDisplayName(buildMaps().teamsById.get(seasonTeam.teamId));
}

export function renderSeasonTeamNameWithLogo(seasonTeamId, options = {}

export function renderTeamNameWithLogo(team, options = {}

export function getSeasonTeamLogo(seasonTeam) {
  if (!seasonTeam) return "";
  const { teamsById } = buildMaps();
  const team = teamsById.get(seasonTeam.teamId);
  return seasonTeam.logo || team?.logo || "";
}

export function getSeasonTeamPresidentNames(seasonTeam) {
  return getPresidentNames(seasonTeam?.presidentIds || []);
}

export function getCompetitionResults(competitionId) {
  return state.raw.competitionResults
    .filter((result) => result.competitionId === competitionId)
    .sort((a, b) => Number(a.position || 999) - Number(b.position || 999));
}

export function isRankingCompetition(competition) {
  return competition?.format === "CLASSIFICA" || competition?.type === "CAMPIONATO";
}

export function getParticipantsCount(seasonId) {
  const { seasonsById } = buildMaps();
  const configured = Number(seasonsById.get(seasonId)?.participantCount || 0);
  const actual = getSeasonTeamsForSeason(seasonId).length;
  return configured || actual;
}

export function getHonorRollRow(seasonId) {
  return state.raw.honorRoll.find((row) => row.id === seasonId || row.seasonId === seasonId) || null;
}

export function getCompetitionForHonorCell(seasonId, competitionType) {
  return state.raw.competitions.find((competition) =>
    competition.seasonId === seasonId && competition.type === competitionType
  ) || null;
}

export function isCompetitionNotDisputed(seasonId, competitionType) {
  return getCompetitionForHonorCell(seasonId, competitionType)?.status === "NON_DISPUTATA";
}

export function renderNotDisputedBadge() {
  return `<span class="status status-muted">Non disputata</span>`;
}

export function renderHonorCell(seasonId, competitionType, seasonTeamId) {
  if (seasonTeamId) return renderSeasonTeamNameWithLogo(seasonTeamId);
  if (isCompetitionNotDisputed(seasonId, competitionType)) return renderNotDisputedBadge();
  return "-";
}

export function getWinnerLabel(competition) {
  const results = getCompetitionResults(competition.id);
  const winner = results.find((result) => Number(result.position) === 1);
  const second = results.find((result) => Number(result.position) === 2);

  if (!winner) return "Nessun risultato inserito";

  if (isRankingCompetition(competition)) {
    return `Vincitore ${getSeasonTeamDisplayName(winner.seasonTeamId)}`;
  }

  const secondText = second ? ` · 2° ${getSeasonTeamDisplayName(second.seasonTeamId)}` : "";
  return `Vincitore: ${getSeasonTeamDisplayName(winner.seasonTeamId)}`;
}

export function renderWinnerLabelHtml(competition, options = {}

export function buildPalmares() {
  const { seasonTeamsById, teamsById } = buildMaps();
  const buckets = {
    CAMPIONATO: new Map(),
    COPPA_ITALIA: new Map(),
    CHAMPIONS_LEAGUE: new Map(),
    PLAYOFF: new Map()
  };

  function addWin(type, seasonTeamId) {
    if (!seasonTeamId || !buckets[type]) return;
    const seasonTeam = seasonTeamsById.get(seasonTeamId);
    if (!seasonTeam) return;
    const team = teamsById.get(seasonTeam.teamId);
    if (!team) return;
    const current = buckets[type].get(team.id) || {
      teamId: team.id,
      teamName: team.canonicalName || seasonTeam.name || team.id,
      wins: 0
    };
    current.wins += 1;
    buckets[type].set(team.id, current);
  }

  state.raw.honorRoll.forEach((row) => {
    addWin("CAMPIONATO", row.championItalySeasonTeamId);
    addWin("COPPA_ITALIA", row.coppaItaliaWinnerSeasonTeamId);
    addWin("CHAMPIONS_LEAGUE", row.championsLeagueWinnerSeasonTeamId);
    addWin("PLAYOFF", row.playoffWinnerSeasonTeamId);
  });

  return Object.fromEntries(
    Object.entries(buckets).map(([type, map]) => [
      type,
      Array.from(map.values()).sort((a, b) => b.wins - a.wins || a.teamName.localeCompare(b.teamName, "it"))
    ])
  );
}

export function getStadiumForSeasonTeam(seasonTeamId) {
  return state.raw.stadiums.find((stadium) => stadium.seasonTeamId === seasonTeamId) || null;
}

export function formatStadium(stadium) {
  if (!stadium) return "-";
  const name = stadium.name || "Stadio";
  const level = stadium.level ?? 0;
  return `${name} · L${level}`;
}
