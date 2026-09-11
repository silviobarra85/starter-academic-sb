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
const firebase = read("static/zonaorientale/assets/firebase.js");
const index = read("static/zonaorientale/index.html");
const release = json("static/zonaorientale/release.json");
const config = json("static/zonaorientale/assets/league-config.json");
const manifest = json("static/zonaorientale/assets/snapshots/seasons/manifest.json");
const snapshot = json("static/zonaorientale/assets/snapshots/seasons/2026-2027.json");
const purchases = snapshot.fmMovements.filter((item) => item.source === "static-auction-september-v810");
const announcement = snapshot.news.find((item) => item.id === "acquisti_ufficiali_asta_riparazione_settembre_2026_2026_09_10");

check(release.version === "813" && release.entrypoint === "assets/app.js?v=813", "release V813");
check(config.currentVersion === "813" && config.lastOverlay.startsWith("V813"), "config V813");
check(index.includes("assets/app.js?v=813") && index.includes("league-config-v443.js?v=813"), "entrypoint V813");
check(app.includes('import("./firebase.js?v=813")') && firebase.includes('firebase-adapter-v499.js?v=813'), "grafo Auth V813");
check(app.includes("function withAuthBootstrapTimeoutV813"), "timeout limitato al bootstrap");
check(app.includes("await signInWithEmailAndPassword(auth, email, password)"), "email/password senza timer artificiale");
check(app.includes("await signInWithPopup(auth, provider)"), "Google popup senza timer artificiale");
check(!app.includes("withAuthTimeoutV812") && !app.includes("auth/client-timeout-v812"), "timeout login V812 eliminato");
check(snapshot.snapshotVersion === 38 && manifest.snapshots[0]?.snapshotVersion === 38, "snapshot V38");
check(Boolean(announcement), "comunicato acquisti presente");
check(announcement?.body.includes("**49 calciatori**") && announcement?.body.includes("**436 FM**"), "totali comunicato corretti");
check(purchases.length === 49 && purchases.reduce((sum, item) => sum + Number(item.amount || 0), 0) === -436, "movimenti acquisti invariati");

console.log(`\nAudit V813: ${passed}/${passed + failed} controlli superati.`);
if (failed) process.exit(1);
