/*
 * V359 - Helper associazione articoli Calciomercato -> giocatori Listone.
 * Evoluzione protetta del matching V340: mantiene punteggiatura/maiuscole,
 * aggiunge alias sicuri, forma compatta dei nomi con apostrofi/spazi e diagnostica
 * articoli associati/non associati. Nessun accesso a Firebase, feed o archivio.
 */

const PLAYER_STOP_WORDS_V359 = new Set([
  "il", "lo", "la", "i", "gli", "le", "un", "uno", "una",
  "di", "del", "dello", "della", "dei", "degli", "delle", "da", "dal", "dalla",
  "a", "al", "alla", "ai", "agli", "alle", "in", "con", "per", "su", "tra", "fra",
  "e", "o", "ma", "non", "si", "no", "via", "piu", "meno", "calcio", "mercato",
  "roma", "milan", "inter", "lazio", "como", "parma", "genoa", "torino", "napoli"
]);

const PLAYER_PUNCTUATION_RE_V359 = /[^a-z0-9]+/g;
const PLAYER_HTML_TAG_RE_V359 = /<[^>]*>/g;

function identityNormalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(PLAYER_PUNCTUATION_RE_V359, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function defaultDecode(value) {
  return String(value || "");
}

function createPlayerMatchNormalizer(normalizeValue) {
  const baseNormalize = typeof normalizeValue === "function" ? normalizeValue : identityNormalize;
  return (value) => {
    const normalized = baseNormalize(value);
    return String(normalized || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(PLAYER_HTML_TAG_RE_V359, " ")
      .replace(/[’'`´]/g, " ")
      .replace(PLAYER_PUNCTUATION_RE_V359, " ")
      .replace(/\s+/g, " ")
      .trim();
  };
}

function normalizeTokenList(value, normalizeValue) {
  return normalizeValue(value).split(" ").filter(Boolean);
}


function normalizePlayerAliasListV359(value) {
  if (Array.isArray(value)) return value.flatMap(normalizePlayerAliasListV359);
  if (value && typeof value === "object") {
    return normalizePlayerAliasListV359(value.name || value.label || value.value || value.alias || "");
  }
  return String(value || "")
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getPlayerConfiguredAliasesV359(player) {
  const fields = [
    player?.alias,
    player?.aliases,
    player?.nickname,
    player?.nicknames,
    player?.alternativeNames,
    player?.alternateNames,
    player?.aka,
    player?.knownAs,
    player?.shortName,
    player?.nomeBreve
  ];
  return fields.flatMap(normalizePlayerAliasListV359);
}

function compactPlayerAliasV359(value) {
  return String(value || "").replace(/\s+/g, "");
}

function pushPlayerAliasV359(aliases, value, score, type, options = {}) {
  const normalized = String(value || "").trim();
  if (!normalized) return;
  const tokens = normalized.split(" ").filter(Boolean);
  if (!tokens.length) return;
  if (tokens.length === 1) {
    const token = tokens[0];
    if (token.length < 4) return;
    if (PLAYER_STOP_WORDS_V359.has(token)) return;
  }
  const compact = compactPlayerAliasV359(normalized);
  aliases.push({ value: normalized, score, type, configured: Boolean(options.configured) });
  if (compact && compact !== normalized && compact.length >= 5 && !PLAYER_STOP_WORDS_V359.has(compact)) {
    aliases.push({ value: compact, score: Math.max(45, score - 8), type: `${type}-compact`, configured: Boolean(options.configured) });
  }
}

function dedupePlayerAliasesV359(aliases) {
  const bestByValue = new Map();
  aliases.forEach((alias) => {
    const key = String(alias?.value || "").trim();
    if (!key) return;
    const current = bestByValue.get(key);
    if (!current || Number(alias.score || 0) > Number(current.score || 0)) {
      bestByValue.set(key, alias);
    }
  });
  return Array.from(bestByValue.values()).sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
}

function getPlayerDisplayName(player) {
  return String(player?.playerName || player?.name || player?.nome || player?.calciatore || "").trim();
}

function getPlayerKey(player, normalizeValue) {
  return normalizeValue(getPlayerDisplayName(player));
}

function getListonePlayers(listone) {
  return Array.isArray(listone?.players) ? listone.players.filter(Boolean) : [];
}

function getListoneId(listone) {
  return String(listone?.id || listone?.meta?.id || listone?.loadedAt || listone?.meta?.loadedAt || "").trim();
}

function slugifyPlayerName(name, normalizeValue) {
  return normalizeValue(name).replace(/\s+/g, "-");
}

function buildWordRegex(normalizedPhrase) {
  const parts = String(normalizedPhrase || "").split(" ").filter(Boolean).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!parts.length) return null;
  return new RegExp(`(^|\\s)${parts.join("\\s+")}(?=\\s|$)`, "i");
}

function textContainsNormalizedPhrase(normalizedText, normalizedPhrase) {
  const regex = buildWordRegex(normalizedPhrase);
  return regex ? regex.test(normalizedText) : false;
}

function stripPlayerMatchDiacritics(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function tokenizeRawArticleTextForCaseChecks(rawText, normalizeValue) {
  return String(rawText || "")
    .replace(PLAYER_HTML_TAG_RE_V359, " ")
    .split(/[^A-Za-zÀ-ÖØ-öø-ÿ0-9]+/)
    .map((token) => String(token || "").trim())
    .filter(Boolean)
    .map((token) => ({
      raw: token,
      normalized: normalizeValue(token),
      startsWithUppercase: /^[A-ZÀ-ÖØ-Þ]/.test(stripPlayerMatchDiacritics(token))
    }));
}

function aliasRequiresCapitalizedHit(alias) {
  const tokens = String(alias?.value || "").split(" ").filter(Boolean);
  return tokens.length === 1 && tokens[0].length >= 5;
}

function articleHasCapitalizedSingleTokenAlias(rawTokens, alias) {
  const normalizedAlias = String(alias?.value || "").trim();
  if (!normalizedAlias) return false;
  return rawTokens.some((token) => token.normalized === normalizedAlias && token.startsWithUppercase);
}

function getArticleText(article, options = {}) {
  const decodeText = options.decodeText || defaultDecode;
  const existingPlayers = Array.isArray(options.existingPlayers) ? options.existingPlayers : [];
  const parts = [
    article?.title,
    article?.headline,
    article?.description,
    article?.summary,
    article?.excerpt,
    article?.contentSnippet,
    article?.content,
    article?.url,
    article?.sourceName,
    article?.source,
    article?.sourceLabel,
    article?.topic,
    article?.category,
    article?.categoria,
    ...(Array.isArray(article?.tags) ? article.tags : []),
    ...(Array.isArray(article?.players) ? article.players : []),
    ...(Array.isArray(article?.giocatori) ? article.giocatori : []),
    ...(Array.isArray(article?.playerNames) ? article.playerNames : []),
    ...(Array.isArray(article?.interestedPlayers) ? article.interestedPlayers : []),
    ...(Array.isArray(article?.detectedPlayers) ? article.detectedPlayers : []),
    ...(Array.isArray(article?.recognizedPlayers) ? article.recognizedPlayers : []),
    ...(Array.isArray(article?.inferredPlayers) ? article.inferredPlayers : []),
    ...(Array.isArray(article?.people) ? article.people : []),
    ...(Array.isArray(article?.entities?.players) ? article.entities.players : []),
    ...(Array.isArray(article?.entities?.people) ? article.entities.people : []),
    ...existingPlayers
  ];
  return parts.map((part) => decodeText(part)).join(" ");
}

function buildPlayerAliasIndex(listone, options = {}) {
  const normalizeValue = options.normalizeValue || identityNormalize;
  const players = getListonePlayers(listone);
  const surnameCounts = new Map();

  players.forEach((player) => {
    const tokens = normalizeTokenList(getPlayerDisplayName(player), normalizeValue);
    const surname = tokens[tokens.length - 1] || "";
    if (surname && surname.length >= 5 && !PLAYER_STOP_WORDS_V359.has(surname)) {
      surnameCounts.set(surname, (surnameCounts.get(surname) || 0) + 1);
    }
  });

  return players
    .map((player) => {
      const displayName = getPlayerDisplayName(player);
      const key = getPlayerKey(player, normalizeValue);
      const tokens = normalizeTokenList(displayName, normalizeValue);
      if (!displayName || !key || !tokens.length) return null;
      const aliases = [];
      pushPlayerAliasV359(aliases, key, 100, "full-name");
      const compactFullName = compactPlayerAliasV359(tokens.join(" "));
      if (compactFullName && compactFullName !== key && compactFullName.length >= 5) {
        pushPlayerAliasV359(aliases, compactFullName, 88, "compact-full-name");
      }
      const surname = tokens[tokens.length - 1] || "";
      if (surname && surname.length >= 5 && surnameCounts.get(surname) === 1 && !PLAYER_STOP_WORDS_V359.has(surname)) {
        pushPlayerAliasV359(aliases, surname, 62, "unique-surname");
      }
      if (tokens.length >= 3) {
        const lastTwo = tokens.slice(-2).join(" ");
        if (lastTwo.length >= 7) pushPlayerAliasV359(aliases, lastTwo, 78, "compound-surname");
      }
      getPlayerConfiguredAliasesV359(player).forEach((alias) => {
        const normalizedAlias = normalizeValue(alias);
        if (normalizedAlias && normalizedAlias !== key) pushPlayerAliasV359(aliases, normalizedAlias, 82, "configured-alias", { configured: true });
      });
      return {
        player,
        key,
        slug: slugifyPlayerName(displayName, normalizeValue),
        displayName,
        aliases: dedupePlayerAliasesV359(aliases)
      };
    })
    .filter(Boolean);
}

function getArticlePlayerMatches(article, listone, options = {}) {
  const normalizeValue = options.normalizeValue || identityNormalize;
  const decodeText = options.decodeText || defaultDecode;
  const limit = Number.isFinite(options.limit) ? options.limit : 4;
  const rawArticleText = getArticleText(article, { ...options, decodeText });
  const normalizedArticleText = normalizeValue(rawArticleText);
  if (!normalizedArticleText) return [];
  const rawTokens = tokenizeRawArticleTextForCaseChecks(rawArticleText, normalizeValue);
  const index = buildPlayerAliasIndex(listone, { normalizeValue });
  const matches = [];
  index.forEach((entry) => {
    const matchedAliases = entry.aliases.filter((alias) => {
      if (!textContainsNormalizedPhrase(normalizedArticleText, alias.value)) return false;
      if (!aliasRequiresCapitalizedHit(alias)) return true;
      return articleHasCapitalizedSingleTokenAlias(rawTokens, alias);
    });
    if (!matchedAliases.length) return;
    const best = matchedAliases.sort((a, b) => b.score - a.score)[0];
    matches.push({
      player: entry.player,
      playerName: entry.displayName,
      playerKey: entry.key,
      slug: entry.slug,
      matchType: best.type,
      score: best.score,
      listoneId: getListoneId(listone)
    });
  });
  return matches
    .sort((a, b) => b.score - a.score || a.playerName.localeCompare(b.playerName, "it", { sensitivity: "base" }))
    .slice(0, limit);
}

function findPlayerBySlug(listone, slug, options = {}) {
  const normalizeValue = options.normalizeValue || identityNormalize;
  const target = String(slug || "").trim();
  if (!target) return null;
  return buildPlayerAliasIndex(listone, { normalizeValue }).find((entry) => entry.slug === target || entry.key === normalizeValue(target)) || null;
}

function getArticlesForPlayer(articles, listone, playerKey, options = {}) {
  const normalizeValue = options.normalizeValue || identityNormalize;
  const target = normalizeValue(playerKey);
  if (!target) return [];
  const result = [];
  (Array.isArray(articles) ? articles : []).forEach((article) => {
    const matches = getArticlePlayerMatches(article, listone, { ...options, normalizeValue, limit: 8 });
    if (matches.some((match) => match.playerKey === target || normalizeValue(match.playerName) === target)) {
      result.push({ article, matches });
    }
  });
  return result;
}


function getArticleDiagnosticTitleV359(article) {
  return String(article?.title || article?.headline || article?.description || article?.summary || article?.url || "Articolo senza titolo").trim();
}

function getArticleDiagnosticSourceV359(article) {
  return String(article?.sourceName || article?.source || article?.sourceLabel || article?.site || article?.publisher || "Fonte non indicata").trim();
}

function buildPlayerDiagnosticsV359(articles, listone, options = {}) {
  const normalizeValue = options.normalizeValue || identityNormalize;
  const limit = Number.isFinite(options.limit) ? options.limit : 8;
  const safeArticles = Array.isArray(articles) ? articles.filter(Boolean) : [];
  const rows = safeArticles.map((article, index) => {
    const matches = getArticlePlayerMatches(article, listone, { ...options, normalizeValue, limit });
    return {
      index,
      title: getArticleDiagnosticTitleV359(article),
      source: getArticleDiagnosticSourceV359(article),
      url: String(article?.url || article?.link || "").trim(),
      matched: matches.length > 0,
      matches: matches.map((match) => ({
        playerName: match.playerName,
        matchType: match.matchType,
        score: match.score,
        slug: match.slug
      }))
    };
  });
  const matchedRows = rows.filter((row) => row.matched);
  const unmatchedRows = rows.filter((row) => !row.matched);
  const byPlayer = new Map();
  matchedRows.forEach((row) => {
    row.matches.forEach((match) => {
      const item = byPlayer.get(match.playerName) || { playerName: match.playerName, count: 0, matchTypes: new Set() };
      item.count += 1;
      item.matchTypes.add(match.matchType);
      byPlayer.set(match.playerName, item);
    });
  });
  const topPlayers = Array.from(byPlayer.values())
    .map((item) => ({ ...item, matchTypes: Array.from(item.matchTypes).sort() }))
    .sort((a, b) => b.count - a.count || a.playerName.localeCompare(b.playerName, "it", { sensitivity: "base" }))
    .slice(0, 20);
  return {
    version: "V359",
    generatedAt: new Date().toISOString(),
    listoneId: getListoneId(listone),
    totalArticles: rows.length,
    matchedArticles: matchedRows.length,
    unmatchedArticles: unmatchedRows.length,
    matchRate: rows.length ? Math.round((matchedRows.length / rows.length) * 100) : 0,
    topPlayers,
    unmatchedSample: unmatchedRows.slice(0, Number.isFinite(options.sampleLimit) ? options.sampleLimit : 25),
    rows: options.includeRows ? rows : undefined
  };
}

function runPlayerMatchingSmokeTestV359(normalizeValue) {
  const listone = {
    meta: { id: "smoke-v359" },
    players: [
      { playerName: "Kalulu" },
      { playerName: "De Bruyne" },
      { playerName: "Giovane" },
      { playerName: "N'Doye" },
      { playerName: "Kvaratskhelia", aliases: ["Kvara"] },
      { playerName: "Rossi" },
      { playerName: "Mario Rossi" }
    ]
  };
  const kalulu = getArticlePlayerMatches({ title: "Kalulu, la Juventus aspetta novita" }, listone, { normalizeValue, limit: 4 });
  const deBruyne = getArticlePlayerMatches({ title: "De Bruyne: contatti in corso" }, listone, { normalizeValue, limit: 4 });
  const ndoyeCompatto = getArticlePlayerMatches({ title: "Ndoye, il Bologna valuta il rinnovo" }, listone, { normalizeValue, limit: 4 });
  const kvaraAlias = getArticlePlayerMatches({ title: "Kvara, il Napoli blinda il talento" }, listone, { normalizeValue, limit: 4 });
  const giovaneNome = getArticlePlayerMatches({ title: "Giovane, il Napoli valuta il futuro" }, listone, { normalizeValue, limit: 4 });
  const giovaneAggettivo = getArticlePlayerMatches({ title: "Il giovane talento piace al Napoli" }, listone, { normalizeValue, limit: 4 });
  const ambiguousRossi = getArticlePlayerMatches({ title: "Rossi, offerta in arrivo" }, listone, { normalizeValue, limit: 4 });
  return {
    ok: kalulu.some((match) => match.playerName === "Kalulu")
      && deBruyne.some((match) => match.playerName === "De Bruyne")
      && giovaneNome.some((match) => match.playerName === "Giovane")
      && ndoyeCompatto.some((match) => match.playerName === "N'Doye")
      && kvaraAlias.some((match) => match.playerName === "Kvaratskhelia")
      && !giovaneAggettivo.some((match) => match.playerName === "Giovane")
      && !ambiguousRossi.some((match) => match.matchType === "unique-surname"),
    kalulu,
    deBruyne,
    giovaneNome,
    ndoyeCompatto,
    kvaraAlias,
    giovaneAggettivo,
    ambiguousRossi
  };
}

export function createCalciomercatoPlayerHelpersV359(dependencies = {}) {
  const normalizeValue = createPlayerMatchNormalizer(dependencies.normalizeValue || identityNormalize);
  const decodeText = dependencies.decodeText || defaultDecode;
  return {
    version: "V359",
    normalizeValue,
    decodeText,
    slugifyPlayerName: (name) => slugifyPlayerName(name, normalizeValue),
    buildPlayerAliasIndex: (listone) => buildPlayerAliasIndex(listone, { normalizeValue }),
    getArticlePlayerMatches: (article, listone, options = {}) => getArticlePlayerMatches(article, listone, { ...options, normalizeValue, decodeText }),
    getArticlesForPlayer: (articles, listone, playerKey, options = {}) => getArticlesForPlayer(articles, listone, playerKey, { ...options, normalizeValue, decodeText }),
    buildPlayerDiagnostics: (articles, listone, options = {}) => buildPlayerDiagnosticsV359(articles, listone, { ...options, normalizeValue, decodeText }),
    findPlayerBySlug: (listone, slug) => findPlayerBySlug(listone, slug, { normalizeValue }),
    getListoneId,
    runSmokeTest: () => runPlayerMatchingSmokeTestV359(normalizeValue)
  };
}
