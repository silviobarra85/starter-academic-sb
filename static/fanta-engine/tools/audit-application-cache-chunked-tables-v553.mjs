#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const rel = (p) => path.join(root, p);
const read = (p) => fs.existsSync(rel(p)) ? fs.readFileSync(rel(p), 'utf8') : '';
const exists = (p) => fs.existsSync(rel(p));
const mustExist = (p) => { if (!exists(p)) errors.push(`File mancante: ${p}`); };
const mustContain = (p, pattern, label) => {
  const text = read(p);
  const ok = pattern instanceof RegExp ? pattern.test(text) : text.includes(pattern);
  if (!ok) errors.push(`${p}: manca ${label}`);
};
const mustNotContain = (p, pattern, label) => {
  const text = read(p);
  const ok = pattern instanceof RegExp ? pattern.test(text) : text.includes(pattern);
  if (ok) errors.push(`${p}: contiene ancora ${label}`);
};

const modulePath = 'static/fanta-engine/js/ui/application-cache-chunked-tables-v553.js';
const auditPath = 'static/fanta-engine/tools/audit-application-cache-chunked-tables-v553.mjs';
[
  modulePath,
  auditPath,
  'docs/PERFORMANCE_APPLICATION_CACHE_V553.md',
  'docs/AI_ASSISTANT_HANDOFF_V553.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md',
  'docs/OVERLAY_ROADMAP.md'
].forEach(mustExist);

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const app = `static/${league}/assets/app.js`;
  const html = `static/${league}/index.html`;
  const config = `static/${league}/assets/league-config.json`;
  mustExist(app);
  mustExist(html);
  mustExist(config);
  mustContain(app, 'installApplicationCacheChunkedTablesV553', 'import/install V553');
  mustContain(app, 'FantaEngineApplicationCacheChunkedTablesRuntimeV553', 'runtime V553');
  mustContain(app, 'performance-profiler-lazy-render-v552.js?v=553', 'V552 modulo mantenuto con cache-buster V553');
  mustContain(app, 'application-cache-chunked-tables-v553.js?v=553', 'modulo V553 cache-buster');
  mustContain(html, 'application-cache-chunked-tables-v553.js?v=553', 'modulepreload V553');
  mustContain(html, 'assets/app.js?v=553', 'entrypoint app V553');
  mustContain(config, '"currentVersion": "553"', 'currentVersion 553');
  mustNotContain(html, '?v=552', 'cache-buster V552');
}

mustContain(modulePath, 'sessionStorage', 'cache sessionStorage');
mustContain(modulePath, 'content-visibility: auto', 'content-visibility righe tabella');
mustContain(modulePath, 'MutationObserver', 'observer tabelle dinamiche');
mustContain(modulePath, 'doesNotReplaceRouter: true', 'guardrail router');
mustContain(modulePath, 'firebaseWrites: false', 'guardrail Firebase');
mustContain(modulePath, 'emailjsChanged: false', 'guardrail EmailJS');
mustContain('docs/OVERLAY_ROADMAP.md', 'V553', 'roadmap V553');
mustContain('docs/OVERLAY_ROADMAP.md', 'V554', 'roadmap overlay residuo V554');
mustContain('docs/AI_ASSISTANT_HANDOFF_CURRENT.md', 'Versione corrente: **V553**', 'handoff current V553');

if (errors.length) {
  console.error('Audit V553 fallito:');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}
console.log('Audit V553 superato: cache applicativa/sessione, ottimizzazione tabelle pesanti, runtime whole-site a ?v=553 e docs/handoff aggiornati.');
