import fs from 'fs';
import path from 'path';

const root = process.cwd();
const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifestPath = path.join(root, 'static/fanta-engine/data/sudatori/current/manifest.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function fail(message) {
  console.error(`[audit-v634] FAIL: ${message}`);
  process.exit(1);
}

if (manifest.current !== 'sudatori-data.json') fail('manifest.current non punta a sudatori-data.json');
if (manifest.dataFile !== 'sudatori-data.json') fail('manifest.dataFile non punta a sudatori-data.json');
if (manifest.version !== 'V634') fail(`versione manifest attesa V634, trovata ${manifest.version}`);
if (data.meta?.version !== 'V634') fail(`versione data attesa V634, trovata ${data.meta?.version}`);
if ((data.missingPreciseArticlesV634 || []).length !== 0) fail('ci sono ancora articoli mancanti in missingPreciseArticlesV634');
if ((data.resolvedPreciseArticlesV634 || []).length !== 10) fail('resolvedPreciseArticlesV634 deve contenere 10 righe articolo');
if (!Array.isArray(data.newSourcesV634) || data.newSourcesV634.length < 2) fail('newSourcesV634 non contiene le nuove fonti');
if ((data.sources || []).length < 150) fail('fonti non allineate al workbook v12');

const urls = [
  "https://www.tuttomercatoweb.com/serie-a/intrecci-juventus-inter-bianconeri-solet-nerazzurri-osservano-lucumi-2251840",
  "https://www.tuttomercatoweb.com/serie-a/roma-sfoglia-margherita-attacco-mika-godts-ajax-lista-amico-2252577",
  "https://www.tuttomercatoweb.com/serie-a/fiorentina-arrivo-oso-valdepenas-vorrebbe-raggiungere-grosso-club-2252846",
  "https://www.tuttomercatoweb.com/serie-a/milan-novita-fascia-destra-contatti-mazraoui-amorim-apprezza-2252851",
  "https://www.tuttomercatoweb.com/serie-a/lazio-spunta-barron-centrocampo-bologna-eintracht-scozzese-2252752",
  "https://www.tuttomercatoweb.com/serie-a/genoa-torna-moda-fasce-mirino-virginius-young-boys-2252611",
  "https://www.tuttomercatoweb.com/serie-a/genoa-difensore-salvano-passo-catanzaro-affare-prestito-diritto-riscatto-2252558",
  "https://www.tuttomercatoweb.com/editoriale/guardiola-ct-dell-italia-maldini-leonardo-puo-juve-spalletti-insiste-kessie-goretzka-vlahovic-ripens-2253035",
  "https://www.tuttomercatoweb.com/serie-a/i-calciomercato-i-stop-indiscrezioni-trattative-retroscena-10-luglio-2252434",
  "https://www.tuttomercatoweb.com/serie-a/lecce-assicura-2008-vitale-centrocampista-aggregato-primavera-2252336"
];
const serialized = JSON.stringify(data);
for (const url of urls) {
  if (!serialized.includes(url)) fail(`URL V634 non trovato nel dataset: ${url}`);
}

console.log('[audit-v634] OK: dati Sudatori V634, link TMW puntuali e fonti v12 validi.');
