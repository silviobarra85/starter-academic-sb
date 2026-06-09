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
    console.error(`✗ ${label}`);
    return;
  }
  ok += 1;
}

const htmlPages = ['index.html', 'competition.html', 'player.html'];
const app = read('assets/app.js');
const css = read('assets/device-badge-v434.css');
const js = read('assets/device-badge-v434.js');
const checkScript = read('tools/check-zonaorientale.sh');

check('runtime V434 in app.js', /DEPLOY_EXPECTED_VERSION_V181\s*=\s*"434"/.test(app));
check('marker runtime V434 presente', app.includes('ZonaOrientaleDeviceBadgeRuntimeV434'));
check('CSS badge dispositivo presente', exists('assets/device-badge-v434.css'));
check('JS badge dispositivo presente', exists('assets/device-badge-v434.js'));
check('badge fisso in alto a destra', /position:\s*fixed/.test(css) && /right:\s*calc\(env\(safe-area-inset-right/.test(css));
check('badge non intercetta tap/click', /pointer-events:\s*none/.test(css));
check('badge usa safe area top', /safe-area-inset-top/.test(css));
check('API globale V434 esposta', js.includes('ZonaOrientaleDeviceBadgeV434'));
check('rilevazione User-Agent Client Hints best-effort', js.includes('getHighEntropyValues') && js.includes('model'));
check('fallback iPhone/iPad presente', js.includes('iPhone') && js.includes('iPad'));
check('fallback Android presente', js.includes('extractAndroidModel'));
check('privacy locale dichiarata', js.includes('local-only'));
for (const page of htmlPages) {
  const html = read(page);
  check(`${page} carica CSS badge V434`, html.includes('assets/device-badge-v434.css?v=434'));
  check(`${page} carica JS badge V434`, html.includes('assets/device-badge-v434.js?v=434'));
  check(`${page} footer V434`, html.includes('V434 badge dispositivo'));
  check(`${page} cache-buster V434`, !html.includes('?v=433'));
}
check('check principale integra audit V434', checkScript.includes('audit-device-badge-v434.mjs'));

if (ok !== total) {
  console.error(`Audit V434 completato: ${ok}/${total} controlli superati.`);
  process.exit(1);
}
console.log('Audit device badge V434 superato.');
