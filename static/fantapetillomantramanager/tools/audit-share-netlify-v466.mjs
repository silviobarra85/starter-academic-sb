#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const quiet = process.argv.includes('--quiet');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRootCandidates = [resolve(root, '..'), resolve(root, '..', '..')];
const repoRoot = repoRootCandidates.find((candidate) => existsSync(resolve(candidate, 'netlify.toml')) || existsSync(resolve(candidate, 'netlify/functions/news-share.js'))) || repoRootCandidates[0];
const checks = [];
function check(condition, message) { checks.push({ ok: Boolean(condition), message }); }
function read(path) { return readFileSync(path, 'utf8'); }
function has(path) { return existsSync(path); }

const indexPath = resolve(root, 'index.html');
const configPath = resolve(root, 'assets/league-config.json');
const scriptPath = resolve(root, 'assets/js/core/fanta-petillo-share-netlify-v466.js');
const cssPath = resolve(root, 'assets/css/refactor/fanta-petillo-share-netlify-v466.css');
const netlifyTomlPath = resolve(repoRoot, 'netlify.toml');
const newsSharePath = resolve(repoRoot, 'netlify/functions/news-share.js');

check(has(scriptPath), 'script card share/Netlify V466 presente');
check(has(cssPath), 'CSS card share/Netlify V466 presente');
check(has(indexPath) && /fanta-petillo-share-netlify-v466\.js\?v=\d+/.test(read(indexPath)), 'index carica script V466 con cache-buster');
check(has(indexPath) && /fanta-petillo-share-netlify-v466\.css\?v=\d+/.test(read(indexPath)), 'index carica CSS V466 con cache-buster');
if (has(configPath)) {
  const config = JSON.parse(read(configPath));
  check(Number(config.currentVersion) >= 466, 'league-config currentVersion V466');
  check(config.guardrails?.shareNetlifyVersion === '466', 'guardrail share Netlify V466');
  check(config.whatsapp?.newsShareBase?.includes('/fantapetillomantramanager/share/news/'), 'newsShareBase FantaPetillo dedicato');
} else {
  check(false, 'league-config presente');
}
if (has(scriptPath)) {
  const script = read(scriptPath);
  check(script.includes('writesToFirebase: false'), 'card V466 non scrive su Firebase');
  check(script.includes('fantaPetilloShareNetlifyV466'), 'runtime V466 nominale');
  check(script.includes('/fantapetillomantramanager/share/news/:id'), 'card documenta redirect FantaPetillo');
}
check(has(netlifyTomlPath), 'netlify.toml incluso nell overlay V466');
if (has(netlifyTomlPath)) {
  const toml = read(netlifyTomlPath);
  check(toml.includes('/zonaorientale/share/news/:id'), 'redirect ZonaOrientale preservato');
  check(toml.includes('/fantapetillomantramanager/share/news/:id'), 'redirect FantaPetillo presente');
  check(toml.includes('league=fantapetillomantramanager'), 'redirect FantaPetillo passa parametro league');
}
check(has(newsSharePath), 'netlify/functions/news-share.js incluso nell overlay V466');
if (has(newsSharePath)) {
  const newsShare = read(newsSharePath);
  check(newsShare.includes('const LEAGUES'), 'news-share usa mappa leghe');
  check(newsShare.includes('zonaorientale-d07af'), 'news-share preserva progetto ZonaOrientale');
  check(newsShare.includes('fantapetillomantramanager'), 'news-share include progetto FantaPetillo');
  check(newsShare.includes('FANTAPETILLO_FIREBASE_API_KEY'), 'news-share supporta env FantaPetillo');
  check(newsShare.includes('fantapetillo-android-chrome-512-v455.png'), 'news-share usa immagine OG FantaPetillo cache-proof');
}

const failed = checks.filter((item) => !item.ok);
if (!quiet) {
  checks.forEach((item) => console.log(`${item.ok ? 'OK' : 'FAIL'}: ${item.message}`));
}
if (failed.length) process.exit(1);
