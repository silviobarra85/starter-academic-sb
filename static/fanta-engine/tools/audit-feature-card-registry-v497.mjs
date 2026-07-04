#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd(); let ok = 0, fail = 0; const failures = [];
function abs(p){ return path.join(root,p); }
function exists(p){ return fs.existsSync(abs(p)); }
function read(p){ return fs.readFileSync(abs(p),'utf8'); }
function readJson(p){ return JSON.parse(read(p)); }
function check(c,l){ if(c){ok++; console.log(`OK  - ${l}`)} else {fail++; failures.push(l); console.error(`FAIL - ${l}`)} }
const modulePath = 'fanta-engine/js/core/feature-card-registry-v497.js';
check(exists(modulePath), 'feature card registry module V497 presente');
const mod = read(modulePath);
for (const token of ['FEATURE_CARD_REGISTRY_VERSION_V497','DEFAULT_FEATURE_CARDS_V497','buildFeatureCardRegistryV497','installFeatureCardRegistryV497','isFeatureCardEnabledV497','mergeCardsV497']) check(mod.includes(token), `token registry presente ${token}`);
check(!mod.includes('ZonaOrientale Salerno'), 'registry comune senza brand Zona hardcoded');
check(!mod.includes('FantaMantraManager'), 'registry comune senza brand FMM hardcoded');
check(exists('fanta-engine/data/feature-card-registry-v497.json'), 'manifest feature-card-registry V497 presente');
const manifest = readJson('fanta-engine/data/feature-card-registry-v497.json');
check(manifest.version === 'V497', 'manifest V497 corretto');
for (const cfgPath of ['zonaorientale/assets/league-config.json','fantapetillomantramanager/assets/league-config.json']) {
  const cfg = readJson(cfgPath);
  check(cfg.currentVersion === 497, `${cfgPath} currentVersion V497`);
  check(cfg.features?.featureCardRegistry === true, `${cfgPath} featureCardRegistry attivo`);
  check(cfg.features?.featureCardRegistryVersion === 'V497', `${cfgPath} featureCardRegistryVersion V497`);
  check(cfg.featureCardRegistry?.version === 'V497', `${cfgPath} blocco featureCardRegistry V497`);
  check(Array.isArray(cfg.featureCardRegistry?.cards), `${cfgPath} cards registry array`);
  check(cfg.featureCardRegistry.cards.length >= 3, `${cfgPath} almeno 3 card configurate`);
}
const fmmCfg = readJson('fantapetillomantramanager/assets/league-config.json');
const fmmCards = fmmCfg.featureCardRegistry.cards.map(c=>c.id);
check(fmmCards.includes('release-players'), 'FMM registry include Svincola Giocatori');
check(fmmCards.includes('trade-announcement'), 'FMM registry include Comunicato avvenuto scambio');
check(fmmCards.includes('rule-proposals'), 'FMM registry include Proposte regolamento');
check(fmmCfg.features?.presidentReleasePlayers === true, 'FMM feature presidentReleasePlayers attiva');
check(fmmCfg.features?.presidentTradeAnnouncement === true, 'FMM feature presidentTradeAnnouncement attiva');
for (const appPath of ['zonaorientale/assets/app.js','fantapetillomantramanager/assets/app.js']) {
  const app = read(appPath);
  check(app.includes('feature-card-registry-v497.js?v=497'), `${appPath} importa registry V497`);
  check(app.includes('FantaEngineFeatureCardRegistryRuntimeV497'), `${appPath} installa registry V497`);
  check(app.includes('renderAllV497'), `${appPath} refresh registry su renderAll`);
}
for (const corePath of ['zonaorientale/assets/js/core/league-config-v443.js','fantapetillomantramanager/assets/js/core/league-config-v443.js']) {
  const text = read(corePath);
  check(text.includes("currentVersion: '497'"), `${corePath} currentVersion runtime V497`);
  check(text.includes('featureCardRegistryV497'), `${corePath} traccia featureCardRegistryV497`);
  check(text.includes('league-config.json?v=497'), `${corePath} fetch config V497`);
}
for (const htmlPath of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html','fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html','fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html']) {
  const html = read(htmlPath);
  check(html.includes('v=497') || html.includes('V497'), `${htmlPath} cache/footer V497`);
}
for (const doc of ['../docs/AI_ASSISTANT_HANDOFF_V497.md','../docs/fantapetillomantramanager/FEATURE_CARD_REGISTRY_V497.md','../docs/zonaorientale/FEATURE_CARD_REGISTRY_V497.md']) check(exists(doc), `doc presente ${doc}`);
check(!exists('zonaorientale/static'), 'copia annidata zonaorientale/static assente');
if(fail>0){ console.error(`\nAudit feature card registry V497 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f=>console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit feature card registry V497 completato: ${ok} OK, ${fail} FAIL`);
