#!/usr/bin/env node
import process from 'node:process';

const base = new URL(process.argv[2] || 'https://silviobarra.com');
const probe = Date.now();
let failures = 0;

async function fetchText(label, pathname, assertions = []) {
  const url = new URL(pathname, base);
  url.searchParams.set('__v763_probe', String(probe));
  try {
    const response = await fetch(url, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
    const text = await response.text();
    if (!response.ok) {
      failures += 1;
      console.error(`FAIL ${response.status} - ${label} - ${url.href}`);
      return '';
    }
    let ok = true;
    for (const assertion of assertions) {
      if (!assertion.test(text, response)) {
        ok = false;
        failures += 1;
        console.error(`FAIL content - ${label}: ${assertion.description} - ${url.href}`);
      }
    }
    if (ok) console.log(`OK ${response.status} - ${label} - ${url.href}`);
    return text;
  } catch (error) {
    failures += 1;
    console.error(`FAIL fetch - ${label} - ${url.href} - ${error.message}`);
    return '';
  }
}

const contains = (needle, description = `contiene ${needle}`) => ({ description, test: (text) => text.includes(needle) });
const excludes = (needle, description = `non contiene ${needle}`) => ({ description, test: (text) => !text.includes(needle) });

await fetchText('release manifest V763', '/zonaorientale/release.json', [
  { description: 'JSON valido con version 763', test: (text) => {
    try { return String(JSON.parse(text).version) === '763'; } catch { return false; }
  }}
]);
await fetchText('home V763', '/zonaorientale/', [
  contains('Fantacalcio - V763', 'footer V763'),
  contains('admin-card-visibility-v456.js?v=763', 'cache-bust JS V763'),
  contains('admin-card-visibility-v456.css?v=763', 'cache-bust CSS V763')
]);
await fetchText('controller FantaEngine V763', '/fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js?v=763', [
  contains('const RELEASE = "V763"', 'controller V763'),
  contains('control.addEventListener("click"', 'click delegato sul controllo'),
  contains('control.addEventListener("change"', 'change delegato sul controllo'),
  contains('runInteractionSelfTest', 'self-test runtime'),
  contains('storageMode = "memory"', 'fallback memoria'),
  excludes('adminCardSelectorDesktopHardfixV761', 'hardfix concorrente V761 assente'),
  excludes('nextChecked = !input.checked', 'inversione manuale checkbox assente'),
  excludes('new MutationObserver(decorate).observe(document.documentElement', 'observer ricorsivo assente')
]);
await fetchText('fallback ZonaOrientale V763', '/zonaorientale/assets/js/core/admin-card-visibility-v456.js?v=763', [
  contains('const RELEASE = "V763"', 'fallback V763')
]);
await fetchText('CSS FantaEngine V763', '/fanta-engine/css/shared/v487/assets/css/refactor/admin-card-visibility-v456.css?v=763', [
  contains('[data-admin-card-runtime="V763"]', 'contratto CSS V763'),
  excludes('.admin-card-checkbox-hardfix-v761', 'hack CSS V761 assente')
]);

if (failures) {
  console.error(`\nV763 live check fallito: ${failures} errore/i.`);
  process.exit(1);
}
console.log('\nV763 live check completato: controller Admin unico e release coerente.');
