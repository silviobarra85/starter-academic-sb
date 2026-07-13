import fs from 'node:fs';
const js = fs.readFileSync('static/fanta-engine/js/apps/iosudo-app-v637.js', 'utf8');
const html = fs.readFileSync('static/iosudo/index.html', 'utf8');
function assert(cond, msg){ if(!cond){ console.error('[V637][FAIL]', msg); process.exit(1); }}
assert(html.includes('iosudo-app-v637.js?v=637'), 'index loads v637 js');
assert(js.includes("['n dicka', 'ndicka']"), 'Ndicka alias');
assert(js.includes("'vasquez'") && js.includes("'sulemana'") && js.includes('initialSensitiveConflict'), 'sensitive names protected');
assert(js.includes('function sameName'), 'sameName exists');
console.log('[V637][OK] ioSudo alias rules and version references verified');
