import fs from 'node:fs';

function readJson(path) { return JSON.parse(fs.readFileSync(path, 'utf8')); }
function assertOk(condition, message) { if (!condition) throw new Error(message); }
function norm(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
function info(value) {
  const t = norm(value).split(/\s+/).filter(Boolean);
  const families = [];
  let initial = '';
  function add(x) { if (x && !families.includes(x)) families.push(x); }
  if (!t.length) return { raw: '', t, families, initial };
  if (t.length >= 2 && t[0].length === 1) { initial = t[0]; add(t.slice(1).join(' ')); add(t[t.length - 1]); }
  else if (t.length >= 2 && t[t.length - 1].length === 1) { initial = t[t.length - 1]; add(t.slice(0, -1).join(' ')); add(t[t.length - 2]); }
  else if (t.length === 1) add(t[0]);
  else { initial = t[0][0]; add(t[t.length - 1]); if (t.length >= 3) add(t.slice(-2).join(' ')); add(t.slice(1).join(' ')); }
  return { raw: t.join(' '), t, families, initial };
}
function sameName(a, b) {
  const ia = info(a), ib = info(b);
  if (!ia.raw || !ib.raw) return false;
  if (ia.raw === ib.raw) return true;
  if (!ia.families.some(f => ib.families.includes(f))) return false;
  if (ia.initial && ib.initial && ia.initial !== ib.initial) return false;
  return ia.t.length === 1 || ib.t.length === 1 || Boolean(ia.initial && ib.initial && ia.initial === ib.initial);
}
const index = fs.readFileSync('static/iosudo/index.html', 'utf8');
const sw = fs.readFileSync('static/iosudo/sw.js', 'utf8');
const js = fs.readFileSync('static/fanta-engine/js/apps/iosudo-app-v696.js', 'utf8');
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
assertOk(index.includes('iosudo-app-v696.js?v=696'), 'index non punta al JS V696');
assertOk(index.includes('iosudo-app-v696.css?v=696'), 'index non punta al CSS V696');
assertOk(sw.includes('iosudo-shell-v696'), 'service worker non aggiornato a V696');
assertOk(manifest.version === 'V696' && manifest.uiVersion === 696, 'manifest non aggiornato a V696');
assertOk(data.meta.version === 'V696' && data.meta.uiVersion === 696, 'data meta non aggiornata a V696');
assertOk(js.includes('samePersonNameV696'), 'manca dedup name helper V696');
assertOk(js.includes('findUniqueFastRowForListoneV696'), 'manca matching listone V696');
const suspicious = [];
for (const [team, players] of Object.entries(data.playersByTeam || {})) {
  for (let i = 0; i < players.length; i += 1) {
    for (let j = i + 1; j < players.length; j += 1) {
      const a = players[i], b = players[j];
      if (String(a.role || '').charAt(0).toUpperCase() !== String(b.role || '').charAt(0).toUpperCase()) continue;
      if (sameName(a.playerName, b.playerName)) suspicious.push(`${team}: ${a.playerName} / ${b.playerName}`);
    }
  }
}
assertOk(suspicious.length === 0, 'duplicati residui in playersByTeam: ' + suspicious.slice(0, 10).join('; '));
const all = Object.values(data.playersByTeam || {}).flat();
assertOk(!all.some(p => p.playerName === 'Provedel' && p.teamId === 'inter'), 'residua scheda corta Provedel Inter');
console.log('Audit ioSudo V696 OK', JSON.stringify({ version: 696, players: manifest.players, rosterDuplicateChecks: 'ok', listoneMatching: true }));
