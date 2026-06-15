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
  "assets/js/refactor/live-data-archive-v209.js",
  "assets/css/refactor/mobile-controls.css",
  "tools/audit-archive-mobile-typography-v421.mjs"
]) {
  assert(exists(file), `file richiesto presente: ${file}`);
}

const app = read("assets/app.js");
const liveArchive = read("assets/js/refactor/live-data-archive-v209.js");
const css = read("assets/css/refactor/mobile-controls.css");
const htmlFiles = ["index.html", "competition.html", "player.html"].map((name) => [name, read(name)]);
const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = runtimeMatch ? runtimeMatch[1] : "";

assert(Number(runtimeVersion) >= 422, `runtime compatibile con V422: V${runtimeVersion || "non rilevata"}`);
assert(app.includes("ZonaOrientaleArchiveMobileTypographyV422"), "marker runtime V422 presente");
assert(app.includes("getSeasonArchiveTimelineNewsV422"), "helper timeline V422 presente");
assert(app.includes("getVisibleNewsForSeasonV79(4)"), "timeline usa gli stessi 4 comunicati visibili della dashboard");
assert(app.includes("timelineNewsLimit: 4"), "marker limite timeline a 4 comunicati presente");
assert(app.includes("season-archive-timeline-v422"), "classe timeline V422 presente");
assert(app.includes("data-news-count-v422"), "diagnostica conteggio news timeline presente");

assert(liveArchive.includes("getHashPageSafe() === \"archive\""), "Archivio si aggiorna dopo refresh live news");
assert(liveArchive.includes("renderSeasonArchive()"), "render Archivio richiamabile dopo live news");
assert(!liveArchive.includes("<h3>Albo della stagione</h3>"), "card Albo duplicata non presente nel renderer live");
assert(liveArchive.includes("Stato, partite e vincitori delle competizioni."), "copy Competizioni non cita piu' classifiche duplicate");

assert(css.includes("V422 - Scala mobile estesa"), "blocco CSS V422 presente");
assert(css.includes(".season-archive-teams-v196") && css.includes("repeat(2, minmax(0, 1fr)) !important"), "Squadre Archivio in due card per riga mobile");
assert(css.includes(".season-archive-honor-v196 article"), "contenuti Albo legacy coperti dalla scala mobile");
assert(css.includes(".season-archive-competition-card-v196") && css.includes(".season-archive-timeline-v196 article"), "sotto-card Archivio coperte dalla scala V422");
assert(css.includes("--zo-mobile-name-font-v420: 0.78rem"), "scala nome 0.78rem preservata");
assert(css.includes("--zo-mobile-subtext-font-v420: 0.66rem"), "scala sottotesto 0.66rem preservata");
assert(css.includes("--zo-mobile-label-font-v420: 0.62rem"), "scala label 0.62rem preservata");
assert(css.includes("--zo-mobile-value-font-v420: 0.73rem"), "scala valore 0.73rem preservata");

for (const [name, html] of htmlFiles) {
  assert(new RegExp("V" + runtimeVersion + "\\b").test(html), `${name} footer allineato a V${runtimeVersion}`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  assert(versions.length === 0 || versions.every((version) => version === runtimeVersion), `${name} cache-buster allineati a V${runtimeVersion}`);
  assert(!html.includes("sezioni/stats.html"), `${name} non reintroduce pagine standalone`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
assert(appVersions.length === 0 || appVersions.every((version) => version === runtimeVersion), `assets/app.js cache-buster allineati a V${runtimeVersion}`);

const failed = checks.filter((check) => !check.ok);
if (!quiet) console.log(`Audit V422 completato: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
