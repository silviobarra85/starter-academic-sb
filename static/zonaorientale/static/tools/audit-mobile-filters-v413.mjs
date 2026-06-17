#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const quiet = process.argv.includes("--quiet");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const fail = (message) => {
  console.error(`V413 audit failed: ${message}`);
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

includes(app, 'DEPLOY_EXPECTED_VERSION_V181 = "413"', "runtime version V413");
for (const [name, html] of [["index.html", index], ["competition.html", competition], ["player.html", player]]) {
  includes(html, "V413 filtri mobile compatti", `${name} footer V413`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  const unique = new Set(versions);
  if (unique.size !== 1 || !unique.has("413")) {
    fail(`${name} cache-buster non allineati: ${[...unique].join(",") || "nessuno"}`);
  }
  ok(`${name} cache-buster V413`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
const appUnique = new Set(appVersions);
if (appUnique.size !== 1 || !appUnique.has("413")) {
  fail(`assets/app.js cache-buster non allineati: ${[...appUnique].join(",") || "nessuno"}`);
}
ok("assets/app.js cache-buster V413");

includes(mobileCss, "V413 - Filtri mobile compatti per Listone e Calciomercato", "blocco CSS V413 presente");
includes(mobileCss, '.app-page[data-page="listone"] .listone-filter-row', "scope Listone presente");
includes(mobileCss, '.app-page[data-page="calciomercato"] .calciomercato-filters-v306', "scope Calciomercato presente");
includes(mobileCss, "grid-template-columns: repeat(3, minmax(0, 1fr))", "filtri stato Listone a griglia");
includes(mobileCss, "grid-template-columns: repeat(4, minmax(0, 1fr))", "filtri ruolo Listone a griglia");
includes(mobileCss, "min-height: 38px", "controlli filtri compatti ma cliccabili");
includes(mobileCss, "@media (min-width: 430px) and (max-width: 820px)", "layout Calciomercato 2 colonne su mobile largo");
includes(mobileCss, "@media (max-width: 360px)", "fallback telefoni stretti");

// Preservazioni recenti e vincoli di sicurezza.
includes(index, 'data-page-link="listone"', "Listone raggiungibile da navigazione legacy");
includes(index, 'data-page-link="calciomercato"', "Calciomercato raggiungibile da navigazione legacy");
includes(index, 'data-listone-status-filter="inListone"', "filtri stato Listone preservati");
includes(index, 'data-listone-role-filter="P"', "filtri ruolo Listone preservati");
includes(index, 'id="calciomercatoTeamFilterV306"', "filtro squadra Calciomercato preservato");
includes(index, 'id="calciomercatoSearchV306"', "ricerca Calciomercato preservata");
includes(index, 'id="calciomercatoApplyRangeV316"', "azione range Calciomercato preservata");
includes(calciomercatoCss, "V410 - Calciomercato mobile", "V410 preservata");
includes(mobileCss, "V412 - Menu Altro mobile compatto", "V412 preservata");
includes(styles, "roster-listone-skin-v408", "V408 preservata");

for (const forbidden of ["sezioni/", "role-backgrounds-v405r2", "audit-section-entrypoints"]) {
  if (index.includes(forbidden) || app.includes(forbidden)) {
    fail(`riferimento non desiderato trovato nel runtime: ${forbidden}`);
  }
}
ok("nessun ritorno al refactor standalone o asset sperimentali");

if (!quiet) console.log("Audit V413 filtri mobile compatti completato.");
