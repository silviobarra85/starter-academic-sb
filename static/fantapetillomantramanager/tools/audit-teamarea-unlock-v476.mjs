import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
let ok = 0;
let fail = 0;
function check(condition, label) {
  if (condition) {
    ok += 1;
    console.log(`OK  - ${label}`);
  } else {
    fail += 1;
    console.error(`FAIL - ${label}`);
  }
}

const bootstrap = read('assets/js/core/fanta-petillo-admin-bootstrap-v450.js');
const app = read('assets/app.js');
const config = JSON.parse(read('assets/league-config.json'));
const registry = read('assets/js/core/section-registry-v405.js');
const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');

check(config.name === 'FantaMantraManager', 'nome pubblico FantaMantraManager invariato');
check(config.currentVersion === '476', 'currentVersion V476');
check(config.features?.teamArea === true, 'feature teamArea attiva in config');
check(config.guardrails?.teamAreaEntrypointsGuardedUntilTeamUsersSeed === false, 'entrypoint Area Squadra non piu guardato da bootstrap in config');
check(config.guardrails?.cloneTeamAreaStillGuarded === false, 'cloneTeamAreaStillGuarded disattivato');
check(!bootstrap.includes('Admin bootstrap attivo. Area Squadra resta protetta'), 'banner testuale tecnico rimosso dal bootstrap');
check(!bootstrap.includes('injectFantaPetilloAdminBootstrapBannerV450'), 'funzione di injection banner rimossa');
check(bootstrap.includes('removeFantaMantraManagerAdminBootstrapBannerV476'), 'bootstrap rimuove eventuale banner legacy');
check(bootstrap.includes('hidesTeamAreaEntrypoints: false'), 'bootstrap dichiara entrypoint Area Squadra non nascosti');
check(bootstrap.includes('unlocksTeamAreaEntrypoints: true'), 'marker V476 sblocco entrypoint presente');
check(app.includes('unlockFantaMantraManagerTeamAreaEntrypointsV476'), 'app include fallback di sblocco entrypoint');
check(app.includes('FantaMantraManagerTeamAreaUnlockAppV476'), 'marker app V476 presente');
check(registry.includes("entrypointUnlockedIn: 'V476'"), 'registry marca Area Squadra sbloccata in V476');
check(index.includes('assets/app.js?v=476'), 'index cache-buster app V476');
check(index.includes('fanta-petillo-admin-bootstrap-v450.js?v=476'), 'index cache-buster bootstrap V476');
check(index.includes('FantaMantraManager · V476'), 'footer index V476');
check(competition.includes('fanta-petillo-admin-bootstrap-v450.js?v=476'), 'competition cache-buster bootstrap V476');
check(competition.includes('FantaMantraManager · V476'), 'footer competition V476');
check(player.includes('fanta-petillo-admin-bootstrap-v450.js?v=476'), 'player cache-buster bootstrap V476');
check(player.includes('FantaMantraManager · V476'), 'footer player V476');
check(config.slug === 'fantapetillomantramanager', 'slug/cartella FantaMantraManager preservati');
check(!bootstrap.includes('static/zonaorientale') && !index.includes('static/zonaorientale'), 'nessun path ZonaOrientale nei file bootstrap/index toccati');

console.log(`\nAudit V476 completato: ${ok} OK, ${fail} FAIL`);
if (fail) process.exit(1);
