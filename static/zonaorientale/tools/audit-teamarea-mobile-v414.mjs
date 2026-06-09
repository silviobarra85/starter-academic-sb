#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const quiet = process.argv.includes("--quiet");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const fail = (message) => {
  console.error(`V414 audit failed: ${message}`);
  process.exit(1);
};
const ok = (message) => {
  if (!quiet) console.log(`ok - ${message}`);
};
const includes = (content, needle, message) => {
  if (!content.includes(needle)) fail(message || `missing ${needle}`);
  ok(message || `found ${needle}`);
};

const index = read("index.html");
const competition = read("competition.html");
const player = read("player.html");
const app = read("assets/app.js");
const mobileCss = read("assets/css/refactor/mobile-controls.css");
const calciomercatoCss = read("assets/css/refactor/calciomercato.css");
const styles = read("assets/styles.css");

includes(app, 'DEPLOY_EXPECTED_VERSION_V181 = "414"', "runtime version V414");
for (const [name, html] of [["index.html", index], ["competition.html", competition], ["player.html", player]]) {
  includes(html, "V414 area squadra mobile compatta", `${name} footer V414`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  const unique = new Set(versions);
  if (unique.size !== 1 || !unique.has("414")) {
    fail(`${name} cache-buster non allineati: ${[...unique].join(",") || "nessuno"}`);
  }
  ok(`${name} cache-buster V414`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
const appUnique = new Set(appVersions);
if (appUnique.size !== 1 || !appUnique.has("414")) {
  fail(`assets/app.js cache-buster non allineati: ${[...appUnique].join(",") || "nessuno"}`);
}
ok("assets/app.js cache-buster V414");

includes(mobileCss, "V414 - Area Squadra mobile compatta", "blocco CSS V414 presente");
includes(mobileCss, '.app-page[data-page="teamarea"] #teamAreaBody', "scope Area Squadra presente");
includes(mobileCss, '.app-page[data-page="teamarea"] .user-actions-grid', "azioni Area Squadra in griglia mobile");
includes(mobileCss, '.app-page[data-page="teamarea"] .form-grid', "form Area Squadra compatti");
includes(mobileCss, '.app-page[data-page="teamarea"] .president-dashboard-v369', "dashboard presidente inclusa nello scope");
includes(mobileCss, 'grid-template-columns: repeat(3, minmax(0, 1fr))', "metriche compatte a 3 colonne");
includes(mobileCss, 'min-height: 38px', "tap target compatti ma leggibili");
includes(mobileCss, 'max-height: 58dvh', "tabelle dashboard con altezza controllata");
includes(mobileCss, '@media (max-width: 360px)', "fallback telefoni stretti presente");

// Verifica che i campi e i flussi originali dell'Area Squadra non siano stati rimossi.
for (const id of [
  'id="teamAreaBody"',
  'id="teamFmRequestForm"',
  'id="teamMarketRequestForm"',
  'id="teamNewsRequestForm"',
  'id="teamFmRequestType"',
  'id="teamMarketRequestType"',
  'id="teamNewsRequestBody"',
  'data-page-link="teamarea"'
]) {
  includes(app + index, id, `preservato ${id}`);
}

// Preservazioni recenti.
includes(mobileCss, "V413 - Filtri mobile compatti", "V413 preservata");
includes(mobileCss, "V412 - Menu Altro mobile compatto", "V412 preservata");
includes(calciomercatoCss, "V410 - Calciomercato mobile", "V410 preservata");
includes(styles, "roster-listone-skin-v408", "V408 preservata");

for (const forbidden of ["sezioni/", "role-backgrounds-v405r2", "audit-section-entrypoints"]) {
  if (index.includes(forbidden) || app.includes(forbidden)) {
    fail(`riferimento non desiderato trovato nel runtime: ${forbidden}`);
  }
}
ok("nessun ritorno al refactor standalone o asset sperimentali");

if (!quiet) console.log("Audit V414 Area Squadra mobile completato.");
