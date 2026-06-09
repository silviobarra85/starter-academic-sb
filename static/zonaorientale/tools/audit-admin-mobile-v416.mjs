#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const quiet = process.argv.includes("--quiet");
const checks = [];
const read = (rel) => readFileSync(join(root, rel), "utf8");
const assert = (condition, message) => {
  checks.push({ ok: Boolean(condition), message });
  if (!condition && !quiet) console.error(`✗ ${message}`);
};

const requiredFiles = [
  "index.html",
  "competition.html",
  "player.html",
  "assets/app.js",
  "assets/css/refactor/mobile-controls.css",
  "assets/css/refactor/rosters-tables.css",
  "tools/audit-mobile-home-teamprofile-v415.mjs",
];
for (const file of requiredFiles) assert(existsSync(join(root, file)), `file presente: ${file}`);

const app = read("assets/app.js");
const mobileCss = read("assets/css/refactor/mobile-controls.css");
const rostersCss = read("assets/css/refactor/rosters-tables.css");
const index = read("index.html");
const competition = read("competition.html");
const player = read("player.html");

const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = runtimeMatch ? Number(runtimeMatch[1]) : 0;
assert(runtimeVersion >= 416, `runtime V${runtimeVersion || "?"} compatibile con audit V416`);
for (const [name, html] of [["index.html", index], ["competition.html", competition], ["player.html", player]]) {
  assert(html.includes(`V${runtimeVersion}`), `${name} contiene footer runtime V${runtimeVersion}`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((m) => Number(m[1]));
  assert(versions.length === 0 || versions.every((v) => v === runtimeVersion), `${name} cache-buster allineati a V${runtimeVersion}`);
}
const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((m) => Number(m[1]));
assert(appVersions.length === 0 || appVersions.every((v) => v === runtimeVersion), `assets/app.js cache-buster allineati a V${runtimeVersion}`);

assert(mobileCss.includes("V416 - Admin mobile compatto"), "blocco CSS V416 presente");
assert(mobileCss.includes('.app-page[data-page="admin"] .form-grid'), "form-grid admin mobile protetta");
assert(mobileCss.includes('.app-page[data-page="admin"] .admin-list'), "liste admin mobile protette");
assert(mobileCss.includes('.app-page[data-page="admin"] .result-admin-table-wrap'), "tabelle admin mobile protette");
assert(mobileCss.includes('@media (min-width: 520px) and (max-width: 820px)'), "breakpoint tablet/mobile admin presente");

assert(rostersCss.includes("V415 - La mia squadra con skin Listone"), "V415 La mia squadra preservata");
assert(app.includes("ensureMobileLatestNewsCardFirstV415"), "V415 home mobile preservata");
assert(!index.includes("sezioni/stats.html"), "nessun ritorno alle pagine standalone");
assert(!index.includes("role-backgrounds-v405r2"), "nessun asset sperimentale colori ruolo");

const failed = checks.filter((check) => !check.ok);
if (!quiet) {
  console.log(`Audit V416 completato: ${checks.length - failed.length}/${checks.length} controlli superati.`);
}
if (failed.length) process.exit(1);
