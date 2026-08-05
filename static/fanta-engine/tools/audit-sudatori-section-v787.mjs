import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || process.cwd());
const failures = [];
const checks = [];
function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) { failures.push(`File mancante: ${relativePath}`); return null; }
  try { return JSON.parse(fs.readFileSync(fullPath, 'utf8')); }
  catch (error) { failures.push(`JSON non valido: ${relativePath} (${error.message})`); return null; }
}
function check(label, condition) { checks.push({ label, ok: Boolean(condition) }); if (!condition) failures.push(label); }

const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const runtime = readJson('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const archive = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
check('Manifest dati ioSudo preservato', Boolean(manifest));
check('Versione dati preservata a V782', manifest?.version === 'V782' && runtime?.meta?.version === 'V782');
check('Payload archivio disponibile', Boolean(archive));
check('20 squadre preservate', Array.isArray(runtime?.teams) && runtime.teams.length === 20 && manifest?.teams === 20);
check('Directory giocatori coerente', Array.isArray(runtime?.playerDirectory) && runtime.playerDirectory.length === Number(manifest?.players || 0));
check('Rose raggruppate per 20 squadre', runtime?.playersByTeam && Object.keys(runtime.playersByTeam).length === 20);
check('Formazioni raggruppate per 20 squadre', runtime?.formationsByTeam && Object.keys(runtime.formationsByTeam).length === 20);
check('58 SOS operativi preservati', Number(manifest?.injuries) === 58);
check('111 amichevoli preservate', Number(manifest?.friendlies) === 111);
check('51 tabellini amichevoli preservati', runtime?.friendlyPlayerStatsByMatch && Object.keys(runtime.friendlyPlayerStatsByMatch).length === 51);
check('Audit duplicati V782 senza collisioni', manifest?.duplicateAuditV782?.duplicateIds === 0 && manifest?.duplicateAuditV782?.duplicateFantacalcioIds === 0);
check('ioSudo V787 non cancella i dati V782', manifest?.dataFile === 'sudatori-runtime.json' && manifest?.archiveDataFile === 'sudatori-data.json');
console.log(`Audit dati Sudatori V787: ${checks.filter((item) => item.ok).length}/${checks.length} controlli superati.`);
checks.forEach((item) => console.log(`${item.ok ? 'OK' : 'ERRORE'} - ${item.label}`));
if (failures.length) { console.error(`Audit dati Sudatori V787 fallito: ${failures.length} problemi.`); process.exit(1); }
