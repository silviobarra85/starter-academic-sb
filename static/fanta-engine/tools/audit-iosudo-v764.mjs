#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Compatibilita GitHub Actions: l'applicatore storico avvia l'audit subito
// dopo la copia. La migrazione idempotente deve quindi precedere le assert.
const migrationUrl = new URL('./patch-iosudo-v764-pessina.mjs', import.meta.url);
await import(`${migrationUrl.href}?preAudit=${Date.now()}`);

const repoRoot = path.resolve(process.argv[2] || '.');
let checks = 0;
function assert(condition, message) {
  checks += 1;
  if (!condition) throw new Error(message);
}
function read(rel) { return fs.readFileSync(path.join(repoRoot, rel), 'utf8'); }
function json(rel) { return JSON.parse(read(rel)); }
function norm(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
function collect(root, predicate) {
  const stack = [root];
  const seen = new Set();
  const out = [];
  while (stack.length) {
    const item = stack.pop();
    if (!item || typeof item !== 'object' || seen.has(item)) continue;
    seen.add(item);
    if (predicate(item)) out.push(item);
    Object.values(item).forEach((value) => { if (value && typeof value === 'object') stack.push(value); });
  }
  return out;
}

const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const app = read('static/fanta-engine/js/apps/iosudo-app-v764.js');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const runtime = json('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const archive = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');

assert(index.includes('data-iosudo-version="764"'), 'index senza data-iosudo-version 764');
assert(index.includes('iosudo-version-badge'), 'badge versione assente dall header');
assert(index.includes('>V764</span>'), 'header non mostra V764');
assert(index.includes('iosudo-app-v764.js?v=764'), 'index non carica JS V764');
assert(index.includes('iosudo-app-v764.css?v=764'), 'index non carica CSS V764');
assert(sw.includes("iosudo-shell-v764"), 'cache service worker non V764');
assert(sw.includes('iosudo-app-v764.js?v=764'), 'service worker non precache JS V764');
assert(app.includes('PROTECTED_PESSINA_V764'), 'protezione runtime Pessina assente');
assert(app.includes("'monza-pessina-mas'"), 'ID Matteo Pessina assente dall app');
assert(app.includes("playerName: 'Matteo Pessina', role: 'C'"), 'ruolo Matteo non protetto come C');
assert(manifest.version === 'V764', `manifest versione ${manifest.version}`);
assert(manifest.appVersion === 'V764', `manifest appVersion ${manifest.appVersion}`);

for (const [label, data] of [['runtime', runtime], ['archive', archive]]) {
  const matteo = collect(data, (item) => item.id === 'monza-pessina-mas');
  const massimo = collect(data, (item) => item.id === 'bologna-pessina-mas');
  const matteoCanonical = matteo.filter((item) => item.playerName != null || item.teamId != null || item.teamName != null);
  const massimoCanonical = massimo.filter((item) => item.playerName != null || item.teamId != null || item.teamName != null);
  assert(matteoCanonical.length >= 1, `${label}: scheda canonica Matteo Pessina non trovata`);
  assert(massimoCanonical.length >= 1, `${label}: scheda canonica Massimo Pessina non trovata`);
  assert(matteoCanonical.every((item) => item.playerName === 'Matteo Pessina'), `${label}: nome Matteo non canonico`);
  assert(matteo.filter((item) => item.role != null).every((item) => item.role === 'C'), `${label}: Matteo Pessina non e C`);
  assert(matteoCanonical.every((item) => norm(item.teamId || item.teamName) === 'monza'), `${label}: Matteo non e nel Monza`);
  assert(massimoCanonical.every((item) => item.playerName === 'Massimo Pessina'), `${label}: nome Massimo non canonico`);
  assert(massimo.filter((item) => item.role != null).every((item) => item.role === 'P'), `${label}: Massimo Pessina non e P`);
  assert(massimoCanonical.every((item) => norm(item.teamId || item.teamName) === 'bologna'), `${label}: Massimo non e nel Bologna`);
  const badMonza = collect(data, (item) => {
    const name = norm(item.playerName || item.target || item.name || '');
    const team = norm(item.teamId || item.teamName || item.team || '');
    return name.includes('pessina') && team.includes('monza') && item.role === 'P';
  });
  assert(badMonza.length === 0, `${label}: trovate ${badMonza.length} occorrenze Monza/Pessina con ruolo P`);
}

console.log(`Audit ioSudo V764 OK - ${checks} controlli superati`);
