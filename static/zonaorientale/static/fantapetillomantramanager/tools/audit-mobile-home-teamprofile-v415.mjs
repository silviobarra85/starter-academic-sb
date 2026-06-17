#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const quiet = process.argv.includes("--quiet");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const fail = (message) => {
  console.error(`V415 audit failed: ${message}`);
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
const styles = read("assets/styles.css");
const rostersCss = read("assets/css/refactor/rosters-tables.css");
const mobileCss = read("assets/css/refactor/mobile-controls.css");

const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = runtimeMatch ? Number(runtimeMatch[1]) : 0;
if (!runtimeVersion || runtimeVersion < 415) fail("runtime version inferiore a V415");
ok(`runtime version V${runtimeVersion} compatibile con audit V415`);

for (const [name, html] of [["index.html", index], ["competition.html", competition], ["player.html", player]]) {
  if (!html.includes(`V${runtimeVersion}`)) fail(`${name} non contiene footer/runtime V${runtimeVersion}`);
  ok(`${name} footer runtime V${runtimeVersion}`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => Number(match[1]));
  const unique = new Set(versions);
  if (unique.size !== 1 || !unique.has(runtimeVersion)) {
    fail(`${name} cache-buster non allineati: ${[...unique].join(",") || "nessuno"}; atteso ${runtimeVersion}`);
  }
  ok(`${name} cache-buster V${runtimeVersion}`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => Number(match[1]));
const appUnique = new Set(appVersions);
if (appUnique.size !== 1 || !appUnique.has(runtimeVersion)) {
  fail(`assets/app.js cache-buster non allineati: ${[...appUnique].join(",") || "nessuno"}; atteso ${runtimeVersion}`);
}
ok(`assets/app.js cache-buster V${runtimeVersion}`);

includes(app, "ensureMobileLatestNewsCardFirstV415", "helper news mobile in cima presente");
includes(app, "mobileHomeFirstV415", "marker card Comunicati prima presente");
includes(app, "applyTeamProfileRosterListoneSkinV415", "helper skin Listone La mia squadra presente");
includes(app, "team-profile-listone-skin-v415", "classe V415 applicata alla tabella squadra");
includes(app, "roster-listone-skin-v408", "riuso skin Listone V408 preservato");
includes(app, "applyPlayerRoleTableBackgroundsV404", "colorazione ruolo riapplicata dopo il render V415");
includes(app, "openTeamProfilePageV415", "pagina La mia squadra post-processata dopo apertura");

includes(rostersCss, "V415 - La mia squadra con skin Listone", "blocco CSS V415 presente");
includes(rostersCss, "table.team-profile-listone-skin-v415", "scope tabella La mia squadra presente");
includes(rostersCss, "table.listone-table th:first-child", "prima colonna Listone sticky preservata");
includes(rostersCss, "table.team-profile-listone-skin-v415 th:first-child", "prima colonna La mia squadra sticky");
includes(rostersCss, "tbody tr.zo-role-bg-v405-gk > td:first-child", "prima colonna colorata portieri");
includes(rostersCss, "tbody tr.zo-role-bg-v405-def > td:first-child", "prima colonna colorata difensori");
includes(rostersCss, "tbody tr.zo-role-bg-v405-mid > td:first-child", "prima colonna colorata centrocampisti");
includes(rostersCss, "tbody tr.zo-role-bg-v405-fwd > td:first-child", "prima colonna colorata attaccanti");
includes(rostersCss, "min-width: 620px", "larghezza mobile controllata stile Listone");
includes(rostersCss, "font-size: 0.62rem", "font compatto stile Listone");

// Preservazioni richieste dalle patch precedenti.
includes(mobileCss, "V414 - Area Squadra mobile compatta", "V414 preservata");
includes(mobileCss, "V413 - Filtri mobile compatti", "V413 preservata");
includes(styles, "V408 - Rosa squadra espansa con stile Listone", "V408 preservata");
includes(styles, "V406 - Evidenziazione ruolo giocatore", "colori ruolo consolidati preservati");

for (const forbidden of ["sezioni/", "role-backgrounds-v405r2", "audit-section-entrypoints"]) {
  if (index.includes(forbidden) || app.includes(forbidden)) {
    fail(`riferimento non desiderato trovato nel runtime: ${forbidden}`);
  }
}
ok("nessun ritorno a pagine standalone o asset sperimentali");

if (!quiet) console.log("Audit V415 home mobile e La mia squadra completato.");
