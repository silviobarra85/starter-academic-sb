#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(siteRoot, '..', '..');
const quiet = process.argv.includes('--quiet');

function resolveLeagueDir(slug) {
  const candidates = [
    path.join(repoRoot, 'static', slug),
    path.join(repoRoot, slug),
    path.join(siteRoot, '..', slug),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
}

const specs = [
  {
    label: 'ZonaOrientale',
    dir: resolveLeagueDir('zonaorientale'),
    siteName: 'ZonaOrientale Salerno',
    otherLeague: /fantapetillomantramanager|fanta\s*petillo/i,
  },
  {
    label: 'FantaPetilloMantraManager',
    dir: resolveLeagueDir('fantapetillomantramanager'),
    siteName: 'FantaPetilloMantraManager',
    otherLeague: /zonaorientale|zona\s*orientale/i,
  },
];

let failures = 0;
function fail(message) {
  failures += 1;
  console.error(`FAIL: ${message}`);
}
function pass(message) {
  if (!quiet) console.log(`OK: ${message}`);
}
function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function footerText(html) {
  return (html.match(/<footer\b[\s\S]*?<\/footer>/gi) || [])
    .map((footer) => footer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    .join(' | ');
}

for (const spec of specs) {
  for (const htmlName of ['index.html', 'competition.html', 'player.html']) {
    const file = path.join(spec.dir, htmlName);
    if (!fs.existsSync(file)) {
      fail(`${spec.label}: file mancante ${htmlName}`);
      continue;
    }
    const text = footerText(read(file));
    const expected = `${spec.siteName} · V472 · Ultimo aggiornamento 17/06/2026`;
    if (!text.includes(expected)) fail(`${spec.label}: footer non normalizzato in ${htmlName}: ${text}`);
    if (/audit\s*clone|clone\s*fanta|setup\s*standard\s*admin|cleanup\s*audit\s*multi-lega|15\/06\/2026/i.test(text)) fail(`${spec.label}: footer contiene etichette tecniche in ${htmlName}: ${text}`);
    if (spec.otherLeague.test(text)) fail(`${spec.label}: footer contiene riferimenti all'altra lega in ${htmlName}: ${text}`);
  }

  const loader = read(path.join(spec.dir, 'assets', 'js', 'core', 'league-config-v443.js'));
  if (/audit\s*clone\s*FantaPetillo|15\/06\/2026/i.test(loader)) fail(`${spec.label}: loader contiene ancora footer hard-coded vecchio`);
  if (!loader.includes('branding.footerTemplate') || !loader.includes('branding.footerLastUpdated')) fail(`${spec.label}: loader non legge footer da config`);
  const config = JSON.parse(read(path.join(spec.dir, 'assets', 'league-config.json')));
  if (config.currentVersion !== '472') fail(`${spec.label}: currentVersion non e' 472`);
  if (config.branding?.footerLastUpdated !== '17/06/2026') fail(`${spec.label}: footerLastUpdated non e' configurato`);
}

const fantaDir = resolveLeagueDir('fantapetillomantramanager');
const fantaNews = read(path.join(fantaDir, 'news.html'));
if (/ZonaOrientale|zonaorientale|Playoff - Decise le finaliste|news-ujE2CqJMjzkYhhjzZZHD|COMUNICATO UFFICIALE DEL PRESIDENTE DI LEGA/i.test(fantaNews)) {
  fail('FantaPetillo news.html contiene ancora contenuti/id derivati da ZonaOrientale');
}
if (!/Comunicati - FantaPetilloMantraManager/.test(fantaNews) || !/\.\/#news/.test(fantaNews)) {
  fail('FantaPetillo news.html non usa il fallback comunicati dedicato');
}

const fantaGenerator = read(path.join(fantaDir, 'tools', 'generate-news-share-pages.mjs'));
if (/ZonaOrientale Salerno|silviobarra\.com\/zonaorientale|ZONAORIENTALE_BASE_URL|ZONAORIENTALE_SHARE_IMAGE/.test(fantaGenerator)) {
  fail('Generator statico FantaPetillo contiene ancora default ZonaOrientale');
}
if (!/function buildNoNewsHtml/.test(fantaGenerator)) {
  fail('Generator statico FantaPetillo non gestisce news vuote');
}

if (failures > 0) process.exit(1);
pass('footer runtime V472 e news FantaPetillo isolate senza rimozioni funzionali');
