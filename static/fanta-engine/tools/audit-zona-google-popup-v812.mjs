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

check(Number(release.version) >= 812 && release.entrypoint === `assets/app.js?v=${release.version}`, "release V812+");
check(Number(config.currentVersion) >= 812, "config V812+");
check(index.includes(`assets/app.js?v=${release.version}`), "entrypoint V812+");
check(app.includes(`import("./firebase.js?v=${release.version}")`), "wrapper Firebase corrente");
check(firebase.includes(`firebase-adapter-v499.js?v=${release.version}`), "adapter Firebase corrente");
check(app.includes("await signInWithPopup(auth, provider)"), "Google usa popup");
check(app.includes('error?.code === "auth/popup-blocked"'), "messaggio popup bloccato");
check(app.includes('error?.code === "auth/popup-closed-by-user"'), "messaggio popup chiuso");
check(!app.includes("signInWithRedirect") && !firebase.includes("signInWithRedirect") && !adapter.includes("signInWithRedirect"), "redirect Google eliminato dal grafo Auth");
check(!app.includes("desktopBrowser"), "nessuna biforcazione desktop/mobile");
check(app.includes("await signInWithEmailAndPassword(auth, email, password)"), "email/password usa Firebase nativo");

console.log(`\nAudit V812: ${passed}/${passed + failed} controlli superati.`);
if (failed) process.exit(1);
