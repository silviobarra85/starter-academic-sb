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
  "tools/audit-css-asset-cleanup-v417.mjs"
]) {
  assert(exists(file), `file richiesto presente: ${file}`);
}

const app = read("assets/app.js");
const mobileCss = read("assets/css/refactor/mobile-controls.css");
const htmlFiles = ["index.html", "competition.html", "player.html"].map((name) => [name, read(name)]);

const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = runtimeMatch ? runtimeMatch[1] : "";
assert(Number(runtimeVersion) >= 418, `runtime almeno V418: V${runtimeVersion || "non rilevata"}`);
assert(app.includes("ZonaOrientaleMobileAccessibilityV418"), "marker runtime V418 presente");
assert(app.includes("ZonaOrientaleCssAssetCleanupV417"), "marker V417 preservato");
assert(app.includes("ZonaOrientaleMobileHomeTeamProfileV415"), "marker V415 preservato");

for (const [name, html] of htmlFiles) {
  assert(html.includes(`V${runtimeVersion}`), `${name} footer V${runtimeVersion} presente`);
  const versions = [...html.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
  assert(versions.length === 0 || versions.every((version) => version === runtimeVersion), `${name} cache-buster allineati a V${runtimeVersion}`);
  assert(!html.includes("sezioni/stats.html"), `${name} non reintroduce pagine standalone`);
}

const appVersions = [...app.matchAll(/\?v=(\d+)/g)].map((match) => match[1]);
assert(appVersions.length === 0 || appVersions.every((version) => version === runtimeVersion), `assets/app.js cache-buster allineati a V${runtimeVersion}`);

assert(mobileCss.includes("V418 - Accessibilita mobile"), "blocco CSS V418 presente");
assert(mobileCss.includes(":focus-visible"), "focus visible mobile definito");
assert(mobileCss.includes("-webkit-tap-highlight-color"), "tap highlight mobile definito");
assert(mobileCss.includes("touch-action: manipulation"), "tap target/touch-action mobile definito");
assert(mobileCss.includes("overscroll-behavior-x: contain"), "overflow orizzontale controllato");
assert(mobileCss.includes("scrollbar-gutter: stable both-edges"), "gutter scrollbar stabile per wrapper scrollabili");
assert(mobileCss.includes("prefers-reduced-motion: reduce"), "reduced motion rispettato");
assert(mobileCss.includes(".mobile-bottom-link:focus-visible"), "focus specifico bottom nav preservato");
assert(mobileCss.includes(":not(.player-table *):not(.team-profile-roster-table-v415 *)"), "tabelle dense escluse dal tap target globale");
assert(mobileCss.includes("V416 - Admin mobile compatto"), "V416 admin mobile preservata");

const failed = checks.filter((check) => !check.ok);
if (!quiet) console.log(`Audit V418 completato: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
