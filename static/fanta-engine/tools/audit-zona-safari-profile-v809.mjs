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
const wrapper = read("static/zonaorientale/assets/firebase.js");
const adapter = read("static/fanta-engine/js/firebase/firebase-adapter-v499.js");
const release = json("static/zonaorientale/release.json");
const config = json("static/zonaorientale/assets/league-config.json");
const season = json("static/zonaorientale/assets/snapshots/seasons/2026-2027.json");
const septemberBuys = season.fmMovements.filter((m) => m.date === "2026-09-10" && m.type === "ACQUISTO");

check(release.version === "809" && release.entrypoint.endsWith("?v=809"), "release V809");
check(index.includes("assets/app.js?v=809") && index.includes("ZonaOrientale V809"), "entrypoint/cache V809");
check(config.lastOverlay.includes("V809"), "league config V809");
check(adapter.includes("signInWithRedirect") && wrapper.includes("signInWithRedirect"), "redirect Firebase esportato");
check(app.includes("isDesktopSafariV809") && app.includes("await signInWithRedirect(auth, provider)"), "Safari desktop usa redirect");
check(app.includes('event.target?.closest?.("#loginGoogleBtn")') && app.includes("event.stopImmediatePropagation()"), "handler popup legacy neutralizzato su Safari");
check(app.includes("loadTeamSnapshotV809") && app.includes('profileSourceV809 = "static-season-snapshot"'), "profilo squadra static-first");
check(app.includes("return loadTeamSnapshotBeforeV809(seasonTeamId)"), "Firebase preservato come fallback profilo");
check(septemberBuys.length === 10, "10 movimenti acquisto aggregati presenti");
check(septemberBuys.reduce((sum, m) => sum + Number(m.amount || 0), 0) === -436, "totale acquisti invariato: -436 FM");
check(septemberBuys.every((m) => /ACQUISTI ASTA DI RIPARAZIONE SETTEMBRE 2026:/.test(m.description || "")), "descrizioni acquisti con dettaglio giocatori");
check(app.includes("balancesChanged: false") && app.includes("fmMovementsChanged: false"), "nessuna mutazione contabile V809");

console.log(`\nAudit V809: ${passed}/${passed + failed} controlli superati.`);
if (failed) process.exit(1);
