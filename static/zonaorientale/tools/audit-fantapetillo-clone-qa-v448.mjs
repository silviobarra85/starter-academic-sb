#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const siteRoot = path.resolve(scriptDir, '..');
const staticRoot = path.resolve(siteRoot, '..');
const cloneSlug = 'fantapetillomantramanager';
const cloneRoot = path.join(staticRoot, cloneSlug);
const docsRoot = path.resolve(siteRoot, '..', '..', 'docs');
let failures = 0;
let checks = 0;
function ok(message) { checks += 1; if (!quiet) console.log(`OK: ${message}`); }
function fail(message) { checks += 1; failures += 1; console.error(`FAIL: ${message}`); }
function check(condition, message) { condition ? ok(message) : fail(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function json(file) { return JSON.parse(read(file)); }
function exists(rel, base = cloneRoot) { return fs.existsSync(path.join(base, rel)); }
function listFiles(dir, predicate = () => true) {
  const out = [];
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (predicate(full)) out.push(full);
    }
  }
  if (fs.existsSync(dir)) walk(dir);
  return out;
}
function assertNoPublicZonaRefs(files) {
  const banned = [
    'https://silviobarra.com/zonaorientale/',
    '/zonaorientale/',
    'zonaorientale-d07af',
    'gstatic.com/firebasejs/10.8.0/firebase-firestore.js',
  ];
  for (const file of files) {
    const text = read(file);
    const rel = path.relative(cloneRoot, file);
    const hits = banned.filter((needle) => text.includes(needle));
    check(hits.length === 0, `${rel} senza riferimenti pubblici/Firebase ZonaOrientale${hits.length ? ` (${hits.join(', ')})` : ''}`);
  }
}

try {
  const zonaConfig = json(path.join(siteRoot, 'assets', 'league-config.json'));
  check(Number(zonaConfig.currentVersion) >= 448, `ZonaOrientale currentVersion V${zonaConfig.currentVersion}`);
  check(zonaConfig.guardrails?.cloneSandboxAudited === true, 'guardrail cloneSandboxAudited presente');
  check(['sandbox-audited-v448','firebase-bootstrap-v449','admin-bootstrap-v450','admin-onboarding-v451','favicon-v452','regolamento-v453'].includes(zonaConfig.futureLeagueCandidate?.status), 'stato candidato compatibile V448+');

  check(fs.existsSync(cloneRoot), 'clone FantaPetillo presente');
  const cloneConfig = json(path.join(cloneRoot, 'assets', 'league-config.json'));
  check(Number(cloneConfig.currentVersion) >= 448, `clone currentVersion V${cloneConfig.currentVersion}`);
  check(cloneConfig.leagueId === cloneSlug && cloneConfig.slug === cloneSlug, 'identita clone coerente');
  check(cloneConfig.name === 'FantaPetilloMantraManager', 'nome clone coerente');
  check(cloneConfig.basePath === `/${cloneSlug}/`, 'basePath clone coerente');
  check(cloneConfig.siteUrl === `https://silviobarra.com/${cloneSlug}/`, 'siteUrl clone coerente');
  check((cloneConfig.guardrails?.firebaseDisabled === true && cloneConfig.sandbox?.firebase === 'disabled') || ['bootstrap-v449','admin-bootstrap-v450'].includes(cloneConfig.guardrails?.firebaseConnected), 'Firebase clone in stato sandbox V448 o bootstrap V449');
  check(cloneConfig.guardrails?.readyForFirebaseConfig === true, 'clone pronto per step Firebase ma ancora sandbox');
  check((cloneConfig.features?.admin === false || cloneConfig.features?.admin === true) && cloneConfig.features?.teamArea === false, 'feature live rischiose disabilitate');

  const htmlFiles = ['index.html', 'competition.html', 'player.html', 'bilanci.html'].map((f) => path.join(cloneRoot, f));
  for (const htmlFile of htmlFiles) {
    const text = read(htmlFile);
    const rel = path.basename(htmlFile);
    check(text.includes('FantaPetilloMantraManager') || rel === 'bilanci.html', `${rel} branding clone/sandbox`);
    const versions = [...new Set((text.match(/\?v=\d+/g) || []).map((item) => item.slice(3)))];
    if (versions.length) check(versions.length === 1 && Number(versions[0]) >= 448, `${rel} cache-buster V${versions[0]}`);
    check(!text.includes('silviobarra.com/zonaorientale') && !text.includes('/zonaorientale/'), `${rel} senza URL pubblici ZonaOrientale`);
  }
  check(read(path.join(cloneRoot, 'index.html')).includes('fanta-petillo-sandbox-v448.js?v=448') || read(path.join(cloneRoot, 'index.html')).includes('fanta-petillo-firebase-bootstrap-v449.js?v=449') || read(path.join(cloneRoot, 'index.html')).includes('fanta-petillo-admin-bootstrap-v450.js?v=453'), 'home carica guard sandbox/bootstrap');
  check(read(path.join(cloneRoot, 'competition.html')).includes('fanta-petillo-sandbox-v448.js?v=448') || read(path.join(cloneRoot, 'competition.html')).includes('fanta-petillo-firebase-bootstrap-v449.js?v=449') || read(path.join(cloneRoot, 'competition.html')).includes('fanta-petillo-admin-bootstrap-v450.js?v=453'), 'competition carica guard sandbox/bootstrap');
  check(read(path.join(cloneRoot, 'player.html')).includes('fanta-petillo-sandbox-v448.js?v=448') || read(path.join(cloneRoot, 'player.html')).includes('fanta-petillo-firebase-bootstrap-v449.js?v=449') || read(path.join(cloneRoot, 'player.html')).includes('fanta-petillo-admin-bootstrap-v450.js?v=453'), 'player carica guard sandbox/bootstrap');

  const firebaseText = read(path.join(cloneRoot, 'assets', 'firebase.js'));
  check(firebaseText.includes('Firebase disabled sandbox adapter') || firebaseText.includes('fantapetillomantramanager.firebaseapp.com'), 'Firebase sandbox o dedicato presente');
  check(!firebaseText.includes('zonaorientale-d07af') && !firebaseText.includes('AIzaSyB7YQM3'), 'Firebase ZonaOrientale assente dal clone');
  check(firebaseText.includes('firebaseDisabled: true') || firebaseText.includes('FantaPetilloFirebaseConfigV449') || firebaseText.includes('FantaPetilloFirebaseConfigV450'), 'marker Firebase clone presente');

  const publicFiles = [
    ...htmlFiles,
    path.join(cloneRoot, 'assets', 'league-config.json'),
    path.join(cloneRoot, 'assets', 'firebase.js'),
    path.join(cloneRoot, 'assets', 'app.js'),
    path.join(cloneRoot, 'assets', 'js', 'core', 'league-config-v443.js'),
    path.join(cloneRoot, 'assets', 'js', 'core', 'fanta-petillo-sandbox-v448.js'),
    path.join(cloneRoot, 'assets', 'js', 'core', 'fanta-petillo-firebase-bootstrap-v449.js'),
    path.join(cloneRoot, 'assets', 'js', 'core', 'fanta-petillo-admin-bootstrap-v450.js')
  ].filter((file) => fs.existsSync(file));
  assertNoPublicZonaRefs(publicFiles);

  check(exists('assets/snapshots/seasons/2025-2026.json'), 'snapshot placeholder clone presente');
  check(!exists('assets/snapshots/seasons/2004-2005.json'), 'storico ZonaOrientale non copiato nel clone');
  check(exists('assets/listoni/manifest.json') && exists('assets/rose/manifest.json') && exists('assets/competitions/manifest.json'), 'manifest placeholder presenti');
  check(!exists('assets/listoni/2026-06-07.json', siteRoot), 'listone duplicato 2026-06-07 non reinserito in ZonaOrientale');

  const readmePath = path.join(docsRoot, cloneSlug, 'README.md');
  check(fs.existsSync(readmePath), 'README clone presente');
  const readme = fs.existsSync(readmePath) ? read(readmePath) : '';
  check(readme.includes('V448') || readme.includes('V449') || readme.includes('V450'), 'README clone aggiornato V448+');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit clone QA V448 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit clone QA V448 superato: ${checks} controlli.`);
