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
  "tools/audit-archive-mobile-v419.mjs"
]) {
  assert(exists(file), `file richiesto presente: ${file}`);
}

const app = read("assets/app.js");
const css = read("assets/css/refactor/mobile-controls.css");
const htmlFiles = ["index.html", "competition.html", "player.html"].map((name) => [name, read(name)]);
const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = runtimeMatch ? runtimeMatch[1] : "";

assert(Number(runtimeVersion) >= 420, `runtime almeno V420: V${runtimeVersion || "non rilevata"}`);
assert(app.includes("ZonaOrientaleMobileTypographyV420"), "marker runtime tipografia mobile V420 presente");
assert(app.includes('name: "0.78rem"'), "scala nome/titolo 0.78rem dichiarata");
assert(app.includes('subtext: "0.66rem"'), "scala sottotesto 0.66rem dichiarata");
assert(app.includes('label: "0.62rem"'), "scala label 0.62rem dichiarata");
assert(app.includes('value: "0.73rem"'), "scala valore 0.73rem dichiarata");
assert(app.includes("ZonaOrientaleArchiveMobileV419"), "marker V419 preservato");
assert(app.includes("ZonaOrientaleMobileAccessibilityV418"), "marker V418 preservato");

assert(css.includes("V420 - Scala tipografica mobile globale"), "blocco CSS V420 presente");
assert(css.includes("--zo-mobile-name-font-v420: 0.78rem"), "variabile nome 0.78rem presente");
assert(css.includes("--zo-mobile-subtext-font-v420: 0.66rem"), "variabile sottotesto 0.66rem presente");
assert(css.includes("--zo-mobile-label-font-v420: 0.62rem"), "variabile label 0.62rem presente");
assert(css.includes("--zo-mobile-value-font-v420: 0.73rem"), "variabile valore 0.73rem presente");
assert(css.includes(".season-archive-card-v196 h3"), "Archivio usa scala titoli card");
assert(css.includes(".season-archive-team-card-v196 strong"), "Squadre stagione preservate come riferimento");
assert(css.includes(".calciomercato-card-v306"), "Calciomercato coperto dalla scala mobile");
assert(css.includes(".listone-table") && css.includes(".team-profile-roster-table-v415"), "tabelle Listone/La mia squadra coperte");
assert(css.includes(".mobile-home-card") && css.includes(".admin-list-item"), "home mobile e admin coperti dalla scala");

for (const [name, html] of htmlFiles) {
  assert(html.includes(`V${runtimeVersion}`), `${name} footer V${runtimeVersion} presente`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  assert(versions.length === 0 || versions.every((version) => version === runtimeVersion), `${name} cache-buster allineati a V${runtimeVersion}`);
  assert(!html.includes("sezioni/stats.html"), `${name} non reintroduce pagine standalone`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
assert(appVersions.length === 0 || appVersions.every((version) => version === runtimeVersion), `assets/app.js cache-buster allineati a V${runtimeVersion}`);

const failed = checks.filter((check) => !check.ok);
if (!quiet) console.log(`Audit V420 completato: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
