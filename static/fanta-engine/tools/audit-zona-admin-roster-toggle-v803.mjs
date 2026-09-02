import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || process.cwd());
const at = (...parts) => path.join(root, fs.existsSync(path.join(root,'static','zonaorientale')) ? 'static' : '', ...parts);
const app = fs.readFileSync(at('zonaorientale','assets','app.js'),'utf8');
const release = JSON.parse(fs.readFileSync(at('zonaorientale','release.json'),'utf8'));
const config = JSON.parse(fs.readFileSync(at('zonaorientale','assets','league-config.json'),'utf8'));
const checks = [];
const check = (ok, label) => { checks.push([Boolean(ok), label]); console.log(`${ok ? 'OK' : 'FAIL'} - ${label}`); };

check(release.version === '803', 'release shell V803');
check(config.currentVersion === '803', 'league-config V803');
check(app.includes('adminManualRosterPanelV802'), 'pannello gestione manuale rose preservato');
check(app.includes('state.collapsedAdminPanels.add("adminManualRosterPanelV802")'), 'pannello parte ridotto');
check(app.includes('anchor.insertAdjacentElement("afterend", panel)'), 'pannello dinamico inserito dopo i pannelli Admin base');
check(app.includes('manualRosterToggleBoundV803'), 'guard binding toggle V803 presente');
check(app.includes("panel.querySelector('[data-admin-toggle-panel=\"adminManualRosterPanelV802\"]')"), 'toggle dinamico individuato nel pannello appena creato');
check(app.includes('toggleButton.addEventListener("click"'), 'listener click collegato dopo inserimento dinamico');
check(app.includes('toggleAdminPanel("adminManualRosterPanelV802")'), 'click richiama il toggle Admin canonico');
check(app.includes('event.preventDefault()') && app.includes('event.stopPropagation()'), 'click del toggle isolato da handler concorrenti');
check(app.includes('data-admin-manual-roster-load-history-v802'), 'ricerca/caricamento storico preservati');
check(app.includes('data-admin-manual-roster-edit-v802'), 'modifica giocatore preservata');
check(app.includes('data-admin-manual-roster-delete-v802'), 'eliminazione giocatore preservata');
check(app.includes('adminManualRosterFormV802'), 'form salvataggio preservato');
check(app.includes('snapshotOverlayIncludesPrimaryRosters: true'), 'persistenza snapshot rose preservata');
check(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "803"'), 'diagnostica deploy V803 allineata');
check(app.includes('ZonaOrientaleManualRosterToggleFixV803'), 'marker runtime fix V803 presente');

const failures = checks.filter(([ok]) => !ok);
if (failures.length) {
  console.error(`Audit V803 Admin rose toggle fallito: ${failures.length} problema/i.`);
  process.exit(1);
}
console.log(`Audit V803 Admin rose toggle: ${checks.length}/${checks.length} controlli superati.`);
