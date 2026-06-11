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

const index = read('index.html');
const bilanci = read('bilanci.html');
const app = read('assets/app.js');
const sectionJs = read('assets/js/sections/bilanci-snapshot-section-v435.js');
const sectionCss = read('assets/css/refactor/bilanci-snapshot-v435.css');
const checkScript = read('tools/check-zonaorientale.sh');

check('runtime deploy V440 in app.js', /DEPLOY_EXPECTED_VERSION_V181\s*=\s*"440"/.test(app));
check('index cache-buster V440 per Bilanci', index.includes('bilanci-snapshot-section-v435.js?v=440') && index.includes('bilanci-snapshot-v435.css?v=440'));
check('pulsante Copia link WhatsApp presente in Bilanci', index.includes('id="bilanciWhatsappCopyV440"') && index.includes('Copia link WhatsApp'));
check('stato copia accessibile presente', index.includes('id="bilanciWhatsappCopyStatusV440"') && index.includes('role="status"'));
check('JS copia link WhatsApp dedicato', sectionJs.includes('copyBilanciWhatsappLinkV440') && sectionJs.includes('https://silviobarra.com/zonaorientale/bilanci.html'));
check('CSS link WhatsApp Bilanci presente', sectionCss.includes('V440 - Bilanci: link WhatsApp') && sectionCss.includes('.bilanci-share-button-v440'));
check('landing bilanci.html presente', exists('bilanci.html'));
check('landing bilanci.html ha OG specifici', bilanci.includes('Bilanci FM · ZonaOrientale Salerno') && bilanci.includes('og:title') && bilanci.includes('og:url') && bilanci.includes('https://silviobarra.com/zonaorientale/bilanci.html'));
check('landing bilanci.html reindirizza a hash bilanci', bilanci.includes("window.location.replace('./#bilanci')") && bilanci.includes('url=./#bilanci'));
check('marker runtime V440 presente', app.includes('ZonaOrientaleBilanciWhatsappLinkV440'));
check('check principale integra audit V440', checkScript.includes('audit-bilanci-whatsapp-v440.mjs'));

if (ok !== total) {
  console.error(`Audit Bilanci WhatsApp V440 completato: ${ok}/${total} controlli superati.`);
  process.exit(1);
}
console.log('Audit Bilanci WhatsApp V440 superato.');
