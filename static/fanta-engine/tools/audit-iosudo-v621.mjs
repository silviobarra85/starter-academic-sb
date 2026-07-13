import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const jsPath = path.join(ROOT, 'static/fanta-engine/js/apps/iosudo-app-v621.js');
const cssPath = path.join(ROOT, 'static/fanta-engine/css/iosudo-app-v621.css');
const indexPath = path.join(ROOT, 'static/iosudo/index.html');
const swPath = path.join(ROOT, 'static/iosudo/sw.js');
const dataPath = path.join(ROOT, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

const js = read(jsPath);
const css = read(cssPath);
const index = read(indexPath);
const sw = read(swPath);

const checks = [
  ['index loads v621 css', index.includes('iosudo-app-v621.css?v=621')],
  ['index loads v621 js', index.includes('iosudo-app-v621.js?v=621')],
  ['service worker cache v621', sw.includes('iosudo-shell-v621')],
  ['service worker caches v621 js', sw.includes('iosudo-app-v621.js?v=621')],
  ['JS builds all players from base plus market proxies', js.includes('function buildAllPlayers()') && js.includes('incomingMarketProxyPlayers()')],
  ['JS creates incoming market proxies', js.includes('function marketProxyPlayer') && js.includes("kind: 'talkIncoming'")],
  ['JS renders permanent Giocatori section', js.includes("playersSection('Giocatori'") && js.includes('iosudo-players-section')],
  ['JS removes search result slice limit', !js.includes('.slice(0, 80)')],
  ['JS player cards remain clickable', js.includes('data-player-id') && js.includes('renderPlayerDetail(node.getAttribute')],
  ['CSS styles full players section', css.includes('iosudo-players-section') && css.includes('iosudo-player-card-market-proxy')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('V621 audit failed:');
  failed.forEach(([name]) => console.error(`- ${name}`));
  process.exit(1);
}

let incomingTalks = 0;
let incomingOfficials = 0;
if (fs.existsSync(dataPath)) {
  const data = JSON.parse(read(dataPath));
  for (const summary of Object.values(data.marketSummaryByTeam || {})) {
    incomingTalks += Array.isArray(summary.talksIncoming) ? summary.talksIncoming.length : 0;
    incomingOfficials += Array.isArray(summary.officialIncoming) ? summary.officialIncoming.length : 0;
  }
}

console.log('V621 audit passed');
console.log(`incoming talks visible through player proxies: ${incomingTalks}`);
console.log(`incoming official rows considered: ${incomingOfficials}`);
