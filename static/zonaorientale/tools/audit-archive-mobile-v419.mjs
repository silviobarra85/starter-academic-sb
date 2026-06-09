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
  "tools/audit-mobile-accessibility-v418.mjs"
]) {
  assert(exists(file), `file richiesto presente: ${file}`);
}

const app = read("assets/app.js");
const htmlFiles = ["index.html", "competition.html", "player.html"].map((name) => [name, read(name)]);
const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = runtimeMatch ? runtimeMatch[1] : "";

assert(Number(runtimeVersion) >= 419, `runtime V419 o successivo: V${runtimeVersion || "non rilevata"}`);
assert(app.includes("ZonaOrientaleArchiveMobileV419"), "marker runtime V419 presente");
assert(app.includes("ZonaOrientaleMobileAccessibilityV418"), "marker V418 preservato");
assert(app.includes("sortSeasonArchiveNewsDescV419"), "ordinamento comunicati archivio V419 presente");
assert(app.includes("formatSeasonArchiveNewsDateV419"), "formatter data comunicati timeline presente");
assert(app.includes("season-archive-timeline-v419"), "classe timeline V419 presente");
assert(app.includes("hero-metrics-2x2-mobile"), "feature metriche mobile 2x2 dichiarata");
assert(app.includes("season-team-cards-compact-mobile"), "feature squadre mobile compatte dichiarata");
assert(app.includes("timeline-news-sorted-all"), "feature timeline comunicati completa dichiarata");

for (const [name, html] of htmlFiles) {
  assert(/V4\d{2}/.test(html), `${name} footer versione progressiva presente`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  assert(versions.length === 0 || versions.every((version) => Number(version) >= 419), `${name} cache-buster V419 o successivi`);
  assert(!html.includes("sezioni/stats.html"), `${name} non reintroduce pagine standalone`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
assert(appVersions.length === 0 || appVersions.every((version) => Number(version) >= 419), "assets/app.js cache-buster V419 o successivi");

assert(!app.includes("<h3>Albo della stagione</h3>"), "card Albo della stagione rimossa dal layout archivio");
assert(!app.includes("Vincitore/Classifica"), "label Vincitore/Classifica rimossa");
assert(app.includes("<strong>Vincitore:</strong>"), "label Vincitore presente");
assert(app.includes("renderArchiveSeasonTeamNameWithLogoV204(archive, String(winnerId), { strong: true })"), "vincitore competizione con logo in archivio snapshot");
assert(app.includes(".season-archive-metrics-v196 { grid-template-columns: repeat(2, minmax(0, 1fr));"), "metriche stagione mobile in griglia 2x2");
assert(app.includes(".season-archive-team-card-v196 { padding: .55rem;"), "card squadre archivio compatte mobile");
assert(app.includes(".season-archive-teams-v196 { grid-template-columns: repeat(2, minmax(0, 1fr));"), "griglia squadre stagione compatta mobile");
assert(!app.includes(".slice(0, 8);\n  const stadiums"), "comunicati archivio non limitati a 8 prima della timeline");
assert(!app.includes("archive.news.slice(0, 4).forEach"), "timeline non limita i comunicati a 4");

const failed = checks.filter((check) => !check.ok);
if (!quiet) console.log(`Audit V419 completato: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
