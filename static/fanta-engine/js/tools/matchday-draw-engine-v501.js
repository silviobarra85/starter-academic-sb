// V501 - Motore comune per tool statici multi-lega.
// Primo tool centralizzato: Sorteggio giornate.
// Il file non scrive su Firebase e non contiene dati/brand/service specifici di lega.
export const TOOL_ENGINE_VERSION_V501 = 'V501';
export const MATCHDAY_DRAW_ENGINE_VERSION_V501 = 'V501';

export function clampMatchdayV501(value, min = 1, max = 38) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

export function parseMatchdayTokensV501(raw, options = {}) {
  const min = Number.isFinite(options.min) ? options.min : 1;
  const max = Number.isFinite(options.max) ? options.max : 38;
  const text = String(raw || '').trim();
  if (!text) return [];
  const values = [];
  const tokens = text.split(/[\s,;]+/).map((token) => token.trim()).filter(Boolean);
  tokens.forEach((token) => {
    const rangeMatch = token.match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
    if (rangeMatch) {
      const start = clampMatchdayV501(rangeMatch[1], min, max);
      const end = clampMatchdayV501(rangeMatch[2], min, max);
      const from = Math.min(start, end);
      const to = Math.max(start, end);
      for (let value = from; value <= to; value += 1) values.push(value);
      return;
    }
    const number = Number.parseInt(token, 10);
    if (Number.isFinite(number)) values.push(clampMatchdayV501(number, min, max));
  });
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

export function hashSeedV501(seed) {
  const text = String(seed || '');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 0x9e3779b9;
}

export function createRngV501(seed) {
  let state = hashSeedV501(seed);
  return function nextRandom() {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) / 4294967296);
  };
}

export function shuffleWithSeedV501(values, seed) {
  const rng = createRngV501(seed);
  const items = [...values];
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

export function buildMatchdayDrawV501(settings) {
  const min = Number.isFinite(settings?.min) ? settings.min : 1;
  const max = Number.isFinite(settings?.max) ? settings.max : 38;
  const count = clampMatchdayV501(settings?.count, min, max);
  const from = Math.min(clampMatchdayV501(settings?.from, min, max), clampMatchdayV501(settings?.to, min, max));
  const to = Math.max(clampMatchdayV501(settings?.from, min, max), clampMatchdayV501(settings?.to, min, max));
  const excluded = Array.isArray(settings?.excluded)
    ? settings.excluded.map((value) => clampMatchdayV501(value, min, max))
    : parseMatchdayTokensV501(settings?.excluded, { min, max });
  const allInRange = [];
  for (let value = from; value <= to; value += 1) allInRange.push(value);
  const excludedInRange = Array.from(new Set(excluded.filter((value) => value >= from && value <= to))).sort((a, b) => a - b);
  const available = allInRange.filter((value) => !excludedInRange.includes(value));
  const seed = String(settings?.seed || '').trim() || buildSeedV501(settings?.leagueSlug || 'lega');
  if (count > available.length) {
    return {
      ok: false,
      error: `Impossibile sorteggiare ${count} giornate: disponibili ${available.length} dopo range/esclusioni.`,
      count,
      from,
      to,
      excluded,
      excludedInRange,
      available,
      seed,
      availableCount: available.length,
      drawn: []
    };
  }
  const drawn = shuffleWithSeedV501(available, seed).slice(0, count).sort((a, b) => a - b);
  return {
    ok: true,
    count,
    from,
    to,
    excluded,
    excludedInRange,
    available,
    seed,
    availableCount: available.length,
    drawn
  };
}

export function buildSeedV501(leagueSlug = 'lega', version = '501') {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${leagueSlug}-V${version}-${stamp}-${entropy}`;
}

export function escapeHtmlV501(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function getLeagueSlugV501(options = {}) {
  if (options.leagueSlug) return String(options.leagueSlug);
  const path = String(window.location?.pathname || '');
  if (path.includes('/fantapetillomantramanager/')) return 'fantapetillomantramanager';
  if (path.includes('/zonaorientale/')) return 'zonaorientale';
  return document.body?.dataset?.leagueSlug || 'lega';
}

function byIdV501(id) {
  return document.getElementById(id);
}

function setStatusV501(message, isError = false, ids = {}) {
  const status = byIdV501(ids.status || 'matchdayDrawStatusV473');
  if (!status) return;
  status.textContent = message || '';
  status.classList.toggle('matchday-draw-error-v473', Boolean(isError));
}

function updateRangeLabelsV501(ids = {}) {
  const minInput = byIdV501(ids.rangeMin || 'matchdayRangeMinV473');
  const maxInput = byIdV501(ids.rangeMax || 'matchdayRangeMaxV473');
  const minLabel = byIdV501(ids.rangeMinLabel || 'matchdayRangeMinLabelV473');
  const maxLabel = byIdV501(ids.rangeMaxLabel || 'matchdayRangeMaxLabelV473');
  const rangeText = byIdV501(ids.allowedRangeText || 'matchdayAllowedRangeTextV473');
  if (!minInput || !maxInput) return;
  let min = clampMatchdayV501(minInput.value, 1, 38);
  let max = clampMatchdayV501(maxInput.value, 1, 38);
  if (min > max) {
    if (document.activeElement === minInput) max = min;
    else min = max;
  }
  minInput.value = String(min);
  maxInput.value = String(max);
  if (minLabel) minLabel.textContent = String(min);
  if (maxLabel) maxLabel.textContent = String(max);
  if (rangeText) rangeText.textContent = `${min}-${max}`;
}

function collectSettingsV501(options = {}) {
  const ids = options.ids || {};
  updateRangeLabelsV501(ids);
  const count = clampMatchdayV501(byIdV501(ids.count || 'matchdayDrawCountV473')?.value, 1, 38);
  const rangeMin = clampMatchdayV501(byIdV501(ids.rangeMin || 'matchdayRangeMinV473')?.value, 1, 38);
  const rangeMax = clampMatchdayV501(byIdV501(ids.rangeMax || 'matchdayRangeMaxV473')?.value, 1, 38);
  let seed = String(byIdV501(ids.seed || 'matchdaySeedV473')?.value || '').trim();
  if (!seed) {
    seed = buildSeedV501(getLeagueSlugV501(options), options.seedVersion || '501');
    const seedInput = byIdV501(ids.seed || 'matchdaySeedV473');
    if (seedInput) seedInput.value = seed;
  }
  return {
    count,
    from: rangeMin,
    to: rangeMax,
    excluded: byIdV501(ids.exclude || 'matchdayExcludeV473')?.value || '',
    seed,
    leagueSlug: getLeagueSlugV501(options)
  };
}

function buildPayloadV501(result, options = {}) {
  return {
    tool: 'sorteggio-giornate',
    version: MATCHDAY_DRAW_ENGINE_VERSION_V501,
    legacyUi: options.legacyUiVersion || 'V473',
    league: getLeagueSlugV501(options),
    generatedAt: new Date().toISOString(),
    settings: {
      requestedCount: result.count,
      range: [result.from, result.to],
      excluded: result.excludedInRange,
      seed: result.seed
    },
    result: result.drawn
  };
}

function renderResultV501(result, options = {}) {
  const ids = options.ids || {};
  const output = byIdV501(ids.output || 'matchdayDrawOutputV473');
  const code = byIdV501(ids.json || 'matchdayDrawJsonV473');
  if (!output || !code) return;
  const excludedText = result.excludedInRange.length ? result.excludedInRange.join(', ') : 'nessuna';
  const listItems = result.drawn.map((value, index) => `<li><span>${index + 1}.</span><strong>Giornata ${value}</strong></li>`).join('');
  output.innerHTML = `
    <div class="matchday-draw-summary-v473">
      <span class="matchday-seed-pill-v473">Seed</span>
      <code>${escapeHtmlV501(result.seed)}</code>
    </div>
    <p class="muted">Range ${result.from}-${result.to}; escluse: ${escapeHtmlV501(excludedText)}; disponibili: ${result.availableCount}.</p>
    <ul class="matchday-list-v473">${listItems}</ul>
  `;
  code.value = JSON.stringify(buildPayloadV501(result, options), null, 2);
  code.removeAttribute('hidden');
  const leagueSlug = getLeagueSlugV501(options);
  try {
    window.localStorage?.setItem(`matchdayDrawV501:${leagueSlug}`, code.value);
    window.localStorage?.setItem(`matchdayDrawV473:${leagueSlug}`, code.value);
  } catch (error) {
    console.warn('Salvataggio locale sorteggio V501 non disponibile', error);
  }
}

async function copyResultV501(options = {}) {
  const ids = options.ids || {};
  const code = byIdV501(ids.json || 'matchdayDrawJsonV473');
  const value = code?.value || '';
  if (!value) {
    setStatusV501('Nessun sorteggio da copiare.', true, ids);
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    setStatusV501('Risultato copiato negli appunti.', false, ids);
  } catch (error) {
    code?.focus();
    code?.select();
    setStatusV501('Copia automatica non riuscita: seleziona il JSON e copialo manualmente.', true, ids);
  }
}

function restoreLastResultV501(options = {}) {
  const ids = options.ids || {};
  const code = byIdV501(ids.json || 'matchdayDrawJsonV473');
  if (!code) return;
  const leagueSlug = getLeagueSlugV501(options);
  try {
    const saved = window.localStorage?.getItem(`matchdayDrawV501:${leagueSlug}`) || window.localStorage?.getItem(`matchdayDrawV473:${leagueSlug}`);
    if (!saved) return;
    code.value = saved;
    code.removeAttribute('hidden');
  } catch (error) {
    console.warn('Ripristino locale sorteggio V501 non disponibile', error);
  }
}

export function createMatchdayDrawEngineV501(options = {}) {
  const ids = options.ids || {};
  return {
    version: MATCHDAY_DRAW_ENGINE_VERSION_V501,
    parseMatchdayTokens: parseMatchdayTokensV501,
    buildDraw: buildMatchdayDrawV501,
    shuffleWithSeed: shuffleWithSeedV501,
    generateSeed: () => buildSeedV501(getLeagueSlugV501(options), options.seedVersion || '501'),
    init() {
      const form = byIdV501(ids.form || 'matchdayDrawFormV473');
      if (!form || form.dataset.initializedV501 === 'true') return;
      form.dataset.initializedV501 = 'true';
      form.dataset.fantaEngineTool = 'matchday-draw-v501';
      [ids.rangeMin || 'matchdayRangeMinV473', ids.rangeMax || 'matchdayRangeMaxV473'].forEach((id) => {
        byIdV501(id)?.addEventListener('input', () => updateRangeLabelsV501(ids));
      });
      byIdV501(ids.seedGenerate || 'matchdaySeedGenerateV473')?.addEventListener('click', () => {
        const seedInput = byIdV501(ids.seed || 'matchdaySeedV473');
        if (seedInput) seedInput.value = buildSeedV501(getLeagueSlugV501(options), options.seedVersion || '501');
        setStatusV501('Nuovo seed generato.', false, ids);
      });
      byIdV501(ids.copyResult || 'matchdayCopyResultV473')?.addEventListener('click', () => copyResultV501(options));
      form.addEventListener('submit', (event) => {
        event?.preventDefault();
        const result = buildMatchdayDrawV501(collectSettingsV501(options));
        if (!result.ok) {
          setStatusV501(result.error, true, ids);
          return;
        }
        renderResultV501(result, options);
        setStatusV501('Sorteggio completato. Conserva seed e JSON per riprodurlo.', false, ids);
      });
      updateRangeLabelsV501(ids);
      restoreLastResultV501(options);
      window.FantaEngineToolRuntimeV501 = window.FantaEngineToolRuntimeV501 || {};
      window.FantaEngineToolRuntimeV501.matchdayDraw = {
        version: MATCHDAY_DRAW_ENGINE_VERSION_V501,
        leagueSlug: getLeagueSlugV501(options),
        mode: 'central-engine-with-local-wrapper'
      };
    }
  };
}

export function initMatchdayDrawToolV501(options = {}) {
  const engine = createMatchdayDrawEngineV501(options);
  const start = () => engine.init();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  return engine;
}
