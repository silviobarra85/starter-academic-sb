#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const config = fs.readFileSync(path.join(root, 'assets/js/core/league-config-v443.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const failures = [];
function check(ok, msg){ if(!ok) failures.push(msg); }
check(!config.includes('formValidatorsV506, leagueTemplateHardeningV507'), 'league-config contiene ancora lo shorthand runtime che genera ReferenceError');
check(config.includes('formValidatorsV506: true'), 'league-config non espone formValidatorsV506 come booleano esplicito');
check(config.includes('leagueTemplateHardeningV507: true'), 'league-config non mantiene leagueTemplateHardeningV507');
check(config.includes("version: 'V513'"), 'runtime config non marcato V513');
check(index.includes('V513'), 'footer/cache HTML non aggiornato a V513');
check(index.includes('assets/app.js?v=513'), 'index non carica app.js con cache-buster V513');
check(app.includes('league-config-v443.js?v=513'), 'app.js non importa league-config con cache-buster V513');
if (failures.length) { console.error(failures.map((x)=>'FAIL: '+x).join('\n')); process.exit(1); }
console.log('OK audit runtime boot V513');
