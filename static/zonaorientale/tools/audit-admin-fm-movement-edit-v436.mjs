#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const siteRoot = path.resolve(path.dirname(__filename), '..');
let ok = 0;
let total = 0;

function read(rel) {
  return fs.readFileSync(path.join(siteRoot, rel), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(siteRoot, rel));
}
function check(label, condition) {
  total += 1;
  if (!condition) {
    console.error(`x ${label}`);
    return;
  }
  ok += 1;
}

const app = read('assets/app.js');
const index = read('index.html');
const css = read('assets/css/refactor/admin-fm-movement-edit-v436.css');
const checkScript = read('tools/check-zonaorientale.sh');

check('runtime V436 in app.js', /DEPLOY_EXPECTED_VERSION_V181\s*=\s*"(436|437|438|439|440|441|442)"/.test(app));
check('marker runtime edit movimenti V436 presente', app.includes('ZonaOrientaleAdminFmMovementEditRuntimeV436'));
check('helper start edit presente', app.includes('function startEditFmMovementV436'));
check('helper cancel edit presente', app.includes('function cancelEditFmMovementV436'));
check('pulsante Modifica presente nella lista movimenti', app.includes('data-admin-edit-fm-movement'));
check('form contiene dataset movimento in modifica', app.includes('data-editing-fm-movement-id'));
check('submit usa updateDoc per modifica esistente', app.includes('updateDoc(doc(db, "fmMovements", editingMovementId)'));
check('creazione movimento mantiene addDoc e side effect rosa', app.includes('addDoc(collection(db, "fmMovements"), createPayload)') && app.includes('applyRosterSideEffectForMovement(createPayload)'));
check('cambio stagione annulla edit pendente', app.includes('state.editingAdminFmMovementIdV436 = "";') && app.includes('state.selectedAdminMovementSeasonTeamId = "";'));
check('cambio rosa sorgente in editing non forza re-render', app.includes('if (state.editingAdminFmMovementIdV436) return;'));
check('avviso operativo modifica rosa presente', app.includes('admin-editing-notice-v436') && app.includes('Verifica la rosa'));
check('CSS edit movimenti collegato in index', /assets\/css\/refactor\/admin-fm-movement-edit-v436\.css\?v=(436|437|438|439|440|441|442)/.test(index));
check('CSS edit movimenti esiste', exists('assets/css/refactor/admin-fm-movement-edit-v436.css'));
check('CSS mobile actions presente', css.includes('@media') && css.includes('admin-list-actions-v436'));
check('check principale integra audit V436', checkScript.includes('audit-admin-fm-movement-edit-v436.mjs'));
check('badge V434 resta collegato', /assets\/device-badge-v434\.css\?v=(436|437|438|439|440|441|442)/.test(index) && /assets\/device-badge-v434\.js\?v=(436|437|438|439|440|441|442)/.test(index));
check('bilanci da snapshot resta collegato', /assets\/js\/sections\/bilanci-snapshot-section-v435\.js\?v=(436|437|438|439|440|441|442)/.test(index));

if (ok !== total) {
  console.error(`Audit edit movimenti FM V436 completato: ${ok}/${total} controlli superati.`);
  process.exit(1);
}
console.log('Audit edit movimenti FM V436 superato.');
