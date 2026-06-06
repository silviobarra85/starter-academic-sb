#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const checks = [];
function check(name, ok) { checks.push({ name, ok: Boolean(ok) }); }

const app = read('assets/app.js');
const index = read('index.html');
const manifest = JSON.parse(read('assets/soccer-data/manifest.json'));
const statsManifest = JSON.parse(read('assets/soccer-data/stats/manifest.json'));
const fnPath = path.join(root, '..', 'netlify', 'functions', 'fbref-player-stats.js');
const fn = fs.existsSync(fnPath) ? fs.readFileSync(fnPath, 'utf8') : '';

check('footer/cache V391+', /app\.js\?v=39[1234]/.test(index) && /V39[1234] Soccer Data/.test(index));
check('comandi admin Soccer Data V391 presenti', index.includes('soccerDataRefreshStatsV391') && index.includes('soccerDataDownloadFirebaseStatsV391'));
check('recupero singolo giocatore admin-only in tabella', app.includes('data-soccer-data-fetch-stats-v391') && app.includes('fetchAndSaveSoccerDataFbrefStatsV391') && app.includes('if (!state.isAdmin) return;'));
check('static first + fallback Firebase', app.includes('loadSoccerDataFirebaseStatsSummaryV391') && app.includes('staticCompiledCountV391') && app.includes('soccerDataPlayerStats'));
check('export JSON Firebase completo', app.includes('downloadSoccerDataFirebaseStatsJsonV391') && app.includes('details') && app.includes('summary'));
check('Netlify function FBref presente', fn.includes('fbref-player-stats') || fn.includes('parseFbrefTables'));
check('Netlify function admin guard', fn.includes('verifyAdmin') && fn.includes('accounts:lookup') && fn.includes('/documents/admins/'));
check('Netlify function estrae tutte le tabelle', fn.includes('parseFbrefTables') && fn.includes('replace(/<!--') && fn.includes('tables'));
check('manifest stats V391+', ['V391','V392','V393','V394'].includes(manifest.stats?.version) && ['V391','V392','V393','V394'].includes(statsManifest.meta?.version));
check('mapping V383 invariato nel manifest', manifest.currentMapping === 'fbref-player-map.v383.json');

const failed = checks.filter((item) => !item.ok);
checks.forEach((item) => console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}`));
if (failed.length) {
  console.error(`Audit V391 fallito: ${failed.map((item) => item.name).join(', ')}`);
  process.exit(1);
}
console.log('Audit Soccer Data FBref stats pipeline V391+ completato.');
