#!/usr/bin/env node
import process from 'node:process';

const base = new URL(process.argv[2] || 'https://silviobarra.com');
const probe = Date.now();
let failures = 0;

async function fetchText(label, pathname, assertions = []) {
  const url = new URL(pathname, base);
  url.searchParams.set('__v761_probe', String(probe));
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    const text = await response.text();
    if (!response.ok) {
      failures += 1;
      console.error(`FAIL ${response.status} - ${label} - ${url.href}`);
      return '';
    }
    for (const assertion of assertions) {
      const ok = assertion.test(text, response);
      if (!ok) {
        failures += 1;
        console.error(`FAIL content - ${label}: ${assertion.description} - ${url.href}`);
      }
    }
    if (!assertions.some((assertion) => !assertion.test(text, response))) {
      console.log(`OK ${response.status} - ${label} - ${url.href}`);
    }
    return text;
  } catch (error) {
    failures += 1;
    console.error(`FAIL fetch - ${label} - ${url.href} - ${error.message}`);
    return '';
  }
}

const contains = (needle, description = `contiene ${needle}`) => ({
  description,
  test: (text) => text.includes(needle)
});
const excludes = (needle, description = `non contiene ${needle}`) => ({
  description,
  test: (text) => !text.includes(needle)
});

await fetchText('release manifest V761', '/zonaorientale/release.json', [
  { description: 'JSON valido con version 761', test: (text) => {
    try { return String(JSON.parse(text).version) === '761'; } catch { return false; }
  }}
]);
await fetchText('home V761', '/zonaorientale/', [
  contains('Fantacalcio - V761', 'footer V761'),
  contains('admin-card-visibility-v456.js?v=761', 'cache-bust JS V761'),
  contains('admin-card-visibility-v456.css?v=761', 'cache-bust CSS V761')
]);
await fetchText('hardfix FantaEngine V761', '/fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js?v=761', [
  contains('adminCardSelectorDesktopHardfixV761', 'implementazione V761'),
  contains("observerMode: 'targeted-added-nodes'", 'observer mirato'),
  excludes('new MutationObserver(decorate).observe(document.documentElement', 'observer globale ricorsivo assente'),
  excludes('[50, 250, 800, 2000, 5000].forEach', 'timer ripetuti assenti'),
  excludes("document.addEventListener('pointerup', intercept, true)", 'doppio toggle pointerup assente')
]);
await fetchText('fallback ZonaOrientale V761', '/zonaorientale/assets/js/core/admin-card-visibility-v456.js?v=761', [
  contains('adminCardSelectorDesktopHardfixV761', 'implementazione V761')
]);
await fetchText('CSS FantaEngine V761', '/fanta-engine/css/shared/v487/assets/css/refactor/admin-card-visibility-v456.css?v=761', [
  contains('.admin-card-checkbox-hardfix-v761', 'classe hardfix V761')
]);

if (failures) {
  console.error(`\nV761 live check fallito: ${failures} errore/i.`);
  process.exit(1);
}
console.log('\nV761 live check completato: release coerente e loop MutationObserver rimosso.');
