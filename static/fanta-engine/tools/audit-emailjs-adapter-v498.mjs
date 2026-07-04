#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd(); let ok = 0, fail = 0; const failures = [];
function abs(p){ return path.join(root,p); }
function exists(p){ return fs.existsSync(abs(p)); }
function read(p){ return fs.readFileSync(abs(p),'utf8'); }
function readJson(p){ return JSON.parse(read(p)); }
function check(c,l){ if(c){ ok++; console.log(`OK  - ${l}`); } else { fail++; failures.push(l); console.error(`FAIL - ${l}`); } }
const adapterPath = 'fanta-engine/js/email/emailjs-adapter-v498.js';
check(exists(adapterPath), 'adapter EmailJS V498 presente');
const adapter = read(adapterPath);
for (const token of ['EMAILJS_ADAPTER_VERSION_V498','buildEmailJsConfigV498','isEmailJsConfiguredV498','normalizeEmailJsPayloadV498','buildEmailJsRequestBodyV498','sendEmailJsTemplateV498','buildEmailJsMailtoFallbackV498','createEmailJsSenderV498','FantaEngineEmailJsAdapterV498']) check(adapter.includes(token), `adapter token ${token}`);
check(adapter.includes('https://api.emailjs.com/api/v1.0/email/send'), 'endpoint EmailJS centralizzato');
check(!adapter.includes('service_ttjf7js') && !adapter.includes('service_trz4dxe'), 'adapter senza service ID hardcoded');
check(!adapter.includes('barra.silvio@gmail.com'), 'adapter senza destinatari hardcoded');
for (const [league, service, name] of [['zonaorientale','service_trz4dxe','ZonaOrientale'], ['fantapetillomantramanager','service_ttjf7js','FantaMantraManager']]) {
  const cfg = readJson(`${league}/assets/league-config.json`);
  check(cfg.currentVersion === 498, `${league} currentVersion V498`);
  check(cfg.features?.emailJsAdapter === true, `${league} feature emailJsAdapter attiva`);
  check(cfg.features?.emailJsAdapterVersion === 'V498', `${league} feature emailJsAdapterVersion V498`);
  check(cfg.emailJsAdapter?.version === 'V498', `${league} blocco emailJsAdapter V498`);
  const file = `${league}/assets/emailjs.js`;
  check(exists(file), `${league} emailjs.js presente`);
  const email = read(file);
  check(email.includes("emailjs-adapter-v498.js"), `${league} importa adapter comune`);
  check(email.includes('createEmailJsSenderV498'), `${league} usa sender comune`);
  check(email.includes(service), `${league} conserva service ID specifico`);
  check(email.includes('export async function sendTransferEmail'), `${league} conserva API sendTransferEmail`);
  check(email.includes('export function isEmailJsConfigured'), `${league} conserva API isEmailJsConfigured`);
  check(email.includes('buildEmailJsMailtoFallback'), `${league} espone fallback mailto`);
}
const zonaEmail = read('zonaorientale/assets/emailjs.js');
const fmmEmail = read('fantapetillomantramanager/assets/emailjs.js');
check(!zonaEmail.includes('service_ttjf7js'), 'Zona non usa service FMM');
check(fmmEmail.includes('template_svkkhlr'), 'FMM conserva template comunicato scambio');
check(fmmEmail.includes('template_e1o7z5e'), 'FMM conserva template svincolo generico');
check(fmmEmail.includes('barra.silvio@gmail.com'), 'FMM conserva destinatario presidente');
check(read('fantapetillomantramanager/assets/app.js').includes('template_svkkhlr'), 'FMM app conserva flusso comunicato scambio');
check(read('fantapetillomantramanager/assets/app.js').includes('Svincola'), 'FMM app conserva flusso svincolo');
if(fail>0){ console.error(`\nAudit EmailJS adapter V498 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f=>console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit EmailJS adapter V498 completato: ${ok} OK, ${fail} FAIL`);
