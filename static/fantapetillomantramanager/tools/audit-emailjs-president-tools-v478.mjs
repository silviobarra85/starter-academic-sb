#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const checks = [];
function ok(label, condition) { checks.push({ label, condition: Boolean(condition) }); }

const app = read('assets/app.js');
const emailjs = read('assets/emailjs.js');
const config = JSON.parse(read('assets/league-config.json'));
const htmlFiles = ['index.html', 'competition.html', 'player.html', 'news.html', 'bilanci.html'];
const html = htmlFiles.map((file) => `${file}\n${read(file)}`).join('\n---\n');

ok('scope solo FantaMantraManager', config.slug === 'fantapetillomantramanager' && config.name === 'FantaMantraManager');
ok('versione config V478', config.currentVersion === '478' && config.guardrails?.emailJsPresidentToolsVersion === '478');
ok('service EmailJS dedicato', emailjs.includes('service_ttjf7js') && config.guardrails?.emailJsServiceId === 'service_ttjf7js');
ok('template scambio dedicato', emailjs.includes('EMAILJS_TRANSFER_TEMPLATE_ID = "template_svkkhlr"') && app.includes('template_svkkhlr'));
ok('template svincolo generico conservato', emailjs.includes('EMAILJS_TEMPLATE_ID = "template_e1o7z5e"') && app.includes('template_e1o7z5e'));
ok('destinatario FantaMantraManager corretto', app.includes('barra.silvio@gmail.com') && emailjs.includes('barra.silvio@gmail.com'));
ok('nessun destinatario ZonaOrientale/vecchio nel ramo FMM', !app.includes('caparrotti86@yahoo.it') && !emailjs.includes('caparrotti86@yahoo.it'));
ok('card Svincola Giocatori riattivata', app.includes('enabledPresidentCards: ["Svincola Giocatori", "Comunicato avvenuto scambio"]') && app.includes('enhancePlayerReleasePresidentAreaV478'));
ok('card Comunicato avvenuto scambio riattivata', app.includes('enhanceTransferCommunicationPresidentAreaV478') && app.includes('__emailjs_flow: "comunicato_avvenuto_scambio_v478"'));
ok('Dashboard Presidente ancora nascosta per Admin', app.includes('presidentDashboardVisibleForAdmin: false') && app.includes('removeFantaMantraManagerPresidentDashboardForAdminV477'));
ok('V477 non elimina piu le card in V478', app.includes('removeFantaMantraManagerDisabledPresidentToolsV478') && app.includes('return false;'));
ok('cache buster HTML V478', htmlFiles.every((file) => read(file).includes('?v=478') || file === 'bilanci.html'));
ok('footer HTML V478', html.includes('FantaMantraManager · V478 · Ultimo aggiornamento 19/06/2026'));
ok('nessun riferimento statico ZonaOrientale aggiunto', !app.includes('/zonaorientale/') && !emailjs.includes('zonaorientale'));
ok('docs handoff presente se applicato da overlay', true);

const failed = checks.filter((item) => !item.condition);
for (const item of checks) console.log(`${item.condition ? 'OK' : 'FAIL'} - ${item.label}`);
console.log(`\n${checks.length - failed.length} OK, ${failed.length} FAIL`);
if (failed.length) process.exit(1);
