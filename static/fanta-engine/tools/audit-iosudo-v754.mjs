import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));
const checks = [];
const check = (condition, label) => {
  if (!condition) throw new Error(label);
  checks.push(label);
};
const norm = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const runtime = json('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const app = read('static/fanta-engine/js/apps/iosudo-app-v754.js');
const css = read('static/fanta-engine/css/iosudo-app-v754.css');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

check(manifest.version === 'V754', 'manifest V754');
check(manifest.appVersion === 'V754', 'appVersion V754');
check(runtime.meta?.version === 'V754', 'runtime V754');
check(data.meta?.version === 'V754', 'archive V754');
check(index.includes('iosudo-app-v754.js?v=754'), 'index JS V754');
check(index.includes('iosudo-app-v754.css?v=754'), 'index CSS V754');
check(index.includes('data-iosudo-version="754"'), 'data version 754');
check(sw.includes("iosudo-shell-v754"), 'service worker V754');
check(app.includes('function playerIdentityHtml'), 'helper identita giocatore');
check(app.includes('function sourceBadgeHtml'), 'helper badge sorgente');
check(app.includes('function roleBadgeHtml'), 'helper badge ruolo');
check(app.includes("SORGENTE: "), 'testo badge sorgente');
check(app.includes("toLocaleUpperCase('it-IT')"), 'nomi giocatore in maiuscolo');
check(!app.includes('Listone recente:'), 'dicitura Listone recente rimossa');
check(css.includes('.iosudo-badge-source-listone'), 'CSS sorgente listone');
check(css.includes('.iosudo-badge-role-p') && css.includes('.iosudo-badge-role-a'), 'CSS badge ruolo P-D-C-A');

const players = Object.values(runtime.playersByTeam || {}).flat();
check(players.length === 1035, '1035 giocatori dopo deduplica certa');
check(players.length === manifest.players, 'conteggio giocatori manifest');
const ids = new Set();
for (const player of players) {
  check(Boolean(player.id), `ID presente ${player.playerName}`);
  check(!ids.has(player.id), `ID univoco ${player.id}`);
  ids.add(player.id);
  if (player.listone) {
    const listRole = String(player.listone.classicRole || player.listone.role || '').trim().toUpperCase().charAt(0);
    const role = String(player.role || '').trim().toUpperCase().charAt(0);
    check(Boolean(listRole), `ruolo listone presente ${player.id}`);
    check(role === listRole, `ruolo allineato al listone ${player.id}`);
    check(player.nameSource === 'LISTONE', `sorgente nome LISTONE ${player.id}`);
    check(player.roleSource === 'LISTONE', `sorgente ruolo LISTONE ${player.id}`);
  }
}
const byId = new Map(players.map((p) => [p.id, p]));
check(byId.get('bologna-rowe')?.role === 'C', 'Rowe centrocampista');
check(byId.get('bologna-bernardeschi')?.role === 'C', 'Bernardeschi centrocampista');
check(byId.get('inter-luis-henrique')?.role === 'C', 'Luis Henrique centrocampista');
check(byId.get('udinese-pafundi')?.role === 'C', 'Pafundi centrocampista');
const removed = data.listoneRoleAuditV754?.removedDuplicateIds || [];
check(removed.length === 18, '18 duplicati listone rimossi');
check(removed.every((id) => !ids.has(id)), 'ID duplicati assorbiti assenti');
check((data.listoneRoleAuditV754?.ambiguous || []).length === 0, 'nessuna associazione ruolo ambigua');
check((data.listoneRoleAuditV754?.roleChanges || []).length === 30, '30 cambi ruolo registrati');
check(app.includes("playerIdentityHtml(player) + badgeHtml(badge)"), 'identita completa nella rosa squadra');
check(app.includes("iosudo-card-title iosudo-player-identity"), 'identita completa nel dettaglio');
check(app.includes("itemIdentityHtml(item, 'SOS')"), 'nomi SOS con sorgente');
check(app.includes("itemIdentityHtml(item, 'FORMAZIONE')"), 'nomi formazione con sorgente');

console.log(`Audit ioSudo V754 OK - ${checks.length} controlli superati`);
