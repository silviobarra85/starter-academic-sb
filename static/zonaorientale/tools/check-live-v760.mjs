import process from 'node:process';

const origin = new URL(process.argv[2] || 'https://silviobarra.com/');
const stamp = Date.now();
const failures = [];
const results = [];

function versioned(url) {
  const target = new URL(url, origin);
  target.searchParams.set('__v760_probe', String(stamp));
  return target;
}

async function request(url, options = {}) {
  const target = versioned(url);
  const response = await fetch(target, {
    cache: 'no-store',
    redirect: 'follow',
    headers: { 'cache-control': 'no-cache', pragma: 'no-cache' },
    ...options
  });
  return { response, target };
}

async function getText(url, label) {
  try {
    const { response, target } = await request(url);
    const text = await response.text();
    const ok = response.ok;
    results.push({ ok, label, status: response.status, url: target.href });
    if (!ok) failures.push(`${label}: HTTP ${response.status}`);
    return ok ? text : '';
  } catch (error) {
    results.push({ ok: false, label, status: 0, url: new URL(url, origin).href });
    failures.push(`${label}: ${error?.message || error}`);
    return '';
  }
}

async function getJson(url, label) {
  const text = await getText(url, label);
  if (!text) return null;
  try { return JSON.parse(text); }
  catch (error) {
    failures.push(`${label}: JSON non valido (${error?.message || error})`);
    return null;
  }
}

async function checkHead(url, label) {
  try {
    let { response, target } = await request(url, { method: 'HEAD' });
    if (response.status === 405 || response.status === 501) {
      ({ response, target } = await request(url, { method: 'GET' }));
      await response.body?.cancel?.();
    }
    const ok = response.ok;
    results.push({ ok, label, status: response.status, url: target.href });
    if (!ok) failures.push(`${label}: HTTP ${response.status}`);
  } catch (error) {
    results.push({ ok: false, label, status: 0, url: new URL(url, origin).href });
    failures.push(`${label}: ${error?.message || error}`);
  }
}

const indexUrl = new URL('/zonaorientale/', origin);
const appUrl = new URL('/zonaorientale/assets/app.js?v=760', origin);
const release = await getJson('/zonaorientale/release.json', 'release manifest');
const index = await getText(indexUrl, 'home V760');
const app = await getText(appUrl, 'app.js V760');

if (release?.version !== '760') failures.push(`release manifest: attesa V760, trovata ${release?.version || 'nessuna'}`);
if (release?.entrypoint !== 'assets/app.js?v=760') failures.push('release manifest: entrypoint V760 non coerente');
if (index && !index.includes('Fantacalcio - V760')) failures.push('home: footer V760 non trovato');
if (index && !index.includes('./assets/app.js?v=760')) failures.push('home: entrypoint app.js V760 non trovato');
if (app && !app.includes('loadPublicDataForSelectedSeasonV760')) failures.push('app.js: loader V760 non trovato');
if (app && !app.includes('loadStaticPublicSeasonSnapshotV172(seasonId)')) failures.push('app.js: snapshot statico obbligatorio non trovato');

const config = await getJson('/zonaorientale/assets/public/config.json', 'config pubblica');
const manifest = await getJson('/zonaorientale/assets/snapshots/seasons/manifest.json', 'manifest snapshot');
await getJson('/zonaorientale/assets/snapshots/honor.json', 'snapshot albo');
await checkHead('/fanta-engine/js/core/static-first-bootstrap-v760.js', 'contratto FantaEngine V760');

const currentSeason = String(config?.currentSeasonId || '').trim();
if (!currentSeason) failures.push('config pubblica: currentSeasonId assente');
const currentEntry = (manifest?.snapshots || []).find((entry) => String(entry?.seasonId || '') === currentSeason);
if (currentSeason && !currentEntry?.file) failures.push(`manifest: snapshot ${currentSeason} assente`);
if (currentEntry?.file) {
  const snapshot = await getJson(`/zonaorientale/assets/snapshots/seasons/${currentEntry.file}`, `snapshot ${currentSeason}`);
  if (snapshot) {
    if (!Array.isArray(snapshot.seasonTeams) || snapshot.seasonTeams.length === 0) failures.push(`snapshot ${currentSeason}: seasonTeams vuoto`);
    if (!Array.isArray(snapshot.rosterEntries) || snapshot.rosterEntries.length === 0) failures.push(`snapshot ${currentSeason}: rosterEntries vuoto`);
  }
}

if (app) {
  const importPattern = /^\s*import(?:[\s\S]*?from\s*)?["']([^"']+)["'];?/gm;
  const imports = [...app.matchAll(importPattern)]
    .map((match) => match[1])
    .filter((specifier) => specifier.startsWith('.'));
  const unique = [...new Set(imports)];
  const concurrency = 8;
  let cursor = 0;
  async function worker() {
    while (cursor < unique.length) {
      const specifier = unique[cursor++];
      const target = new URL(specifier, appUrl);
      await checkHead(target, `import ${specifier}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, unique.length || 1) }, worker));
}

for (const item of results) {
  console.log(`${item.ok ? 'OK' : 'FAIL'} ${String(item.status).padStart(3, ' ')} - ${item.label} - ${item.url}`);
}

if (failures.length) {
  console.error(`\n[check-live-v760] FAIL - ${failures.length} problema/i:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`\n[check-live-v760] OK - release V760 coerente su ${origin.href}`);
