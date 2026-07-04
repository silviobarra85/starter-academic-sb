// V506 - Motore comune per tool statici multi-lega.
// Integra i validatori comuni V506 mantenendo compatibilita con UI V473.
// Il file non scrive su Firebase e non contiene dati/brand/service specifici di lega.
import { clampIntegerV506, parseIntegerTokensV506, uniqueSortedIntegersV506, escapeHtmlV506 as escapeHtmlSharedV506 } from '../core/form-validators-v506.js';
export const TOOL_ENGINE_VERSION_V506 = 'V506';
export const MATCHDAY_DRAW_ENGINE_VERSION_V506 = 'V506';

export function clampMatchdayV506(value, min = 1, max = 38) {
  return clampIntegerV506(value, min, max, min);
}

export function parseMatchdayTokensV506(raw, options = {}) {
  const min = Number.isFinite(options.min) ? options.min : 1;
  const max = Number.isFinite(options.max) ? options.max : 38;
  return parseIntegerTokensV506(raw, { min, max, allowRanges: true, clamp: true });
}

export function hashSeedV506(seed) {
  const text = String(seed || '');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 0x9e3779b9;
}

export function createRngV506(seed) {
  let state = hashSeedV506(seed);
  return function nextRandom() {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) / 4294967296);
  };
}

export function shuffleWithSeedV506(values, seed) {
  const rng = createRngV506(seed);
  const items = [...values];
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

export function buildMatchdayDrawV506(settings) {
  const min = Number.isFinite(settings?.min) ? settings.min : 1;
  const max = Number.isFinite(settings?.max) ? settings.max : 38;
  const count = clampMatchdayV506(settings?.count, min, max);
  const from = Math.min(clampMatchdayV506(settings?.from, min, max), clampMatchdayV506(settings?.to, min, max));
  const to = Math.max(clampMatchdayV506(settings?.from, min, max), clampMatchdayV506(settings?.to, min, max));
  const excluded = Array.isArray(settings?.excluded)
    ? uniqueSortedIntegersV506(settings.excluded, { min, max })
    : parseMatchdayTokensV506(settings?.excluded, { min, max });
  const allInRange = [];
  for (let value = from; value <= to; value += 1) allInRange.push(value);
  const excludedInRange = Array.from(new Set(excluded.filter((value) => value >= from && value <= to))).sort((a, b) => a - b);
  const available = allInRange.filter((value) => !excludedInRange.includes(value));
  const seed = String(settings?.seed || '').trim() || buildSeedV506(settings?.leagueSlug || 'lega');
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
  const drawn = shuffleWithSeedV506(available, seed).slice(0, count).sort((a, b) => a - b);
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

export function buildSeedV506(leagueSlug = 'lega', version = '506') {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${leagueSlug}-V${version}-${stamp}-${entropy}`;
}

export function escapeHtmlV506(value) {
  return escapeHtmlSharedV506(value);
}

function getLeagueSlugV506(options = {}) {
  if (options.leagueSlug) return String(options.leagueSlug);
  const path = String(window.location?.pathname || '');
  if (path.includes('/fantapetillomantramanager/')) return 'fantapetillomantramanager';
  if (path.includes('/zonaorientale/')) return 'zonaorientale';
  return document.body?.dataset?.leagueSlug || 'lega';
}

function byIdV506(id) {
  return document.getElementById(id);
}

function setStatusV506(message, isError = false, ids = {}) {
  const status = byIdV506(ids.status || 'matchdayDrawStatusV473');
  if (!status) return;
  status.textContent = message || '';
  status.classList.toggle('matchday-draw-error-v473', Boolean(isError));
}

function updateRangeLabelsV506(ids = {}) {
  const minInput = byIdV506(ids.rangeMin || 'matchdayRangeMinV473');
  const maxInput = byIdV506(ids.rangeMax || 'matchdayRangeMaxV473');
  const minLabel = byIdV506(ids.rangeMinLabel || 'matchdayRangeMinLabelV473');
  const maxLabel = byIdV506(ids.rangeMaxLabel || 'matchdayRangeMaxLabelV473');
  const rangeText = byIdV506(ids.allowedRangeText || 'matchdayAllowedRangeTextV473');
  if (!minInput || !maxInput) return;
  let min = clampMatchdayV506(minInput.value, 1, 38);
  let max = clampMatchdayV506(maxInput.value, 1, 38);
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

function collectSettingsV506(options = {}) {
  const ids = options.ids || {};
  updateRangeLabelsV506(ids);
  const count = clampMatchdayV506(byIdV506(ids.count || 'matchdayDrawCountV473')?.value, 1, 38);
  const rangeMin = clampMatchdayV506(byIdV506(ids.rangeMin || 'matchdayRangeMinV473')?.value, 1, 38);
  const rangeMax = clampMatchdayV506(byIdV506(ids.rangeMax || 'matchdayRangeMaxV473')?.value, 1, 38);
  let seed = String(byIdV506(ids.seed || 'matchdaySeedV473')?.value || '').trim();
  if (!seed) {
    seed = buildSeedV506(getLeagueSlugV506(options), options.seedVersion || '506');
    const seedInput = byIdV506(ids.seed || 'matchdaySeedV473');
    if (seedInput) seedInput.value = seed;
  }
  return {
    count,
    from: rangeMin,
    to: rangeMax,
    excluded: byIdV506(ids.exclude || 'matchdayExcludeV473')?.value || '',
    seed,
    leagueSlug: getLeagueSlugV506(options)
  };
}

function buildPayloadV506(result, options = {}) {
  return {
    tool: 'sorteggio-giornate',
    version: MATCHDAY_DRAW_ENGINE_VERSION_V506,
    legacyUi: options.legacyUiVersion || 'V473',
    validators: 'V506',
    league: getLeagueSlugV506(options),
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

function renderResultV506(result, options = {}) {
  const ids = options.ids || {};
  const output = byIdV506(ids.output || 'matchdayDrawOutputV473');
  const code = byIdV506(ids.json || 'matchdayDrawJsonV473');
  if (!output || !code) return;
  const excludedText = result.excludedInRange.length ? result.excludedInRange.join(', ') : 'nessuna';
  const listItems = result.drawn.map((value, index) => `<li><span>${index + 1}.</span><strong>Giornata ${value}</strong></li>`).join('');
  output.innerHTML = `
    <div class="matchday-draw-summary-v473">
      <span class="matchday-seed-pill-v473">Seed</span>
      <code>${escapeHtmlV506(result.seed)}</code>
    </div>
    <p class="muted">Range ${result.from}-${result.to}; escluse: ${escapeHtmlV506(excludedText)}; disponibili: ${result.availableCount}.</p>
    <ul class="matchday-list-v473">${listItems}</ul>
  `;
  code.value = JSON.stringify(buildPayloadV506(result, options), null, 2);
  code.removeAttribute('hidden');
  const leagueSlug = getLeagueSlugV506(options);
  try {
    window.localStorage?.setItem(`matchdayDrawV506:${leagueSlug}`, code.value);
    window.localStorage?.setItem(`matchdayDrawV473:${leagueSlug}`, code.value);
  } catch (error) {
    console.warn('Salvataggio locale sorteggio V506 non disponibile', error);
  }
}

async function copyResultV506(options = {}) {
  const ids = options.ids || {};
  const code = byIdV506(ids.json || 'matchdayDrawJsonV473');
  const value = code?.value || '';
  if (!value) {
    setStatusV506('Nessun sorteggio da copiare.', true, ids);
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    setStatusV506('Risultato copiato negli appunti.', false, ids);
  } catch (error) {
    code?.focus();
    code?.select();
    setStatusV506('Copia automatica non riuscita: seleziona il JSON e copialo manualmente.', true, ids);
  }
}

function restoreLastResultV506(options = {}) {
  const ids = options.ids || {};
  const code = byIdV506(ids.json || 'matchdayDrawJsonV473');
  if (!code) return;
  const leagueSlug = getLeagueSlugV506(options);
  try {
    const saved = window.localStorage?.getItem(`matchdayDrawV506:${leagueSlug}`) || window.localStorage?.getItem(`matchdayDrawV473:${leagueSlug}`);
    if (!saved) return;
    code.value = saved;
    code.removeAttribute('hidden');
  } catch (error) {
    console.warn('Ripristino locale sorteggio V506 non disponibile', error);
  }
}

export function createMatchdayDrawEngineV506(options = {}) {
  const ids = options.ids || {};
  return {
    version: MATCHDAY_DRAW_ENGINE_VERSION_V506,
    parseMatchdayTokens: parseMatchdayTokensV506,
    buildDraw: buildMatchdayDrawV506,
    shuffleWithSeed: shuffleWithSeedV506,
    generateSeed: () => buildSeedV506(getLeagueSlugV506(options), options.seedVersion || '506'),
    init() {
      const form = byIdV506(ids.form || 'matchdayDrawFormV473');
      if (!form || form.dataset.initializedV506 === 'true') return;
      form.dataset.initializedV506 = 'true';
      form.dataset.fantaEngineTool = 'matchday-draw-v506';
      [ids.rangeMin || 'matchdayRangeMinV473', ids.rangeMax || 'matchdayRangeMaxV473'].forEach((id) => {
        byIdV506(id)?.addEventListener('input', () => updateRangeLabelsV506(ids));
      });
      byIdV506(ids.seedGenerate || 'matchdaySeedGenerateV473')?.addEventListener('click', () => {
        const seedInput = byIdV506(ids.seed || 'matchdaySeedV473');
        if (seedInput) seedInput.value = buildSeedV506(getLeagueSlugV506(options), options.seedVersion || '506');
        setStatusV506('Nuovo seed generato.', false, ids);
      });
      byIdV506(ids.copyResult || 'matchdayCopyResultV473')?.addEventListener('click', () => copyResultV506(options));
      form.addEventListener('submit', (event) => {
        event?.preventDefault();
        const result = buildMatchdayDrawV506(collectSettingsV506(options));
        if (!result.ok) {
          setStatusV506(result.error, true, ids);
          return;
        }
        renderResultV506(result, options);
        setStatusV506('Sorteggio completato. Conserva seed e JSON per riprodurlo.', false, ids);
      });
      updateRangeLabelsV506(ids);
      restoreLastResultV506(options);
      window.FantaEngineToolRuntimeV506 = window.FantaEngineToolRuntimeV506 || {};
      window.FantaEngineToolRuntimeV506.matchdayDraw = {
        version: MATCHDAY_DRAW_ENGINE_VERSION_V506,
        leagueSlug: getLeagueSlugV506(options),
        mode: 'central-engine-with-local-wrapper'
      };
    }
  };
}

export function initMatchdayDrawToolV506(options = {}) {
  const engine = createMatchdayDrawEngineV506(options);
  const start = () => engine.init();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  return engine;
}
