#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const quiet = process.argv.includes("--quiet");
const checks = [];
const read = (rel) => readFileSync(join(root, rel), "utf8");
const exists = (rel) => existsSync(join(root, rel));
const assert = (condition, message) => {
  checks.push({ ok: Boolean(condition), message });
  if (!condition && !quiet) console.error(`✗ ${message}`);
};

for (const file of [
  "index.html",
  "competition.html",
  "player.html",
  "assets/app.js",
  "assets/css/refactor/mobile-controls.css",
  "tools/audit-mobile-scale-archive-v422.mjs"
]) {
  assert(exists(file), `file richiesto presente: ${file}`);
}

const app = read("assets/app.js");
const css = read("assets/css/refactor/mobile-controls.css");
const htmlFiles = ["index.html", "competition.html", "player.html"].map((name) => [name, read(name)]);
const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = runtimeMatch ? runtimeMatch[1] : "";

assert(Number(runtimeVersion) >= 423, `runtime aggiornato almeno a V423: V${runtimeVersion || "non rilevata"}`);
assert(app.includes("ZonaOrientaleMobileTypographyV423"), "marker runtime V423 presente");
assert(app.includes("extendsScaleTo") && app.includes("team-profile-roster"), "marker V423 copre tabelle Rosa");

assert(css.includes("V423 - Scala mobile estesa"), "blocco CSS V423 presente");
assert(css.includes("--zo-mobile-section-title-v423: 0.98rem"), "titoli principali mobile ridimensionati");
assert(css.includes(".team-compare-page-v195") && css.includes(".team-compare-metrics-v195"), "Confronta Squadre coperto dalla scala V423");
assert(css.includes(".historical-stats-summary-v193") && css.includes(".historical-ranking-row-v193"), "Statistiche storiche coperte dalla scala V423");
assert(css.includes(".team-profile-roster-table .roster-player-cell") && css.includes(".roster-listone-skin-v408 .roster-player-cell"), "nomi giocatore Rosa e Listone allineati");
assert(css.includes("repeat(2, minmax(0, 1fr)) !important"), "informazioni compatte in due colonne dove possibile");
assert(css.includes("repeat(3, minmax(0, 1fr)) !important"), "score confronto mantenuto compatto sulla stessa riga");

for (const [name, html] of htmlFiles) {
  assert(new RegExp(`V${runtimeVersion}\\b`).test(html), `${name} footer >= V423 presente`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  assert(versions.length === 0 || versions.every((version) => version === runtimeVersion), `${name} cache-buster allineati alla versione runtime`);
  assert(!html.includes("sezioni/stats.html") && !html.includes("sezioni/compare.html"), `${name} non reintroduce pagine standalone`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
assert(appVersions.length === 0 || appVersions.every((version) => version === runtimeVersion), "assets/app.js cache-buster allineati alla versione runtime");

const failed = checks.filter((check) => !check.ok);
if (!quiet) console.log(`Audit V423 completato: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
