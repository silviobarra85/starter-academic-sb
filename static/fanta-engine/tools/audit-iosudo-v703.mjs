import fs from 'node:fs';

function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const index = fs.readFileSync('static/iosudo/index.html', 'utf8');
const sw = fs.readFileSync('static/iosudo/sw.js', 'utf8');
const js = fs.readFileSync('static/fanta-engine/js/apps/iosudo-app-v703.js', 'utf8');

assertOk(index.includes('iosudo-app-v703.js?v=703'), 'index non punta al JS V703');
assertOk(index.includes('iosudo-app-v703.css?v=703'), 'index non punta al CSS V703');
assertOk(sw.includes('iosudo-shell-v703'), 'service worker non usa cache V703');
assertOk(sw.includes('iosudo-app-v703.js?v=703'), 'service worker non cachea JS V703');
assertOk(js.includes('function teamCounters(teamId, summary)'), 'helper teamCounters assente');
assertOk(js.includes('const counts = teamCounters(team.id);'), 'teamCard non usa teamCounters');
assertOk(js.includes('const counts = teamCounters(teamId, summary);'), 'renderTeamPanel non usa teamCounters');
assertOk(!js.includes('team.officialIncomingCount || 0'), 'contatore Nuovi legge ancora team.officialIncomingCount');
assertOk(!js.includes('team.talksIncomingCount || 0'), 'contatore Rumor legge ancora team.talksIncomingCount');
assertOk(!js.includes('team.injuriesCount || 0'), 'contatore SOS legge ancora team.injuriesCount');

console.log('Audit ioSudo V703 OK');
