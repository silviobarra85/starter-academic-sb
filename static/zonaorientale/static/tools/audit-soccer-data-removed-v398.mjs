import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  }
}

assert(!index.includes('data-page-link="soccerdata"'), 'index.html non deve contenere link navigazione Soccer Data');
assert(!index.includes('data-page="soccerdata"'), 'index.html non deve contenere la sezione Soccer Data');
assert(!index.includes('Soccer Data</a>'), 'index.html non deve mostrare il link Soccer Data');
assert(index.includes('data-page="competitions"'), 'la sezione Competizioni deve restare presente');
assert(index.includes('data-page="admin"'), 'la sezione Admin deve restare presente');
assert(index.includes('id="mobileMoreSheet"'), 'menu mobile Altro deve restare presente');
assert(index.includes('V398 rimuove sezione Soccer Data'), 'footer V398 assente');
assert(index.includes('./assets/app.js?v=398'), 'cache-buster app.js V398 assente');
assert(app.includes('disableSoccerDataSectionV398'), 'guard V398 assente in app.js');
assert(app.includes("FALLBACK_PAGE_V398 = 'listone'"), 'fallback Listone assente');
assert(app.includes('hashValue === SOCCER_DATA_PAGE_V398 ? false'), 'hash Soccer Data non disabilitato');

if (!process.exitCode) {
  console.log('OK audit-soccer-data-removed-v398');
}
