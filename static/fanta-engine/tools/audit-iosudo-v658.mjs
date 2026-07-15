import { readFileSync } from 'node:fs';
const read = (path) => readFileSync(path, 'utf8');
const index = read('static/iosudo/index.html');
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
function assertOk(condition, message) { if (!condition) throw new Error(message); }
assertOk(/iosudo-app-v\d+\.js\?v=\d+/.test(index), 'index non punta a un JS ioSudo versionato');
assertOk(String(manifest.uiVersion || '') === String(data.meta && data.meta.uiVersion || ''), 'manifest e data meta hanno uiVersion diversa');
assertOk(Boolean(manifest.updatedAtTime || data.meta.updatedAtTime || data.meta.generatedAt), 'data+ora header non disponibile');
console.log('Audit ioSudo compatibility OK', JSON.stringify({version: manifest.version, uiVersion: manifest.uiVersion}));
