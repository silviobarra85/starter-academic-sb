#!/usr/bin/env node
import fs from 'node:fs';

const checks = [];
function read(path) { return fs.readFileSync(path, 'utf8'); }
function ok(name, pass, detail = '') { checks.push({ name, pass, detail }); }

const leagues = ['zonaorientale', 'fantapetillomantramanager'];
for (const league of leagues) {
  const app = read(`static/${league}/assets/app.js`);
  const index = read(`static/${league}/index.html`);
  const config = JSON.parse(read(`static/${league}/assets/league-config.json`));
  const coreConfig = read(`static/${league}/assets/js/core/league-config-v443.js`);
  ok(`${league} app V588 block`, app.includes('FantaStaticRosterGithubPrimaryV588') && app.includes('visualPriority: "assets/rose -> rosterEntries fallback"'));
  ok(`${league} static primary before rosterEntries`, app.includes('getActiveRosterEntriesForSeasonTeamV588') && app.includes('getSnapshotRosterEntriesForSeasonTeamV588'));
  ok(`${league} manual sync only`, app.includes('automaticFirestoreWrites: false') && app.includes('syncRosterEntriesFromStaticRostersV588'));
  ok(`${league} app cache v588`, index.includes('assets/app.js?v=588'));
  ok(`${league} editor v588`, index.includes('static-roster-editor-v588.js?v=588') && index.includes('static-roster-editor-v588.css?v=588'));
  ok(`${league} no editor v587 reference`, !index.includes('static-roster-editor-v587'));
  ok(`${league} league-config version`, String(config.currentVersion) === '588');
  ok(`${league} core config version`, coreConfig.includes("currentVersion: '588'"));
}

const editor = read('static/fanta-engine/js/ui/static-roster-editor-v588.js');
ok('editor has sync button', editor.includes('adminStaticRosterSyncFirebaseV588'));
ok('editor calls runtime sync', editor.includes('FantaStaticRosterGithubPrimaryV588') && editor.includes('.sync({ seasonId: meta.seasonId })'));

const failed = checks.filter((item) => !item.pass);
for (const item of checks) {
  console.log(`${item.pass ? 'OK' : 'FAIL'} ${item.name}${item.detail ? ` - ${item.detail}` : ''}`);
}
if (failed.length) process.exit(1);
console.log('audit-static-rosters-primary-v588 passed');
