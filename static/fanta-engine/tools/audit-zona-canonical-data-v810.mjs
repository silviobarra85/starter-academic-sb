import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const json = (path) => JSON.parse(read(path));
let passed = 0;
let failed = 0;
function check(condition, label) {
  if (condition) { passed += 1; console.log(`OK - ${label}`); }
  else { failed += 1; console.error(`FAIL - ${label}`); }
}

const app = read("static/zonaorientale/assets/app.js");
const index = read("static/zonaorientale/index.html");
const release = json("static/zonaorientale/release.json");
const config = json("static/zonaorientale/assets/league-config.json");
const manifest = json("static/zonaorientale/assets/snapshots/seasons/manifest.json");
const season = json("static/zonaorientale/assets/snapshots/seasons/2026-2027.json");
const purchases = season.fmMovements.filter((m) => m.date === "2026-09-10" && m.type === "ACQUISTO");
const legacyAggregates = purchases.filter((m) => !String(m.playerName || "").trim());
const ids = purchases.map((m) => m.id);

check(Number(release.version) >= 810 && release.entrypoint === `assets/app.js?v=${release.version}`, "release V810+");
check(index.includes(`assets/app.js?v=${release.version}`) && index.includes(`ZonaOrientale V${release.version}`), "entrypoint/cache V810+");
check(Number(config.currentVersion) >= 810, "league config V810+");
check(manifest.snapshots[0].snapshotVersion === 37, "manifest snapshot V37");
check(app.includes("const canonicalPublicNews = state.publicSeasonSnapshots?.[seasonId]?.news"), "news pubbliche indipendenti dal login");
check(app.includes("loadAdminFullDataForEditingV810") && app.includes("mergeByIdV810"), "Admin fonde statico e Firebase per ID");
check(app.includes("legacyAggregatePurchasesIgnored: true"), "aggregati legacy Firebase esclusi");
check(app.includes("signInWithPopup(auth, provider)") && !app.includes("signInWithRedirect(auth, provider)"), "Google Auth usa il popup compatibile V812");
check(!app.includes("isDesktopSafariV809"), "intercettore auth Safari duplicato rimosso");
check(purchases.length === 49, "49 acquisti analitici presenti");
check(new Set(ids).size === 49, "49 ID acquisto univoci");
check(legacyAggregates.length === 0, "nessun acquisto aggregato nello snapshot");
check(purchases.reduce((sum, m) => sum + Number(m.amount || 0), 0) === -436, "totale acquisti invariato: -436 FM");
check(purchases.every((m) => m.playerName && m.rosterRole && m.source === "static-auction-september-v810"), "acquisti completi e modificabili");

console.log(`\nAudit V810: ${passed}/${passed + failed} controlli superati.`);
if (failed) process.exit(1);
