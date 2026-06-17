#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const toolsDir = path.dirname(__filename);
const siteRoot = path.resolve(toolsDir, '..');
const appFile = path.join(siteRoot, 'assets', 'app.js');
const simulatorFile = path.join(siteRoot, 'assets/js/dev/trade-notification-simulator-v255.js');
const quiet = process.argv.includes('--quiet');
const json = process.argv.includes('--json');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

const appText = read(appFile);
const simText = read(simulatorFile);
const checks = [
  {
    name: 'marker runtime V349 presente',
    ok: /ZonaOrientaleTradeSimulatorLocalActionsV349/.test(appText),
    details: 'window.ZonaOrientaleTradeSimulatorLocalActionsV349'
  },
  {
    name: 'riconoscimento righe simulate localOnly/source dev',
    ok: /function isLocalTradeSimulationV349/.test(appText)
      && /item\.localOnly === true/.test(appText)
      && /dev-simulator-v255/.test(appText),
    details: 'localOnly, dev-simulator-v255, console-simulator-v255-local'
  },
  {
    name: 'override updateNegotiationStatusV119 intercetta simulazioni prima di Firebase',
    ok: /const updateNegotiationStatusBeforeV349 = updateNegotiationStatusV119/.test(appText)
      && /updateNegotiationStatusV119 = async function updateNegotiationStatusV349/.test(appText)
      && /return updateNegotiationStatusBeforeV349\?\.\(id, status\)/.test(appText),
    details: 'wrapper compatibile: localOnly locale, reali passano al flusso storico'
  },
  {
    name: 'azioni simulate non chiamano updateDoc/deleteDoc',
    ok: (() => {
      const start = appText.indexOf('function updateLocalTradeSimulationStatusV349');
      const end = appText.indexOf('const updateNegotiationStatusBeforeV349');
      const fnText = start >= 0 && end > start ? appText.slice(start, end) : '';
      return Boolean(fnText) && !/updateDoc\(/.test(fnText) && !/deleteDoc\(/.test(fnText) && /state\.raw\.transferNegotiations/.test(fnText);
    })(),
    details: 'solo state.raw e state.tradeNotificationSimulatorLocalRowsV255'
  },
  {
    name: 'render e badge aggiornati dopo azione locale',
    ok: /renderUserAreaV34\?\.\(\)/.test(appText)
      && /renderTransferMarketPageV119\?\.\(\)/.test(appText)
      && /applyTradeNotificationBadgesV238\?\.\(\)/.test(appText),
    details: 'area presidente, fantamercato, badge notifiche'
  },
  {
    name: 'simulatore V255 produce righe localOnly',
    ok: /localOnly: options\.localOnly !== false/.test(simText)
      && /source: SIM_SOURCE/.test(simText)
      && /const SIM_SOURCE = 'dev-simulator-v255'/.test(simText),
    details: 'assets/js/dev/trade-notification-simulator-v255.js'
  }
];

const ok = checks.every((item) => item.ok);
const result = {
  version: 'V349',
  ok,
  checks,
  behavior: 'Le azioni Accetta/Rifiuta/Annulla su righe simulate localOnly aggiornano solo lo stato locale; le trattative reali continuano a usare Firebase.',
  manualTest: [
    'ZonaOrientaleTradeSimulatorV255.simulateIncomingProposal()',
    'clic su Rifiuta o Accetta nella card ricevuta',
    'nessun errore Missing or Insufficient permissions',
    'notifica locale rimossa e card aggiornata'
  ]
};

if (json) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else if (!quiet || !ok) {
  console.log('# Audit azioni locali simulatore trade V349');
  console.log('');
  for (const item of checks) {
    const suffix = item.details ? ` - ${item.details}` : '';
    console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${suffix}`);
  }
  console.log('');
  console.log(`Esito: ${ok ? 'OK' : 'FAIL'}`);
}

process.exit(ok ? 0 : 1);
