import fs from 'fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}
function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const index = read('static/iosudo/index.html');
const app = read('static/fanta-engine/js/apps/iosudo-app-v702.js');
const sw = read('static/iosudo/sw.js');
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));

assertOk(index.includes('iosudo-app-v702.js?v=702'), 'index non punta al JS V702');
assertOk(index.includes('iosudo-app-v702.css?v=702'), 'index non punta al CSS V702');
assertOk(index.includes('data-iosudo-version="702"'), 'index non dichiara data-iosudo-version 702');
assertOk(sw.includes('iosudo-shell-v702'), 'service worker non usa cache V702');
assertOk(app.includes('function teamFormationMeta'), 'manca teamFormationMeta');
assertOk(app.includes('function teamModuleText'), 'manca teamModuleText');
assertOk(app.includes('function teamCoachText'), 'manca teamCoachText');
assertOk(!app.includes('team.formationModule || team.module ||'), 'restano letture dirette modulo sul team');
assertOk(!app.includes("team.coach || 'Allenatore n.d.'"), 'resta lettura diretta coach sul team');

const formations = data.formationsByTeam || {};
const teams = data.teams || [];
const missing = teams.filter((team) => {
  const rows = formations[team.id] || [];
  return !rows.some((row) => row && row.module && row.coach);
}).map((team) => team.name || team.id);
assertOk(missing.length === 0, 'formazioni senza module/coach: ' + missing.join(', '));

console.log('Audit ioSudo V702 OK', JSON.stringify({ version: 702, teams: teams.length, formationMetaFallback: true }));
