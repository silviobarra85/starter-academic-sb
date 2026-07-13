import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const appPath = path.join(root, 'static/fanta-engine/js/apps/iosudo-app-v638.js');
const indexPath = path.join(root, 'static/iosudo/index.html');
const swPath = path.join(root, 'static/iosudo/sw.js');
const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifestPath = path.join(root, 'static/fanta-engine/data/sudatori/current/manifest.json');

for (const file of [appPath, indexPath, swPath, dataPath, manifestPath]) {
  if (!fs.existsSync(file)) throw new Error(`File mancante: ${file}`);
}
const app = fs.readFileSync(appPath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');
const sw = fs.readFileSync(swPath, 'utf8');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const required = [
  'addListoneRowsToPlayers',
  'makeListoneOnlyPlayer',
  "['j martinez', 'martinez jo']",
  "['alisson santos', 'santos a']",
  "['ivan provedel', 'provedel']",
  'ioSudoListoneAllPlayers'
];
for (const token of required) {
  if (!app.includes(token) && !JSON.stringify(data.meta || {}).includes(token)) throw new Error(`Token audit mancante: ${token}`);
}
if (!index.includes('iosudo-app-v638.js?v=638')) throw new Error('index non punta a iosudo v638');
if (!sw.includes('iosudo-shell-v638')) throw new Error('service worker non aggiornato a v638');
if ((manifest.current || manifest.dataFile) !== 'sudatori-data.json') throw new Error('manifest Sudatori non punta a sudatori-data.json');
if ((data.meta || {}).version !== 'V638') throw new Error('dataset non marcato V638');
console.log('OK audit ioSudo V638: listone completo, alias fantasy e dati manifest coerenti.');
