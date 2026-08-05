/* V787 - Sincronizzazione permanente rose/listone per stagione.
 * Gli ID Fantacalcio non sono usati per il matching: possono cambiare tra listoni.
 * La squadra reale e il ruolo mostrati nelle rose arrivano sempre dall'ultimo listone
 * disponibile della stagione selezionata.
 */

export function normalizeRosterListoneNameV787(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function listoneTimestampV787(listone = {}) {
  const candidates = [listone.loadedAt, listone.meta?.loadedAt, listone.id].filter(Boolean);
  for (const candidate of candidates) {
    const parsed = Date.parse(String(candidate));
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

export function compareListoniByDateDescV787(a = {}, b = {}) {
  const byDate = listoneTimestampV787(b) - listoneTimestampV787(a);
  if (byDate) return byDate;
  return String(b.loadedAt || b.id || "").localeCompare(
    String(a.loadedAt || a.id || ""),
    "it",
    { numeric: true, sensitivity: "base" }
  );
}

export function getLatestListoneForSeasonV787(listoni = [], seasonId = "") {
  const targetSeason = String(seasonId || "").trim();
  if (!targetSeason) return null;
  return [...(Array.isArray(listoni) ? listoni : [])]
    .filter((listone) => {
      const itemSeason = String(listone?.seasonId || listone?.meta?.seasonId || "").trim();
      return itemSeason === targetSeason && !listone?.loadError && Array.isArray(listone?.players);
    })
    .sort(compareListoniByDateDescV787)[0] || null;
}

function playerNameCandidatesV787(player = {}) {
  return [
    player.playerName,
    player.name,
    player.displayName,
    player.canonicalName,
    player.listonePlayerNameV787,
    player.listonePlayerNameV786
  ]
    .map(normalizeRosterListoneNameV787)
    .filter(Boolean);
}

export function findPlayerInListoneV787(listone, player = {}) {
  if (!listone || !Array.isArray(listone.players)) return null;
  const candidateNames = new Set(playerNameCandidatesV787(player));
  if (!candidateNames.size) return null;

  const matches = listone.players.filter((item) => candidateNames.has(normalizeRosterListoneNameV787(item?.playerName)));
  if (matches.length <= 1) return matches[0] || null;

  // La squadra precedente viene usata solo per disambiguare omonimi. Non deve impedire
  // l'aggiornamento quando lo stesso calciatore cambia club nel nuovo listone.
  const team = normalizeRosterListoneNameV787(
    player.realTeam || player.realTeamOriginal || player.realTeamCodeV787 || player.team || ""
  );
  if (team) {
    const teamMatch = matches.find((item) => {
      const itemTeams = [item?.realTeam, item?.realTeamOriginal].map(normalizeRosterListoneNameV787);
      return itemTeams.includes(team);
    });
    if (teamMatch) return teamMatch;
  }
  return matches[0] || null;
}

export function findLatestListonePlayerForRosterPlayerV787(listoni = [], player = {}, seasonId = "") {
  const latestListone = getLatestListoneForSeasonV787(listoni, seasonId);
  return findPlayerInListoneV787(latestListone, player);
}

function isAsteriskListonePlayerV787(player = {}) {
  const raw = [player.statusCode, player.status, player.sourceSheet]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  return raw.includes("ASTER") || raw.includes("CEDUT") || raw.includes("*");
}

export function getRosterListoneStatusV787(listoni = [], player = {}, seasonId = "") {
  const latestListone = getLatestListoneForSeasonV787(listoni, seasonId);
  const listonePlayer = findPlayerInListoneV787(latestListone, player);
  const isAsterisk = !listonePlayer || isAsteriskListonePlayerV787(listonePlayer);
  return {
    code: isAsterisk ? "ASTERISCATO" : "IN_LISTONE",
    label: isAsterisk ? "Asteriscato" : "In listone",
    className: isAsterisk ? "status-warning" : "status-ok",
    latestListone,
    listonePlayer
  };
}

export function getRosterRoleOrderV787(player = {}) {
  const raw = String(player?.classicRole || player?.rosterRole || player?.role || "").trim().toUpperCase();
  const primary = raw.charAt(0);
  return ({ P: 1, D: 2, C: 3, A: 4 })[primary] || 99;
}

export function compareRosterPlayersByRoleV787(a = {}, b = {}) {
  const roleDiff = getRosterRoleOrderV787(a) - getRosterRoleOrderV787(b);
  if (roleDiff) return roleDiff;
  return String(a?.playerName || "").localeCompare(String(b?.playerName || ""), "it", {
    sensitivity: "base",
    numeric: true
  });
}

export function syncRosterPlayerWithLatestListoneV787(listoni = [], player = {}, seasonId = "") {
  const status = getRosterListoneStatusV787(listoni, player, seasonId);
  const listonePlayer = status.listonePlayer;
  const base = {
    ...(player || {}),
    seasonId: player?.seasonId || seasonId || "",
    listoneStatusCodeV787: status.code,
    listoneStatusV787: status.label,
    latestListoneIdV787: status.latestListone?.id || "",
    inLatestListoneV787: status.code === "IN_LISTONE"
  };

  if (!listonePlayer) return base;

  const realTeam = String(listonePlayer.realTeam || "").trim();
  const realTeamOriginal = String(listonePlayer.realTeamOriginal || realTeam || "").trim();
  const classicRole = String(listonePlayer.classicRole || listonePlayer.role || "").trim();

  return {
    ...base,
    // Campi canonici consumati dai renderer attuali.
    realTeam: realTeam || base.realTeam || "",
    realTeamOriginal: realTeamOriginal || base.realTeamOriginal || "",
    classicRole: classicRole || base.classicRole || base.rosterRole || base.role || "",
    mantraRoles: listonePlayer.mantraRoles || listonePlayer.mantra_roles || base.mantraRoles || "",
    quotationCurrent: listonePlayer.quotationCurrent ?? listonePlayer.quotation_current ?? base.quotationCurrent ?? "",
    quotationInitial: listonePlayer.quotationInitial ?? listonePlayer.quotation_initial ?? base.quotationInitial ?? "",
    fvm: listonePlayer.fvm ?? base.fvm ?? "",
    fantacalcioId: listonePlayer.fantacalcioId || listonePlayer.id || base.fantacalcioId || "",
    // Alias espliciti per i renderer futuri e per gli audit.
    realTeamCodeV787: realTeam || base.realTeam || "",
    realTeamNameV787: realTeamOriginal || base.realTeamOriginal || "",
    listonePlayerNameV787: listonePlayer.playerName || base.playerName || "",
    listoneSourceStatusV787: listonePlayer.statusCode || listonePlayer.status || ""
  };
}
