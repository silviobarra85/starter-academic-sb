import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function fail(message) {
  console.error(`[audit-iosudo-v633] FAIL: ${message}`);
  process.exit(1);
}

if (data.meta?.version !== 'V633') fail('ioSudo non leggerebbe dati V633');
if (!data.meta?.ioSudoSharedData || data.meta.ioSudoSharedData !== 'V633') fail('meta.ioSudoSharedData non aggiornato a V633');
if ((data.resolvedPreciseArticlesV633 || []).length !== 10) fail('ioSudo deve ricevere i 10 link recuperati nel JSON condiviso');

console.log('[audit-iosudo-v633] OK: ioSudo legge il dataset condiviso V633 con fonti recuperate.');
