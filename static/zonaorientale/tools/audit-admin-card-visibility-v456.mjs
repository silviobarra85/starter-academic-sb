import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const root = path.resolve(process.cwd());
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
const checks = [];
function check(label, ok) { checks.push({ label, ok: Boolean(ok) }); }

const index = read('index.html');
const js = read('assets/js/core/admin-card-visibility-v456.js');
const css = read('assets/css/refactor/admin-card-visibility-v456.css');
const app = read('assets/app.js');

check('CSS V456 collegato in index', index.includes('admin-card-visibility-v456.css?v=456'));
check('JS V456 collegato in index', index.includes('admin-card-visibility-v456.js?v=456'));
check('script V455 non piu collegato in index', !index.includes('admin-card-visibility-v455.js?v=456') && !index.includes('admin-card-visibility-v455.js?v=455'));
check('storage nuovo V456 con default vuoto', js.includes('.adminCardVisibility.v456.selectedCards') && /readJson\(STORAGE_SELECTED, \[\]\)/.test(js));
check('azioni click in capture phase', js.includes('data-admin-card-action-v456') && js.includes('event.stopImmediatePropagation'));
check('include card dashboard pubblicazione', js.includes('admin-publication-dashboard-card-v368'));
check('include dettagli admin-edit-section', js.includes('details.admin-edit-section'));
check('include pannelli top pubblicazione', js.includes('adminPublicationReminderMountV189') && js.includes('publicationStatusMountV190') && js.includes('publishWizardMountV191'));
check('include generatore comunicati automatici', js.includes('communication-generator-v197') && js.includes('Generatore comunicati automatici') === false);
check('nasconde QA con toggle V456', js.includes('manualQaPanelV358') && js.includes('data-admin-qa-toggle-v456'));
check('CSS pointer events e hide V456', css.includes('pointer-events: auto') && css.includes('.admin-card-hidden-v456') && css.includes('.manual-qa-panel-v358.admin-qa-hidden-v456'));
check('runtime V456', /DEPLOY_EXPECTED_VERSION_V181\s*=\s*"456"/.test(app));
check('footer V456', /V456 fix click selettore Admin/.test(index));

const failed = checks.filter((item) => !item.ok);
if (!quiet) checks.forEach((item) => console.log(`${item.ok ? 'OK' : 'FAIL'} ${item.label}`));
if (failed.length) {
  console.error(`Audit Admin card visibility V456 fallito: ${failed.map((item) => item.label).join('; ')}`);
  process.exit(1);
}
