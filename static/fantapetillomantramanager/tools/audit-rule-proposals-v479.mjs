#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function ok(name, condition, detail = '') { checks.push({ name, ok: Boolean(condition), detail }); }

const app = read('assets/app.js');
const config = JSON.parse(read('assets/league-config.json'));
const rules = read('tools/firestore-rules-v479.rules');
const htmlFiles = ['index.html', 'competition.html', 'player.html', 'news.html', 'bilanci.html'];

ok('V479 marker presente in app.js', app.includes('FantaMantraManager: Proposte regolamento in Firebase'));
ok('Collection ruleProposals registrata', app.includes('ruleProposals') && app.includes('FANTAMANTRA_RULE_PROPOSALS_COLLECTION_V479'));
ok('Form presidente presente', app.includes('ruleProposalFormV479') && app.includes('Titolo proposta'));
ok('Lista tutte le proposte presente', app.includes('Tutte le proposte della lega'));
ok('Pannello Admin presente', app.includes('adminRuleProposalsPanelV479') && app.includes('renderAdminRuleProposalsPanelV479'));
ok('Scrittura Firestore addDoc su ruleProposals', app.includes('addDoc(collection(db, FANTAMANTRA_RULE_PROPOSALS_COLLECTION_V479)'));
ok('Update admin/proprietario su ruleProposals', app.includes('updateDoc(doc(db, FANTAMANTRA_RULE_PROPOSALS_COLLECTION_V479'));
ok('Dashboard admin resta senza dashboard presidente', app.includes('presidentDashboardVisibleForAdmin: false') || app.includes('Dashboard Presidente non viene mostrata quando la sessione e Admin'));
ok('Config currentVersion 479', config.currentVersion === '479');
ok('Feature ruleProposals attiva', config.features?.ruleProposals === true);
ok('Guardrail rules v479', config.guardrails?.ruleProposalsFirebaseRulesVersion === '479');
ok('Rules file presente', exists('tools/firestore-rules-v479.rules'));
ok('Rules contiene match ruleProposals', rules.includes('match /ruleProposals/{proposalId}'));
ok('Rules create solo presidenti approvati', rules.includes('allow create: if isApprovedTeamUser()'));
ok('Rules owner modifica solo SUBMITTED', rules.includes("resource.data.status == 'SUBMITTED'"));
ok('Rules admin delete', rules.includes('allow delete: if isAdmin();'));
for (const file of htmlFiles) {
  const html = read(file);
  ok(`${file} cache-buster V479`, html.includes('?v=479') && !html.includes('?v=478'));
  if (!['news.html', 'bilanci.html'].includes(file)) ok(`${file} footer V479`, html.includes('V479'));
  else ok(`${file} redirect/favicon cache-buster only`, html.includes('?v=479'));
}
ok('Nessun riferimento ZonaOrientale nel blocco V479 app', !app.slice(app.indexOf('/* V479')).includes('zonaorientale'));

const failed = checks.filter((item) => !item.ok);
checks.forEach((item) => console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${item.detail ? ` (${item.detail})` : ''}`));
if (failed.length) {
  console.error(`\n${failed.length} controlli falliti.`);
  process.exit(1);
}
console.log(`\n${checks.length} OK, 0 FAIL`);
