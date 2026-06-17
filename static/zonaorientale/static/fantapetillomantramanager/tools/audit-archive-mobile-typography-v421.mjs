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
  "tools/audit-mobile-typography-v420.mjs"
]) {
  assert(exists(file), `file richiesto presente: ${file}`);
}

const app = read("assets/app.js");
const css = read("assets/css/refactor/mobile-controls.css");
const htmlFiles = ["index.html", "competition.html", "player.html"].map((name) => [name, read(name)]);
const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = runtimeMatch ? runtimeMatch[1] : "";

assert(Number(runtimeVersion) >= 421, `runtime almeno V421: V${runtimeVersion || "non rilevata"}`);
assert(app.includes("getSeasonArchiveMergedNewsV421"), "merge comunicati archivio V421 presente");
assert(app.includes("snapshot+state.raw.news"), "marker sorgenti timeline archivio presente");
assert(app.includes("getSeasonArchiveNewsIdentityV421"), "deduplica comunicati archivio presente");
assert(app.includes("const news = getSeasonArchiveMergedNewsV421(snapshot, seasonId);"), "Archivio usa comunicati snapshot + state.raw.news");
assert(!app.includes("getSeasonArchiveSourceArrayV204(snapshot, \"news\""), "Archivio non ignora piu' i comunicati runtime quando lo snapshot ha news");
assert(app.includes("ZonaOrientaleMobileTypographyV420"), "scala V420 preservata");
assert(app.includes("ZonaOrientaleArchiveMobileTypographyV421"), "marker runtime V421 presente");

assert(css.includes("V421 - Archivio mobile"), "blocco CSS V421 presente");
assert(css.includes(".season-archive-honor-v196 article"), "sotto-card Albo compatte coperte");
assert(css.includes(".season-archive-match-list-v196 article"), "card partite recenti compatte coperte");
assert(css.includes(".season-archive-timeline-v196 article"), "timeline dati compatta coperta");
assert(css.includes(".season-archive-competition-card-v196"), "card competizioni compatta coperta");
assert(css.includes("var(--zo-mobile-name-font-v420)") && css.includes("var(--zo-mobile-value-font-v420)"), "V421 riusa scala V420 scelta dall'utente");

for (const [name, html] of htmlFiles) {
  assert(html.includes(`V${runtimeVersion}`), `${name} footer V${runtimeVersion} presente`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  assert(versions.length === 0 || versions.every((version) => version === runtimeVersion), `${name} cache-buster allineati a V${runtimeVersion}`);
  assert(!html.includes("sezioni/stats.html"), `${name} non reintroduce pagine standalone`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
assert(appVersions.length === 0 || appVersions.every((version) => version === runtimeVersion), `assets/app.js cache-buster allineati a V${runtimeVersion}`);

const failed = checks.filter((check) => !check.ok);
if (!quiet) console.log(`Audit V421 completato: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
