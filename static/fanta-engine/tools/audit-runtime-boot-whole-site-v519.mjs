#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const sharedModule = path.join(root, 'static/fanta-engine/js/core/public-data-autoload-v512.js');
const shared = fs.readFileSync(sharedModule, 'utf8');

const requiredExports = [
  'installPublicDataAutoloadV515',
  'installPublicDataAutoloadV516',
  'installPublicDataAutoloadV517',
  'installPublicDataAutoloadV518',
  'installPublicDataAutoloadV519',
  'createPublicDataAutoloadV517',
  'createPublicDataAutoloadV519',
  'PUBLIC_DATA_AUTOLOAD_VERSION_V519'
];

for (const name of requiredExports) {
  const functionPattern = new RegExp(`(function|const)\\s+${name}\\b`);
  const exportPattern = new RegExp(`export\\s*\\{[\\s\\S]*\\b${name}\\b[\\s\\S]*\\}`);
  if (!functionPattern.test(shared) && !new RegExp(`const\\s+${name}\\b`).test(shared)) {
    throw new Error(`Binding mancante nel modulo condiviso: ${name}`);
  }
  if (!exportPattern.test(shared)) {
    throw new Error(`Export mancante nel modulo condiviso: ${name}`);
  }
}

if (/installPublicDataAutoloadV517,\s*installPublicDataAutoloadV518/.test(shared) && !/function installPublicDataAutoloadV517\b/.test(shared)) {
  throw new Error('installPublicDataAutoloadV517 esportato senza funzione definita.');
}

for (const league of leagues) {
  const appPath = path.join(root, `static/${league}/assets/app.js`);
  const indexPath = path.join(root, `static/${league}/index.html`);
  const leagueConfigPath = path.join(root, `static/${league}/assets/js/core/league-config-v443.js`);
  const app = fs.readFileSync(appPath, 'utf8');
  const index = fs.readFileSync(indexPath, 'utf8');
  const leagueConfig = fs.readFileSync(leagueConfigPath, 'utf8');

  if (!app.includes('installPublicDataAutoloadV519')) throw new Error(`${league}: app.js non usa installPublicDataAutoloadV519.`);
  if (!app.includes('public-data-autoload-v512.js?v=519')) throw new Error(`${league}: app.js non forza public-data-autoload ?v=519.`);
  if (!index.includes('./assets/app.js?v=519')) throw new Error(`${league}: index.html non carica app.js?v=519.`);
  if (/league-config-v443\.js\?v=512/.test(index + app)) throw new Error(`${league}: residuo league-config ?v=512.`);
  if (/formValidatorsV506\s*[,}\n]/.test(leagueConfig) && !/formValidatorsV506\s*:\s*true/.test(leagueConfig)) {
    throw new Error(`${league}: formValidatorsV506 non e assegnato a true.`);
  }
}

console.log('Audit V519 superato: export public-data-autoload definiti e runtime whole-site a ?v=519.');
