import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifestPath = path.join(root, 'static/fanta-engine/data/sudatori/current/manifest.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function fail(message) {
  console.error(`[audit-v633] FAIL: ${message}`);
  process.exit(1);
}

if (manifest.current !== 'sudatori-data.json') fail('manifest.current non punta a sudatori-data.json');
if (manifest.dataFile !== 'sudatori-data.json') fail('manifest.dataFile non punta a sudatori-data.json');
if (manifest.version !== 'V633') fail(`versione manifest attesa V633, trovata ${manifest.version}`);
if (data.meta?.version !== 'V633') fail(`versione data attesa V633, trovata ${data.meta?.version}`);
if ((data.missingPreciseArticlesV633 || []).length !== 0) fail('ci sono ancora articoli mancanti in missingPreciseArticlesV633');
if ((data.resolvedPreciseArticlesV633 || []).length !== 10) fail('resolvedPreciseArticlesV633 deve contenere 10 recuperi');

const urls = [
  'https://www.tuttomercatoweb.com/serie-a/intrecci-juventus-inter-bianconeri-solet-nerazzurri-osservano-lucumi-2251840',
  'https://www.tuttomercatoweb.com/serie-a/i-calciomercato-i-stop-indiscrezioni-trattative-retroscena-10-luglio-2252434',
  'https://www.tuttomercatoweb.com/serie-a/roma-sfoglia-margherita-attacco-mika-godts-ajax-lista-amico-2252577',
  'https://www.tuttomercatoweb.com/serie-a/fiorentina-arrivo-oso-valdepenas-vorrebbe-raggiungere-grosso-club-2252846',
  'https://www.tuttomercatoweb.com/serie-a/milan-novita-fascia-destra-contatti-mazraoui-amorim-apprezza-2252851',
  'https://www.tuttomercatoweb.com/serie-a/lazio-spunta-barron-centrocampo-bologna-eintracht-scozzese-2252752',
  'https://www.tuttomercatoweb.com/serie-a/genoa-torna-moda-fasce-mirino-virginius-young-boys-2252611',
  'https://www.tuttomercatoweb.com/serie-a/genoa-difensore-salvano-passo-catanzaro-affare-prestito-diritto-riscatto-2252558',
  'https://www.tuttomercatoweb.com/editoriale/guardiola-ct-dell-italia-maldini-leonardo-puo-juve-spalletti-insiste-kessie-goretzka-vlahovic-ripens-2253035',
  'https://www.tuttomercatoweb.com/serie-a/lecce-assicura-2008-vitale-centrocampista-aggregato-primavera-2252336'
];

const serialized = JSON.stringify(data);
for (const url of urls) {
  if (!serialized.includes(url)) fail(`URL recuperato non trovato nel dataset: ${url}`);
}

console.log('[audit-v633] OK: fonti articolo V633 recuperate e manifest valido.');
