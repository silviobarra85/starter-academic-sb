import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function fail(message) {
  console.error(`[audit-iosudo-v634] FAIL: ${message}`);
  process.exit(1);
}

if (data.meta?.version !== 'V634') fail('ioSudo non leggerebbe dati V634');
if (data.meta?.ioSudoSharedData !== 'V634') fail('meta.ioSudoSharedData non aggiornato a V634');
if ((data.missingPreciseArticlesV634 || []).length !== 0) fail('ioSudo riceve articoli ancora mancanti');
if ((data.resolvedPreciseArticlesV634 || []).length !== 10) fail('ioSudo deve ricevere i 10 link puntuali V634');
if (!Array.isArray(data.sources) || data.sources.length < 150) fail('ioSudo riceverebbe elenco fonti incompleto');

console.log('[audit-iosudo-v634] OK: ioSudo legge il dataset condiviso V634 aggiornato.');
