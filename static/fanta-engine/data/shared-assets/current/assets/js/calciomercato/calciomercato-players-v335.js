/*
 * V335 - Helper associazione articoli Calciomercato -> giocatori Listone.
 * Refactor protetto: modulo puro, senza fetch, senza DOM e senza scritture Firebase.
 */

const PLAYER_STOP_WORDS_V335 = new Set([
  "il", "lo", "la", "i", "gli", "le", "un", "uno", "una",
  "di", "del", "dello", "della", "dei", "degli", "delle", "da", "dal", "dalla",
  "a", "al", "alla", "ai", "agli", "alle", "in", "con", "per", "su", "tra", "fra",
  "e", "o", "ma", "non", "si", "no", "via", "piu", "meno", "calcio", "mercato",
  "roma", "milan", "inter", "lazio", "como", "parma", "genoa", "torino", "napoli"
]);

function identityNormalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function defaultDecode(value) {
  return String(value || "");
}

function normalizeTokenList(value, normalizeValue) {
  return normalizeValue(value).split(" ").filter(Boolean);
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
    if (surname && surname.length >= 5 && !PLAYER_STOP_WORDS_V335.has(surname)) {
      surnameCounts.set(surname, (surnameCounts.get(surname) || 0) + 1);
    }
  });

  return players
    .map((player) => {
      const displayName = getPlayerDisplayName(player);
      const key = getPlayerKey(player, normalizeValue);
      const tokens = normalizeTokenList(displayName, normalizeValue);
      if (!displayName || !key || !tokens.length) return null;
      const aliases = [{ value: key, score: 100, type: "full-name" }];
      const surname = tokens[tokens.length - 1] || "";
      if (surname && surname.length >= 5 && surnameCounts.get(surname) === 1 && !PLAYER_STOP_WORDS_V335.has(surname)) {
        aliases.push({ value: surname, score: 62, type: "unique-surname" });
      }
      if (tokens.length >= 3) {
        const lastTwo = tokens.slice(-2).join(" ");
        if (lastTwo.length >= 7) aliases.push({ value: lastTwo, score: 78, type: "compound-surname" });
      }
      return {
        player,
        key,
        slug: slugifyPlayerName(displayName, normalizeValue),
        displayName,
        aliases
      };
    })
    .filter(Boolean);
}

function getArticlePlayerMatches(article, listone, options = {}) {
  const normalizeValue = options.normalizeValue || identityNormalize;
  const decodeText = options.decodeText || defaultDecode;
  const limit = Number.isFinite(options.limit) ? options.limit : 4;
  const normalizedArticleText = normalizeValue(getArticleText(article, { ...options, decodeText }));
  if (!normalizedArticleText) return [];
  const index = buildPlayerAliasIndex(listone, { normalizeValue });
  const matches = [];
  index.forEach((entry) => {
    const matchedAliases = entry.aliases.filter((alias) => textContainsNormalizedPhrase(normalizedArticleText, alias.value));
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

export function createCalciomercatoPlayerHelpersV335(dependencies = {}) {
  const normalizeValue = dependencies.normalizeValue || identityNormalize;
  const decodeText = dependencies.decodeText || defaultDecode;
  return {
    version: "V335",
    normalizeValue,
    decodeText,
    slugifyPlayerName: (name) => slugifyPlayerName(name, normalizeValue),
    buildPlayerAliasIndex: (listone) => buildPlayerAliasIndex(listone, { normalizeValue }),
    getArticlePlayerMatches: (article, listone, options = {}) => getArticlePlayerMatches(article, listone, { ...options, normalizeValue, decodeText }),
    getArticlesForPlayer: (articles, listone, playerKey, options = {}) => getArticlesForPlayer(articles, listone, playerKey, { ...options, normalizeValue, decodeText }),
    findPlayerBySlug: (listone, slug) => findPlayerBySlug(listone, slug, { normalizeValue }),
    getListoneId
  };
}
