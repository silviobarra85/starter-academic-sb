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
const adapter = read("static/fanta-engine/js/firebase/firebase-adapter-v499.js");
const index = read("static/zonaorientale/index.html");
const release = json("static/zonaorientale/release.json");
const config = json("static/zonaorientale/assets/league-config.json");
const manifest = json("static/zonaorientale/assets/snapshots/seasons/manifest.json");
const snapshot = json("static/zonaorientale/assets/snapshots/seasons/2026-2027.json");

const septemberReleases = snapshot.fmMovements.filter((item) =>
  item.type === "SVINCOLO" && String(item.description || "").startsWith("SVINCOLI SETTEMBRE 2026:")
);
const septemberPurchases = snapshot.fmMovements.filter((item) => item.source === "static-auction-september-v810");
const baronissiAugustBuy = snapshot.fmMovements.find((item) => item.id === "syQ6oloV2U2BFHGtzuUO");
const currentManifest = manifest.snapshots.find((item) => item.seasonId === "2026-2027");

check(release.version === "814" && release.entrypoint === "assets/app.js?v=814", "release V814");
check(config.currentVersion === "814" && String(config.lastOverlay || "").startsWith("V814"), "config V814");
check(index.includes("assets/app.js?v=814") && index.includes("league-config-v443.js?v=814"), "entrypoint/cache-buster V814");
check(app.includes('import("./firebase.js?v=814")') && firebase.includes('firebase-adapter-v499.js?v=814'), "grafo Firebase V814 coerente");
check(firebase.includes("authPersistenceMode: 'mac-safari-web-storage'"), "ZonaOrientale abilita persistence Safari dedicata");
check(adapter.includes("initializeAuth") && adapter.includes("browserLocalPersistence") && adapter.includes("browserSessionPersistence") && adapter.includes("inMemoryPersistence"), "adapter supporta Auth senza IndexedDB su Safari Mac");
check(adapter.includes("mode === 'mac-safari-web-storage' && isMacSafariV814()"), "strategia limitata a Safari Mac");
check(app.includes("V814: su Safari il popup deve partire nello stesso gesto utente"), "popup Google preserva user activation");
check(!app.includes('scheduleAuthDashboardLandingV182("login-google");') && !app.includes('scheduleAuthDashboardLandingV182("login-email");'), "nessuna navigazione Dashboard prima dell'esito login");
check(app.includes('scheduleAuthDashboardLandingV182("login-google-success")') && app.includes('scheduleAuthDashboardLandingV182("login-email-success")'), "navigazione Dashboard solo dopo login riuscito");

check(septemberReleases.length === 10, "10 svincoli settembre presenti");
check(septemberReleases.every((item) => item.date === "2026-09-09"), "tutti gli svincoli settembre spostati al 09/09");
check(septemberReleases.reduce((sum, item) => sum + Number(item.amount || 0), 0) === 223, "totale svincoli invariato a +223 FM");
check(baronissiAugustBuy?.seasonTeamId === "2026_2027_h6saek7urqiqnmiztrt7" && baronissiAugustBuy?.date === "2026-08-20", "acquisto agosto Afc Severgas Baronissi corretto al 20/08");
check(septemberPurchases.length === 49 && septemberPurchases.every((item) => item.date === "2026-09-10"), "49 acquisti asta settembre restano datati 10/09");
check(septemberPurchases.reduce((sum, item) => sum + Number(item.amount || 0), 0) === -436, "totale acquisti settembre invariato a -436 FM");
check(snapshot.snapshotVersion === 39 && currentManifest?.snapshotVersion === 39, "snapshot/manifest V39");
check(app.includes("normalizeHistoricalMovementDateV814") && app.includes("syQ6oloV2U2BFHGtzuUO"), "runtime neutralizza eventuali override Firebase con le vecchie date");

console.log(`\nAudit V814: ${passed}/${passed + failed} controlli superati.`);
if (failed) process.exit(1);
