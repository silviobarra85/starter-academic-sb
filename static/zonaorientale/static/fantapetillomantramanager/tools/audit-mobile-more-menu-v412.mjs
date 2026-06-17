#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const quiet = process.argv.includes("--quiet");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const fail = (message) => {
  console.error(`V412 audit failed: ${message}`);
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

includes(app, 'DEPLOY_EXPECTED_VERSION_V181 = "412"', "runtime version V412");
for (const [name, html] of [["index.html", index], ["competition.html", competition], ["player.html", player]]) {
  includes(html, "V412 menu mobile compatto", `${name} footer V412`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  const unique = new Set(versions);
  if (unique.size !== 1 || !unique.has("412")) {
    fail(`${name} cache-buster non allineati: ${[...unique].join(",") || "nessuno"}`);
  }
  ok(`${name} cache-buster V412`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
const appUnique = new Set(appVersions);
if (appUnique.size !== 1 || !appUnique.has("412")) {
  fail(`assets/app.js cache-buster non allineati: ${[...appUnique].join(",") || "nessuno"}`);
}
ok("assets/app.js cache-buster V412");

includes(mobileCss, "V412 - Menu Altro mobile compatto", "blocco CSS V412 presente");
includes(mobileCss, "max-height: min(72dvh, calc(100dvh - 128px));", "menu Altro mobile con altezza controllata");
includes(mobileCss, "overflow-y: auto;", "menu Altro mobile scrollabile");
includes(mobileCss, "grid-template-columns: repeat(2, minmax(0, 1fr));", "menu Altro mobile a due colonne");
includes(mobileCss, ".mobile-more-header", "header menu Altro preservato");
includes(mobileCss, "grid-column: 1 / -1;", "header menu Altro a larghezza piena");
includes(mobileCss, "@media (max-width: 360px)", "fallback schermi molto piccoli");

const moreLinks = [...index.matchAll(/class="mobile-more-link/g)].length;
if (moreLinks < 10) fail(`menu Altro mobile ha pochi link (${moreLinks})`);
ok(`menu Altro mobile preserva ${moreLinks} link`);

includes(index, 'id="mobileMoreSheet"', "foglio mobile Altro presente");
includes(index, 'id="mobileMoreBtn"', "pulsante Altro mobile presente");
includes(index, 'data-page-link="dashboard"', "navigazione hash legacy preservata");

for (const forbidden of ["sezioni/", "role-backgrounds-v405r2", "audit-section-entrypoints"]) {
  if (index.includes(forbidden) || app.includes(forbidden)) {
    fail(`riferimento non desiderato trovato nel runtime: ${forbidden}`);
  }
}
ok("nessun ritorno al refactor standalone o asset sperimentali");

// Preservazioni recenti: sono controlli statici leggeri, non sostituiscono il QA manuale.
includes(index, 'data-page-link="calciomercato"', "Calciomercato ancora raggiungibile da mobile");
includes(mobileCss, "V411 - Dashboard mobile piu compatta", "V411 preservata");
includes(read("assets/css/refactor/calciomercato.css"), "V410", "V410 preservata nel CSS Calciomercato");
includes(read("assets/styles.css"), "roster-listone-skin-v408", "V408 preservata nel CSS Rose");

if (!quiet) console.log("Audit V412 menu mobile compatto completato.");
