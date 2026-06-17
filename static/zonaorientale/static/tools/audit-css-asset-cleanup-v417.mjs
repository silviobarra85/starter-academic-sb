#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join, dirname, normalize } from "node:path";

const root = process.cwd();
const quiet = process.argv.includes("--quiet");
const checks = [];
const read = (rel) => readFileSync(join(root, rel), "utf8");
const assert = (condition, message) => {
  checks.push({ ok: Boolean(condition), message });
  if (!condition && !quiet) console.error(`✗ ${message}`);
};
const exists = (rel) => existsSync(join(root, rel));

const requiredFiles = [
  "index.html",
  "competition.html",
  "player.html",
  "assets/app.js",
  "assets/styles.css",
  "assets/css/refactor/mobile-controls.css",
  "assets/css/refactor/rosters-tables.css",
  "assets/css/refactor/listone.css",
  "assets/css/refactor/calciomercato.css",
  "assets/css/refactor/theme-light-suspended.css",
  "tools/audit-admin-mobile-v416.mjs",
  "tools/audit-mobile-home-teamprofile-v415.mjs"
];
for (const file of requiredFiles) assert(exists(file), `file richiesto presente: ${file}`);

const obsoleteCss = [
  "assets/css/refactor/mobile-controls-v291.css",
  "assets/css/refactor/rosters-tables-v291.css",
  "assets/css/refactor/mobile-controls-v292.css",
  "assets/css/refactor/rosters-tables-v292.css",
  "assets/css/refactor/theme-light-suspended-v292.css"
];
for (const file of obsoleteCss) assert(!exists(file), `CSS legacy rimosso dal pacchetto: ${file}`);

const app = read("assets/app.js");
const index = read("index.html");
const competition = read("competition.html");
const player = read("player.html");

const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = runtimeMatch ? runtimeMatch[1] : '';
assert(Number(runtimeVersion) >= 417, `runtime almeno V417: V${runtimeVersion || 'non rilevata'}`);
assert(app.includes("ZonaOrientaleCssAssetCleanupV417"), "marker runtime V417 presente");
assert(app.includes("ZonaOrientaleMobileHomeTeamProfileV415"), "V415 home/squadra preservata");

for (const [name, html] of [["index.html", index], ["competition.html", competition], ["player.html", player]]) {
  assert(html.includes(`V${runtimeVersion}`), `${name} footer V${runtimeVersion} presente`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  assert(versions.length === 0 || versions.every((version) => version === runtimeVersion), `${name} cache-buster allineati a V${runtimeVersion}`);
  assert(!html.includes("role-backgrounds-v405r2"), `${name} non carica asset colori sperimentali`);
  assert(!html.includes("sezioni/stats.html"), `${name} non reintroduce pagine standalone`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
assert(appVersions.length === 0 || appVersions.every((version) => version === runtimeVersion), `assets/app.js cache-buster allineati a V${runtimeVersion}`);

const localAssetRefs = [];
const collectHtmlRefs = (html, source) => {
  for (const match of html.matchAll(/(?:href|src)=["']\.\/([^"'#?]+)(?:[?#][^"']*)?["']/g)) {
    localAssetRefs.push({ source, rel: match[1] });
  }
};
collectHtmlRefs(index, "index.html");
collectHtmlRefs(competition, "competition.html");
collectHtmlRefs(player, "player.html");
for (const match of app.matchAll(/from\s+["']\.\/([^"'?]+)(?:\?v=\d+)?["']/g)) {
  localAssetRefs.push({ source: "assets/app.js", rel: `assets/${match[1]}` });
}

for (const { source, rel } of localAssetRefs) {
  const normalized = normalize(rel);
  if (normalized.startsWith("..")) continue;
  assert(exists(normalized), `${source} riferimento locale esistente: ${normalized}`);
}

const stableCss = read("assets/css/refactor/mobile-controls.css") + "\n" + read("assets/css/refactor/rosters-tables.css");
assert(stableCss.includes("V416 - Admin mobile compatto"), "V416 admin mobile preservata nei CSS stabili");
assert(read("assets/css/refactor/rosters-tables.css").includes("V415 - La mia squadra con skin Listone"), "V415 tabella squadra preservata");

const failed = checks.filter((check) => !check.ok);
if (!quiet) console.log(`Audit V417 completato: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
