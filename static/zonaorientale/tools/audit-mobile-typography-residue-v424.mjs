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
  if (!condition && !quiet) console.error(`x ${message}`);
};

for (const file of [
  "index.html",
  "competition.html",
  "player.html",
  "assets/app.js",
  "assets/css/refactor/mobile-controls.css",
  "tools/audit-mobile-typography-global-v423.mjs"
]) {
  assert(exists(file), `file richiesto presente: ${file}`);
}

const app = read("assets/app.js");
const css = read("assets/css/refactor/mobile-controls.css");
const htmlFiles = ["index.html", "competition.html", "player.html"].map((name) => [name, read(name)]);
const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = runtimeMatch ? runtimeMatch[1] : "";

assert(Number(runtimeVersion) >= 424, `runtime aggiornato almeno a V424: V${runtimeVersion || "non rilevata"}`);
assert(app.includes("ZonaOrientaleMobileTypographyV424"), "marker runtime V424 presente");
assert(app.includes("news") && app.includes("competitions") && app.includes("honor") && app.includes("fantamercato"), "marker V424 copre sezioni residue");

assert(css.includes("V424 - Scala mobile uniforme sulle sezioni residue"), "blocco CSS V424 presente");
assert(css.includes("--zo-mobile-card-title-v424") && css.includes("--zo-mobile-card-text-v424"), "variabili scala V424 presenti");
assert(css.includes(".news-card h3") && css.includes(".dashboard-news-card h3"), "News e comunicati coperti dalla scala V424");
assert(css.includes(".competition-card h3") && css.includes(".mobile-competition-heading"), "Competizioni coperte dalla scala V424");
assert(css.includes(".honor-table-wrap th") && css.includes("table.mobile-honor-table td"), "Albo d'Oro coperto dalla scala V424");
assert(css.includes(".roster-club-card") && css.includes(".app-page[data-page=\"clubs\"]"), "Rose/Club coperti dalla scala V424");
assert(css.includes(".transfer-market-table") && css.includes(".app-page[data-page=\"fantamercato\"]"), "Fantamercato coperto dalla scala V424");
assert(css.includes("padding-top: .34rem") && css.includes("padding-bottom: .34rem"), "tabelle residue compatte da mobile");
assert(css.includes("@media (max-width: 380px)"), "fallback schermi stretti presente");

for (const [name, html] of htmlFiles) {
  assert(new RegExp(`V${runtimeVersion}\\b`).test(html), `${name} footer V424+ presente`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  assert(versions.length === 0 || versions.every((version) => version === runtimeVersion), `${name} cache-buster allineati al runtime`);
  assert(!html.includes("sezioni/stats.html") && !html.includes("sezioni/compare.html"), `${name} non reintroduce pagine standalone`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
assert(appVersions.length === 0 || appVersions.every((version) => version === runtimeVersion), "assets/app.js cache-buster allineati al runtime");

const failed = checks.filter((check) => !check.ok);
if (!quiet) console.log(`Audit V424 completato: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
