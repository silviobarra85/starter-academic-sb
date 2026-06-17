#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const toolsDir = path.dirname(__filename);
const siteRoot = path.resolve(toolsDir, '..');
const appFile = path.join(siteRoot, 'assets', 'app.js');
const indexFile = path.join(siteRoot, 'index.html');
const competitionFile = path.join(siteRoot, 'competition.html');
const playerFile = path.join(siteRoot, 'player.html');
const legacyRel = 'assets/js/refactor/admin-publication-workflow-v213.js';
const legacyFile = path.join(siteRoot, legacyRel);
const quiet = process.argv.includes('--quiet');
const json = process.argv.includes('--json');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function exists(relPath) {
  return fs.existsSync(path.join(siteRoot, relPath));
}

function countRuntimeRefs(pattern) {
  const files = [appFile, indexFile, competitionFile, playerFile].filter(fs.existsSync);
  let count = 0;
  for (const file of files) {
    const text = read(file);
    const matches = text.match(pattern);
    count += matches ? matches.length : 0;
  }
  return count;
}

const appText = read(appFile);
const legacyText = read(legacyFile);
const importLines = appText.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line));
const htmlText = [indexFile, competitionFile, playerFile].map(read).join('\n');

const checks = [
  {
    name: 'modulo legacy V213 presente solo come file candidato review',
    ok: exists(legacyRel),
    details: legacyRel
  },
  {
    name: 'modulo V213 non importato dal runtime corrente',
    ok: !importLines.some((line) => /admin-publication-workflow-v213\.js/.test(line))
      && !/(?:src|href)="[^"]*admin-publication-workflow-v213\.js/.test(htmlText),
    details: 'nessun import app.js e nessun tag HTML diretto'
  },
  {
    name: 'modulo V213 esporta installAdminPublicationWorkflowRefactorV213 senza auto-install',
    ok: /export\s+function\s+installAdminPublicationWorkflowRefactorV213/.test(legacyText)
      && !/installAdminPublicationWorkflowRefactorV213\s*\(/.test(legacyText.replace(/export\s+function\s+installAdminPublicationWorkflowRefactorV213\s*\(/, '')),
    details: 'file inerte finche non viene importato/chiamato'
  },
  {
    name: 'workflow inline Stato Firebase/JSON V190 presente in app.js',
    ok: /function\s+runPublicationStatusV190/.test(appText)
      && /function\s+renderPublicationStatusPanelV190/.test(appText)
      && /data-run-publication-status-v190/.test(appText)
      && /publicationStatusMountV190/.test(appText),
    details: 'workflow canonico inline preservato'
  },
  {
    name: 'preflight asset pubblici V179/V203 ancora presente',
    ok: /runPublicAssetsPreflightV179/.test(appText)
      && /data-run-public-preflight-v179/.test(appText)
      && /publicationStatusPreflightReportV190/.test(appText),
    details: 'controllo asset pubblici preservato'
  },
  {
    name: 'promemoria pubblicazione V189 ancora presente',
    ok: /readAdminPublicationRemindersV189/.test(appText)
      && /getAdminPublicationActionsV189/.test(appText)
      && /data-clear-admin-publication-reminders-v189/.test(appText),
    details: 'reminder pubblicazione dati preservato'
  },
  {
    name: 'marker audit V351 presente',
    ok: /ZonaOrientaleAdminPublicationWorkflowAuditV351/.test(appText),
    details: 'window.ZonaOrientaleAdminPublicationWorkflowAuditV351'
  }
];

const ok = checks.every((item) => item.ok);
const result = {
  version: 'V351',
  ok,
  checks,
  legacyModule: legacyRel,
  runtimeReferenceCount: countRuntimeRefs(/admin-publication-workflow-v213\.js/g),
  recommendation: 'Tenere V213 non importato per ora. Eventuale rimozione solo con V dedicata dopo test manuale Admin Stato Firebase/JSON, preflight asset e promemoria pubblicazione.',
  protectedAreas: [
    'Admin Stato Firebase/JSON',
    'preflight asset pubblici',
    'promemoria pubblicazione',
    'Diagnostica dati Admin',
    'flusso JSON statici'
  ]
};

if (json) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else if (!quiet || !ok) {
  console.log('# Audit workflow pubblicazione Admin V351');
  console.log('');
  for (const item of checks) {
    const suffix = item.details ? ` - ${item.details}` : '';
    console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${suffix}`);
  }
  console.log('');
  console.log(`Esito: ${ok ? 'OK' : 'FAIL'}`);
  console.log(`Raccomandazione: ${result.recommendation}`);
}

process.exit(ok ? 0 : 1);
