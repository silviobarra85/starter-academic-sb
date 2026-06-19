// V473 - Tool sorteggio giornate con seed riproducibile.
// Modulo autonomo: non scrive su Firebase e non modifica dati di lega.
const TOOL_VERSION_V473 = '473';

function getLeagueSlugV473() {
  const path = String(window.location?.pathname || '');
  if (path.includes('/fantapetillomantramanager/')) return 'fantapetillomantramanager';
  if (path.includes('/zonaorientale/')) return 'zonaorientale';
  return document.body?.dataset?.leagueSlug || 'lega';
}

function byIdV473(id) {
  return document.getElementById(id);
}

function clampV473(value, min, max) {
  const number = Number.parseInt(value, 10);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

function parseMatchdayTokensV473(raw) {
  const text = String(raw || '').trim();
  if (!text) return [];
  const values = [];
  const tokens = text.split(/[\s,;]+/).map((token) => token.trim()).filter(Boolean);
  tokens.forEach((token) => {
    const rangeMatch = token.match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
    if (rangeMatch) {
      const start = clampV473(rangeMatch[1], 1, 38);
      const end = clampV473(rangeMatch[2], 1, 38);
      const from = Math.min(start, end);
      const to = Math.max(start, end);
      for (let value = from; value <= to; value += 1) values.push(value);
      return;
    }
    const number = Number.parseInt(token, 10);
    if (Number.isFinite(number)) values.push(clampV473(number, 1, 38));
  });
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

function hashSeedV473(seed) {
  const text = String(seed || '');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0 || 0x9e3779b9;
}

function createRngV473(seed) {
  let state = hashSeedV473(seed);
  return function nextRandom() {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) / 4294967296);
  };
}

function shuffleWithSeedV473(values, seed) {
  const rng = createRngV473(seed);
  const items = [...values];
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

function buildSeedV473() {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${getLeagueSlugV473()}-V${TOOL_VERSION_V473}-${stamp}-${entropy}`;
}

function escapeHtmlV473(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function setStatusV473(message, isError = false) {
  const status = byIdV473('matchdayDrawStatusV473');
  if (!status) return;
  status.textContent = message || '';
  status.classList.toggle('matchday-draw-error-v473', Boolean(isError));
}

function updateRangeLabelsV473() {
  const minInput = byIdV473('matchdayRangeMinV473');
  const maxInput = byIdV473('matchdayRangeMaxV473');
  const minLabel = byIdV473('matchdayRangeMinLabelV473');
  const maxLabel = byIdV473('matchdayRangeMaxLabelV473');
  const rangeText = byIdV473('matchdayAllowedRangeTextV473');
  if (!minInput || !maxInput) return;
  let min = clampV473(minInput.value, 1, 38);
  let max = clampV473(maxInput.value, 1, 38);
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

function collectSettingsV473() {
  updateRangeLabelsV473();
  const count = clampV473(byIdV473('matchdayDrawCountV473')?.value, 1, 38);
  const rangeMin = clampV473(byIdV473('matchdayRangeMinV473')?.value, 1, 38);
  const rangeMax = clampV473(byIdV473('matchdayRangeMaxV473')?.value, 1, 38);
  const from = Math.min(rangeMin, rangeMax);
  const to = Math.max(rangeMin, rangeMax);
  const excluded = parseMatchdayTokensV473(byIdV473('matchdayExcludeV473')?.value || '');
  let seed = String(byIdV473('matchdaySeedV473')?.value || '').trim();
  if (!seed) {
    seed = buildSeedV473();
    const seedInput = byIdV473('matchdaySeedV473');
    if (seedInput) seedInput.value = seed;
  }
  const allInRange = [];
  for (let value = from; value <= to; value += 1) allInRange.push(value);
  const excludedInRange = excluded.filter((value) => value >= from && value <= to);
  const available = allInRange.filter((value) => !excludedInRange.includes(value));
  return { count, from, to, excluded, excludedInRange, available, seed };
}

function renderResultV473(result) {
  const output = byIdV473('matchdayDrawOutputV473');
  const code = byIdV473('matchdayDrawJsonV473');
  if (!output || !code) return;
  const excludedText = result.excludedInRange.length ? result.excludedInRange.join(', ') : 'nessuna';
  const listItems = result.drawn.map((value, index) => `<li><span>${index + 1}.</span><strong>Giornata ${value}</strong></li>`).join('');
  output.innerHTML = `
    <div class="matchday-draw-summary-v473">
      <span class="matchday-seed-pill-v473">Seed</span>
      <code>${escapeHtmlV473(result.seed)}</code>
    </div>
    <p class="muted">Range ${result.from}-${result.to}; escluse: ${escapeHtmlV473(excludedText)}; disponibili: ${result.availableCount}.</p>
    <ul class="matchday-list-v473">${listItems}</ul>
  `;
  const payload = {
    tool: 'sorteggio-giornate',
    version: `V${TOOL_VERSION_V473}`,
    league: getLeagueSlugV473(),
    generatedAt: new Date().toISOString(),
    settings: {
      requestedCount: result.count,
      range: [result.from, result.to],
      excluded: result.excludedInRange,
      seed: result.seed
    },
    result: result.drawn
  };
  code.value = JSON.stringify(payload, null, 2);
  code.removeAttribute('hidden');
  try {
    window.localStorage?.setItem(`matchdayDrawV473:${getLeagueSlugV473()}`, code.value);
  } catch (error) {
    console.warn('Salvataggio locale sorteggio V473 non disponibile', error);
  }
}

function runDrawV473(event) {
  event?.preventDefault();
  const settings = collectSettingsV473();
  if (settings.count > settings.available.length) {
    setStatusV473(`Impossibile sorteggiare ${settings.count} giornate: disponibili ${settings.available.length} dopo range/esclusioni.`, true);
    return;
  }
  const shuffled = shuffleWithSeedV473(settings.available, settings.seed);
  const drawn = shuffled.slice(0, settings.count).sort((a, b) => a - b);
  renderResultV473({ ...settings, drawn, availableCount: settings.available.length });
  setStatusV473('Sorteggio completato. Conserva seed e JSON per riprodurlo.');
}

async function copyResultV473() {
  const code = byIdV473('matchdayDrawJsonV473');
  const value = code?.value || '';
  if (!value) {
    setStatusV473('Nessun sorteggio da copiare.', true);
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    setStatusV473('Risultato copiato negli appunti.');
  } catch (error) {
    code?.focus();
    code?.select();
    setStatusV473('Copia automatica non riuscita: seleziona il JSON e copialo manualmente.', true);
  }
}

function restoreLastResultV473() {
  const code = byIdV473('matchdayDrawJsonV473');
  if (!code) return;
  try {
    const saved = window.localStorage?.getItem(`matchdayDrawV473:${getLeagueSlugV473()}`);
    if (!saved) return;
    code.value = saved;
    code.removeAttribute('hidden');
  } catch (error) {
    console.warn('Ripristino locale sorteggio V473 non disponibile', error);
  }
}

function initMatchdayDrawToolV473() {
  const form = byIdV473('matchdayDrawFormV473');
  if (!form || form.dataset.initializedV473 === 'true') return;
  form.dataset.initializedV473 = 'true';
  ['matchdayRangeMinV473', 'matchdayRangeMaxV473'].forEach((id) => {
    byIdV473(id)?.addEventListener('input', updateRangeLabelsV473);
  });
  byIdV473('matchdaySeedGenerateV473')?.addEventListener('click', () => {
    const seedInput = byIdV473('matchdaySeedV473');
    if (seedInput) seedInput.value = buildSeedV473();
    setStatusV473('Nuovo seed generato.');
  });
  byIdV473('matchdayCopyResultV473')?.addEventListener('click', copyResultV473);
  form.addEventListener('submit', runDrawV473);
  updateRangeLabelsV473();
  restoreLastResultV473();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMatchdayDrawToolV473);
} else {
  initMatchdayDrawToolV473();
}
