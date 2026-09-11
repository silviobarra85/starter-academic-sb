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

check(release.version === "811" && release.entrypoint === "assets/app.js?v=811", "release V811");
check(config.currentVersion === "811" && config.lastOverlay.startsWith("V811"), "config V811");
check(index.includes("assets/app.js?v=811") && index.includes("league-config-v443.js?v=811"), "entrypoint V811");
check(app.includes('import("./firebase.js?v=811")'), "firebase wrapper cache-busted");
check(firebase.includes('firebase-adapter-v499.js?v=811'), "firebase adapter cache-busted");
check(app.includes("function withAuthTimeoutV811"), "timeout Auth installato");
check(app.includes('withAuthTimeoutV811(signInWithEmailAndPassword(auth, email, password)'), "email login protetto da timeout");
check(app.includes('withAuthTimeoutV811(signInWithRedirect(auth, provider)'), "Google redirect protetto da timeout");
check(app.includes('withAuthTimeoutV811(signInWithPopup(auth, provider)'), "Google popup protetto da timeout");
check(app.includes('auth/client-timeout-v811'), "errore diagnostico esplicito");

console.log(`\nAudit V811: ${passed}/${passed + failed} controlli superati.`);
if (failed) process.exit(1);
