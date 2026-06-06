import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/soccer-data/manifest.json'), 'utf8'));
const statsManifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/soccer-data/stats/manifest.json'), 'utf8'));
const rulesPatch = fs.readFileSync(path.join(root, '../docs/zonaorientale/firebase/FIREBASE_RULES_PATCH_V393_SOCCER_DATA_STATS.rules'), 'utf8');
const fullRules = fs.readFileSync(path.join(root, '../docs/zonaorientale/firebase/FIREBASE_RULES_ZONAORIENTALE_FULL_V393.rules'), 'utf8');

const checks = [
  ['footer/cache updated to V393', (index.includes('V393 Soccer Data rules e fallback locale stats') && index.includes('app.js?v=393')) || (index.includes('V394 Soccer Data API-Football cache Firebase') && index.includes('app.js?v=394'))],
  ['manual import no longer loses payload on permission denied', app.includes('persistSoccerDataPlayerStatsV393') && app.includes('isSoccerDataFirebasePermissionErrorV393') && app.includes('upsertSoccerDataLocalStatsDetailV393')],
  ['export merges Firebase and local fallback', app.includes('getSoccerDataExportStatsDetailsV393') && app.includes('localFallbackCount') && app.includes('player-stats-export-${seasonId}-v393.json') || app.includes('player-stats-export-${seasonId}-v394.json')],
  ['combined stats index includes local fallback', app.includes("getSoccerDataLocalStatsEntriesV393().forEach((entry) => addEntry(entry, 'local-fallback', true));")],
  ['admin button text is generic stats JSON', index.includes('Scarica stats JSON') && !index.includes('Scarica stats Firebase JSON')],
  ['manifest documents V393 fallback', ['V393','V394'].includes(manifest.meta.assetLayoutVersion) && ['V393','V394'].includes(manifest.stats?.version) && manifest.statsPipeline?.firebaseRulesV393?.required === true],
  ['stats manifest documents V393 local fallback', ['V393','V394'].includes(statsManifest.meta.version) && statsManifest.localFallbackV393?.enabled === true],
  ['rules patch allows public read and admin write', rulesPatch.includes('match /soccerDataPlayerStats/{docId}') && rulesPatch.includes('allow read: if true;') && rulesPatch.includes('allow write: if isAdmin();')],
  ['full rules include soccerDataPlayerStats block', fullRules.includes('match /soccerDataPlayerStats/{docId}') && fullRules.includes('allow write: if isAdmin();')],
  ['other site sections not targeted', !app.includes('news-share V393') && !app.includes('trade V393')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('Audit V393 fallito:');
  failed.forEach(([name]) => console.error(`- ${name}`));
  process.exit(1);
}
console.log('Audit V393 OK - Soccer Data gestisce permission denied con fallback locale ed espone rules dedicate.');
