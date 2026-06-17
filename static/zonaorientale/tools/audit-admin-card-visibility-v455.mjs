import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const root = path.resolve(process.cwd());
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
const checks = [];
function check(label, ok) { checks.push({ label, ok: Boolean(ok) }); }

const index = read('index.html');
const js = read('assets/js/core/admin-card-visibility-v455.js');
const css = read('assets/css/refactor/admin-card-visibility-v455.css');
const app = read('assets/app.js');

check('CSS V455 collegato in index', index.includes('admin-card-visibility-v455.css?v=466'));
check('JS V455 collegato in index', index.includes('admin-card-visibility-v455.js?v=466'));
check('script V454 non piu collegato in index', !index.includes('admin-card-visibility-v454.js'));
check('storage nuovo V455 con default vuoto', js.includes('.adminCardVisibility.v455.selectedCards') && /readJson\(STORAGE_SELECTED, \[\]\)/.test(js));
check('include card dashboard pubblicazione', js.includes('admin-publication-dashboard-card-v368'));
check('include dettagli admin-edit-section', js.includes('details.admin-edit-section'));
check('include pannelli top pubblicazione', js.includes('adminPublicationReminderMountV189') && js.includes('publicationStatusMountV190') && js.includes('publishWizardMountV191'));
check('nasconde QA con toggle V455', js.includes('manualQaPanelV358') && js.includes('data-admin-qa-toggle-v455'));
check('CSS hide card e QA V455', css.includes('.admin-card-hidden-v455') && css.includes('.manual-qa-panel-v358.admin-qa-hidden-v455'));
check('runtime V455', /DEPLOY_EXPECTED_VERSION_V181\s*=\s*"455"/.test(app));
check('footer V455', /V455 fix selettore Admin/.test(index));

const failed = checks.filter((item) => !item.ok);
if (!quiet) checks.forEach((item) => console.log(`${item.ok ? 'OK' : 'FAIL'} ${item.label}`));
if (failed.length) {
  console.error(`Audit Admin card visibility V455 fallito: ${failed.map((item) => item.label).join('; ')}`);
  process.exit(1);
}
