#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const root = process.cwd();
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(msg){ console.error('[audit ioSudo V635] FAIL:', msg); process.exit(1); }
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const js = read('static/fanta-engine/js/apps/iosudo-app-v635.js');
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
if (!index.includes('iosudo-app-v635.js?v=635')) fail('index non punta a JS V635');
if (!index.includes('iosudo-app-v635.css?v=635')) fail('index non punta a CSS V635');
if (!sw.includes('iosudo-shell-v635')) fail('service worker cache non V635');
if (!js.includes("const LISTONE_ROOT = '/fanta-engine/data/shared-assets/current/assets/listoni/';")) fail('listone root non assoluto');
if (!js.includes('looseListoneForPlayer')) fail('fallback listone robusto mancante');
const rows = [];
for (const team of data.teams || []) {
  const summary = (data.marketSummaryByTeam || {})[team.id] || {};
  for (const key of ['officialIncoming','officialOutgoing','talksIncoming','talksOutgoing']) {
    for (const item of summary[key] || []) rows.push({team, key, item});
  }
}
const freuler = rows.find(r => /freuler/i.test(r.item.playerName || '') && r.key === 'officialOutgoing');
const ehizibue = rows.find(r => /ehizibue/i.test(r.item.playerName || '') && r.key === 'officialOutgoing');
if (!freuler || freuler.item.role !== 'C' || freuler.item.currentRealTeam !== 'Svincolato') fail('Freuler non corretto');
if (!ehizibue || ehizibue.item.role !== 'D' || ehizibue.item.currentRealTeam !== 'Pec Zwolle') fail('Ehizibue non corretto');
console.log('[audit ioSudo V635] OK', { freuler: { role: freuler.item.role, current: freuler.item.currentRealTeam }, ehizibue: { role: ehizibue.item.role, current: ehizibue.item.currentRealTeam } });
