#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const siteRoot = path.resolve(path.dirname(__filename), '..');
const read = (relative) => fs.readFileSync(path.join(siteRoot, relative), 'utf8');
let ok = 0;
let fail = 0;
function check(label, condition) {
  if (condition) {
    ok += 1;
    console.log(`OK  - ${label}`);
  } else {
    fail += 1;
    console.error(`FAIL - ${label}`);
  }
}

const app = read('assets/app.js');
const config = JSON.parse(read('assets/league-config.json'));
const htmlFiles = ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html'];
const html = Object.fromEntries(htmlFiles.map((file) => [file, read(file)]));

check('overlay solo FantaMantraManager', config.leagueId === 'fantapetillomantramanager' && config.name === 'FantaMantraManager');
check('versione config V477', config.currentVersion === '477');
check('guardrail admin dashboard nascosta', config.guardrails?.presidentDashboardAdminHiddenVersion === '477');
check('guardrail svincolo nascosto', config.guardrails?.playerReleaseHiddenVersion === '477');
check('guardrail comunicato scambio nascosto', config.guardrails?.transferCommunicationHiddenVersion === '477');
check('runtime V477 presente', app.includes('FantaMantraManagerPresidentAreaRulesV477'));
check('dashboard presidente ritorna vuota per admin', app.includes('if (isFantaMantraManagerAdminSessionV477()) return') && app.includes('renderPresidentDashboardV477'));
check('centro notifiche presidente ritorna vuoto per admin', app.includes('renderPresidentNotificationCenterV477') && app.includes('president-notification-center-v370'));
check('card Svincola Giocatori rimossa via selector', app.includes('#teamPlayerReleasePanelV261') && app.includes('#teamPlayerReleaseFormV261'));
check('card Comunicato avvenuto scambio rimossa via selector', app.includes('#teamTransferCommunicationPanelV242') && app.includes('#teamTransferCommunicationFormV242'));
check('enhance svincolo trasformato in no-op cleanup', app.includes('enhancePlayerReleasePresidentAreaV477'));
check('enhance comunicato scambio trasformato in no-op cleanup', app.includes('enhanceTransferCommunicationPresidentAreaV477'));
check('cleanup post renderAll', app.includes('renderAllV477'));
check('cleanup post renderUserArea', app.includes('renderUserAreaV477'));
check('Area Squadra resta sbloccata V476', app.includes('FantaMantraManagerTeamAreaUnlockAppV476') && config.guardrails?.teamAreaUnlockVersion === '476');
check('nessun riferimento ZonaOrientale nel runtime V477', !/V477[\s\S]{0,250}ZonaOrientale/.test(app));
check('index cache-buster V477', html['index.html'].includes('assets/app.js?v=477'));
check('footer index V477', html['index.html'].includes('FantaMantraManager · V477'));
check('competition cache-buster V477', html['competition.html'].includes('?v=477'));
check('player cache-buster V477', html['player.html'].includes('?v=477'));
check('bilanci cache-buster V477', html['bilanci.html'].includes('?v=477'));
check('news cache-buster V477', html['news.html'].includes('?v=477'));
check('nome storico FantaPetillo non ripristinato nel titolo home', !html['index.html'].includes('FantaPetilloMantraManager'));

console.log(`\nAudit V477 dashboard presidente FantaMantraManager: ${ok} OK, ${fail} FAIL`);
process.exit(fail ? 1 : 0);
