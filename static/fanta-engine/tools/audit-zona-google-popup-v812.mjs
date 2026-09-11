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

check(release.version === "812" && release.entrypoint === "assets/app.js?v=812", "release V812");
check(config.currentVersion === "812" && config.lastOverlay.startsWith("V812"), "config V812");
check(index.includes("assets/app.js?v=812") && index.includes("league-config-v443.js?v=812"), "entrypoint V812");
check(app.includes('import("./firebase.js?v=812")'), "wrapper Firebase V812");
check(firebase.includes('firebase-adapter-v499.js?v=812'), "adapter Firebase V812");
check(app.includes("function withAuthTimeoutV812"), "timeout Auth V812");
check(app.includes('withAuthTimeoutV812(signInWithPopup(auth, provider), "il popup Google")'), "Google usa popup");
check(app.includes('error?.code === "auth/popup-blocked"'), "messaggio popup bloccato");
check(app.includes('error?.code === "auth/popup-closed-by-user"'), "messaggio popup chiuso");
check(!app.includes("signInWithRedirect") && !firebase.includes("signInWithRedirect") && !adapter.includes("signInWithRedirect"), "redirect Google eliminato dal grafo Auth");
check(!app.includes("desktopBrowser"), "nessuna biforcazione desktop/mobile");
check(app.includes('withAuthTimeoutV812(signInWithEmailAndPassword(auth, email, password)'), "email/password conserva timeout");

console.log(`\nAudit V812: ${passed}/${passed + failed} controlli superati.`);
if (failed) process.exit(1);
