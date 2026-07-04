#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let ok = 0;
let fail = 0;
const failures = [];

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), 'utf8');
}

function readJson(filePath) {
  return JSON.parse(read(filePath));
}

function exists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}

function check(condition, label) {
  if (condition) {
    ok += 1;
    console.log(`OK  - ${label}`);
  } else {
    fail += 1;
    failures.push(label);
    console.error(`FAIL - ${label}`);
  }
}

function listHtml(dir) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute)
    .filter((name) => name.endsWith('.html'))
    .map((name) => path.join(dir, name));
}

function allFiles(dir, extensions) {
  const start = path.join(root, dir);
  const out = [];
  if (!fs.existsSync(start)) return out;
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === '.DS_Store' || entry.name === '__MACOSX') continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
        out.push(path.relative(root, full));
      }
    }
  };
  walk(start);
  return out;
}

function withoutScriptBlocks(text) {
  return text.replace(/<script[\s\S]*?<\/script>/gi, '');
}

function noTermsInFiles(files, terms, label) {
  const hits = [];
  for (const file of files) {
    const text = withoutScriptBlocks(read(file));
    for (const term of terms) {
      if (text.includes(term)) hits.push(`${file} -> ${term}`);
    }
  }
  check(hits.length === 0, `${label}${hits.length ? ` (${hits.join('; ')})` : ''}`);
}

const zonaConfigPath = 'zonaorientale/assets/league-config.json';
const zonaNestedConfigPath = 'zonaorientale/static/assets/league-config.json';
const fmmConfigPath = 'fantapetillomantramanager/assets/league-config.json';

check(exists('zonaorientale'), 'cartella ZonaOrientale presente');
check(exists('fantapetillomantramanager'), 'cartella FantaMantraManager presente');
check(exists('fanta-engine'), 'cartella motore comune fanta-engine presente');
check(exists(zonaConfigPath), 'config ZonaOrientale presente');
check(exists(fmmConfigPath), 'config FantaMantraManager presente');
check(exists(zonaNestedConfigPath), 'config ZonaOrientale annidata presente');

const zonaConfig = readJson(zonaConfigPath);
const zonaNestedConfig = readJson(zonaNestedConfigPath);
const fmmConfig = readJson(fmmConfigPath);

check(zonaConfig.leagueId === 'zonaorientale', 'leagueId ZonaOrientale corretto');
check(zonaNestedConfig.leagueId === 'zonaorientale', 'leagueId ZonaOrientale annidato corretto');
check(fmmConfig.leagueId === 'fantapetillomantramanager', 'leagueId FantaMantraManager corretto');
check(zonaConfig.name === 'ZonaOrientale Salerno', 'nome pubblico ZonaOrientale corretto');
check(fmmConfig.name === 'FantaMantraManager', 'nome pubblico FantaMantraManager corretto');
check(zonaConfig.currentVersion === 482, 'currentVersion ZonaOrientale V482');
check(zonaNestedConfig.currentVersion === 482, 'currentVersion ZonaOrientale annidato V482');
check(fmmConfig.currentVersion === 482, 'currentVersion FantaMantraManager V482');
check(zonaConfig.features?.antiContaminationAudit === true, 'feature audit anti-contaminazione attiva su ZonaOrientale');
check(fmmConfig.features?.antiContaminationAudit === true, 'feature audit anti-contaminazione attiva su FantaMantraManager');

const zonaHtml = [
  ...listHtml('zonaorientale'),
  ...listHtml('zonaorientale/static')
];
const fmmHtml = listHtml('fantapetillomantramanager');

noTermsInFiles(fmmHtml, ['ZonaOrientale', 'zonaorientale'], 'HTML pubblico FantaMantraManager senza riferimenti ZonaOrientale');
noTermsInFiles(zonaHtml, ['FantaMantraManager', 'FantaMantra', 'FantaPetillo', 'fantapetillomantramanager'], 'HTML pubblico ZonaOrientale senza riferimenti FantaMantra/FantaPetillo');

const zonaIndex = read('zonaorientale/index.html');
const zonaNestedIndex = read('zonaorientale/static/index.html');
const fmmIndex = read('fantapetillomantramanager/index.html');
check(zonaIndex.includes('aria-label="Navigazione ZonaOrientale"'), 'aria-label navigazione ZonaOrientale corretta');
check(zonaNestedIndex.includes('aria-label="Navigazione ZonaOrientale"'), 'aria-label navigazione ZonaOrientale annidata corretta');
check(fmmIndex.includes('aria-label="Navigazione FantaMantraManager"'), 'aria-label navigazione FantaMantraManager corretta');

const publicText = allFiles('.', ['.html', '.js', '.json'])
  .filter((file) => !file.startsWith('docs/'))
  .map((file) => `${file}\n${read(file)}`)
  .join('\n');
check(!publicText.includes('audit clone FantaPetillo'), 'nessun footer hard-coded audit clone FantaPetillo');
check(!publicText.includes('Ultimo aggiornamento 15/06/2026'), 'nessun footer con data clone 15/06/2026');

const zonaFooterPages = ['zonaorientale/index.html', 'zonaorientale/competition.html', 'zonaorientale/player.html', 'zonaorientale/static/index.html', 'zonaorientale/static/competition.html', 'zonaorientale/static/player.html'];
for (const file of zonaFooterPages) {
  check(read(file).includes('ZonaOrientale Salerno · V482 · Ultimo aggiornamento 24/06/2026'), `footer V482 ZonaOrientale in ${file}`);
}
const fmmFooterPages = ['fantapetillomantramanager/index.html', 'fantapetillomantramanager/competition.html', 'fantapetillomantramanager/player.html'];
for (const file of fmmFooterPages) {
  check(read(file).includes('FantaMantraManager · V482 · Ultimo aggiornamento 24/06/2026'), `footer V482 FantaMantraManager in ${file}`);
}

check(read('fantapetillomantramanager/assets/emailjs.js').includes('EMAILJS_SERVICE_ID = "service_ttjf7js"'), 'EmailJS FantaMantraManager usa service dedicato');
check(read('fantapetillomantramanager/assets/emailjs.js').includes('EMAILJS_TRANSFER_TEMPLATE_ID = "template_svkkhlr"'), 'EmailJS FantaMantraManager template scambio dedicato');
check(read('fantapetillomantramanager/assets/emailjs.js').includes('EMAILJS_DEFAULT_RECIPIENT = "barra.silvio@gmail.com"'), 'EmailJS FantaMantraManager destinatario corretto');
check(read('zonaorientale/assets/emailjs.js').includes('EMAILJS_SERVICE_ID = "service_trz4dxe"'), 'EmailJS ZonaOrientale resta sul service originale');
check(!read('zonaorientale/assets/emailjs.js').includes('service_ttjf7js'), 'EmailJS ZonaOrientale non usa service FantaMantraManager');
check(!read('fantapetillomantramanager/assets/emailjs.js').includes('service_trz4dxe'), 'EmailJS FantaMantraManager non usa service ZonaOrientale');

check(read('fantapetillomantramanager/assets/js/sections/regolamento-section-v402.js').includes('regolamento-fantapetillo-mantra-manager-2026-2027-v474.pdf'), 'regolamento FantaMantraManager punta al PDF 2026-2027');
check(!read('fantapetillomantramanager/news.html').includes('news-ujE2CqJMjzkYhhjzZZHD'), 'news FantaMantraManager non usa ID news ZonaOrientale V472');
check(read('fantapetillomantramanager/assets/app.js').includes('renderRuleProposalsPresidentSectionV479'), 'Proposte regolamento FantaMantraManager preservate nel codice');
check(read('fantapetillomantramanager/assets/app.js').includes('FANTAMANTRA_MANAGER_EMAILJS_SERVICE_ID_V478'), 'card presidente EmailJS FantaMantraManager preservate nel codice');
check(read('fantapetillomantramanager/assets/app.js').includes('presidentDashboard') || read('fantapetillomantramanager/assets/app.js').includes('Dashboard Presidente'), 'Dashboard Presidente FantaMantraManager ancora presente nel codice');

if (fail > 0) {
  console.error(`\nAudit anti-contaminazione V482 fallito: ${ok} OK, ${fail} FAIL`);
  for (const item of failures) console.error(` - ${item}`);
  process.exit(1);
}
console.log(`\nAudit anti-contaminazione V482 completato: ${ok} OK, ${fail} FAIL`);
