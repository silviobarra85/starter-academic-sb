/* V786 - Sincronizzazione permanente rose/listone per stagione.
 * Gli ID Fantacalcio non sono usati per il matching: possono cambiare tra listoni.
 */

export function normalizeRosterListoneNameV786(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function listoneTimestampV786(listone = {}) {
  const candidates = [listone.loadedAt, listone.meta?.loadedAt, listone.id].filter(Boolean);
  for (const candidate of candidates) {
    const parsed = Date.parse(String(candidate));
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

export function compareListoniByDateDescV786(a = {}, b = {}) {
  const byDate = listoneTimestampV786(b) - listoneTimestampV786(a);
  if (byDate) return byDate;
  return String(b.loadedAt || b.id || "").localeCompare(
    String(a.loadedAt || a.id || ""),
    "it",
    { numeric: true, sensitivity: "base" }
  );
}

export function getLatestListoneForSeasonV786(listoni = [], seasonId = "") {
  const targetSeason = String(seasonId || "").trim();
  if (!targetSeason) return null;
  return [...(Array.isArray(listoni) ? listoni : [])]
    .filter((listone) => {
      const itemSeason = String(listone?.seasonId || listone?.meta?.seasonId || "").trim();
      return itemSeason === targetSeason && !listone?.loadError && Array.isArray(listone?.players);
    })
    .sort(compareListoniByDateDescV786)[0] || null;
}

function playerNameCandidatesV786(player = {}) {
  return [
    player.playerName,
    player.name,
    player.displayName,
    player.canonicalName,
    player.listonePlayerNameV786
  ]
    .map(normalizeRosterListoneNameV786)
    .filter(Boolean);
}

export function findPlayerInListoneV786(listone, player = {}) {
  if (!listone || !Array.isArray(listone.players)) return null;
  const candidateNames = new Set(playerNameCandidatesV786(player));
  if (!candidateNames.size) return null;

  const matches = listone.players.filter((item) => candidateNames.has(normalizeRosterListoneNameV786(item?.playerName)));
  if (matches.length <= 1) return matches[0] || null;

  const team = normalizeRosterListoneNameV786(player.realTeam || player.team || player.realTeamOriginal || "");
  if (team) {
    const teamMatch = matches.find((item) => {
      const itemTeams = [item?.realTeam, item?.realTeamOriginal].map(normalizeRosterListoneNameV786);
      return itemTeams.includes(team);
    });
    if (teamMatch) return teamMatch;
  }
  return matches[0] || null;
}

export function findLatestListonePlayerForRosterPlayerV786(listoni = [], player = {}, seasonId = "") {
  const latestListone = getLatestListoneForSeasonV786(listoni, seasonId);
  return findPlayerInListoneV786(latestListone, player);
}

function isAsteriskListonePlayerV786(player = {}) {
  const raw = [player.statusCode, player.status, player.sourceSheet]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  return raw.includes("ASTER") || raw.includes("CEDUT") || raw.includes("*");
}

export function getRosterListoneStatusV786(listoni = [], player = {}, seasonId = "") {
  const latestListone = getLatestListoneForSeasonV786(listoni, seasonId);
  const listonePlayer = findPlayerInListoneV786(latestListone, player);
  const isAsterisk = !listonePlayer || isAsteriskListonePlayerV786(listonePlayer);
  return {
    code: isAsterisk ? "ASTERISCATO" : "IN_LISTONE",
    label: isAsterisk ? "Asteriscato" : "In listone",
    className: isAsterisk ? "status-warning" : "status-ok",
    latestListone,
    listonePlayer
  };
}

export function syncRosterPlayerWithLatestListoneV786(listoni = [], player = {}, seasonId = "") {
  const status = getRosterListoneStatusV786(listoni, player, seasonId);
  const listonePlayer = status.listonePlayer;
  const base = {
    ...(player || {}),
    seasonId: player?.seasonId || seasonId || "",
    listoneStatusCodeV786: status.code,
    listoneStatusV786: status.label,
    latestListoneIdV786: status.latestListone?.id || "",
    inLatestListoneV786: status.code === "IN_LISTONE"
  };

  if (!listonePlayer) return base;

  return {
    ...base,
    realTeam: listonePlayer.realTeam || base.realTeam || "",
    realTeamOriginal: listonePlayer.realTeamOriginal || base.realTeamOriginal || "",
    classicRole: listonePlayer.classicRole || listonePlayer.role || base.classicRole || base.rosterRole || base.role || "",
    mantraRoles: listonePlayer.mantraRoles || listonePlayer.mantra_roles || base.mantraRoles || "",
    quotationCurrent: listonePlayer.quotationCurrent ?? listonePlayer.quotation_current ?? base.quotationCurrent ?? "",
    quotationInitial: listonePlayer.quotationInitial ?? listonePlayer.quotation_initial ?? base.quotationInitial ?? "",
    fvm: listonePlayer.fvm ?? base.fvm ?? "",
    fantacalcioId: listonePlayer.fantacalcioId || listonePlayer.id || base.fantacalcioId || "",
    listonePlayerNameV786: listonePlayer.playerName || base.playerName || "",
    listoneSourceStatusV786: listonePlayer.statusCode || listonePlayer.status || ""
  };
}
