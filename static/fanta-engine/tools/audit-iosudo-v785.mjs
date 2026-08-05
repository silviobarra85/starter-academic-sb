import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || process.cwd());
const failures = [];
const checks = [];
function read(p) { const f=path.join(root,p); if(!fs.existsSync(f)){failures.push(`File mancante: ${p}`);return '';} return fs.readFileSync(f,'utf8'); }
function readJson(p) { const t=read(p); if(!t)return null; try{return JSON.parse(t);}catch(e){failures.push(`JSON non valido: ${p} (${e.message})`);return null;} }
function check(label, condition) { checks.push({label,ok:Boolean(condition)}); if(!condition) failures.push(label); }

const index=read('static/iosudo/index.html');
const sw=read('static/iosudo/sw.js');
const pwa=readJson('static/iosudo/manifest.webmanifest');
const manifest=readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json');
const latest=readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/2026-08-05.json');
const old=readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/2026-07-04.json');
const zona=readJson('static/zonaorientale/assets/league-config.json');
const mantra=readJson('static/fantapetillomantramanager/assets/league-config.json');
const zonaApp=read('static/zonaorientale/assets/app.js');
const mantraApp=read('static/fantapetillomantramanager/assets/app.js');

check('ioSudo manutenzione V785', index.includes('ioSudo V785') && /site under construction/i.test(index));
check('App ioSudo non avviata', !/iosudo-app-v\d+\.js/.test(index) && !/sudatori\/current/.test(index));
check('Service worker manutenzione V785', sw.includes('iosudo-maintenance-v785'));
check('Manifest PWA manutenzione', /under construction|manutenzione/i.test(`${pwa?.name||''} ${pwa?.description||''}`));
const entries=Array.isArray(manifest?.listoni)?manifest.listoni:[];
const newEntry=entries.find(e=>e?.id==='2026-08-05');
const oldEntry=entries.find(e=>e?.id==='2026-07-04');
check('Nuovo listone nel manifest', newEntry?.file==='2026-08-05.json' && newEntry?.seasonId==='2026-2027');
check('Vecchio listone conservato', oldEntry?.seasonId==='2026-2027' && Boolean(old));
check('Nuovo listone più recente', entries.filter(e=>e?.seasonId==='2026-2027').sort((a,b)=>String(b.loadedAt||b.id).localeCompare(String(a.loadedAt||a.id)))[0]?.id==='2026-08-05');
check('Meta nuovo listone coerente', latest?.meta?.id==='2026-08-05' && latest?.meta?.rows===494 && latest?.meta?.activeRows===494 && latest?.meta?.asteriskRows===0);
check('494 giocatori caricati', Array.isArray(latest?.players) && latest.players.length===494);
const ids=(latest?.players||[]).map(p=>String(p.fantacalcioId||''));
const names=(latest?.players||[]).map(p=>String(p.playerName||'').trim().toLowerCase());
check('ID unici e valorizzati', ids.every(Boolean) && new Set(ids).size===ids.length);
check('Nomi unici e valorizzati', names.every(Boolean) && new Set(names).size===names.length);
check('20 squadre canoniche', new Set((latest?.players||[]).map(p=>p.realTeam)).size===20);
check('Campi Classic/Mantra e quotazioni presenti', (latest?.players||[]).every(p=>p.classicRole && p.mantraRoles && p.quotationCurrent!=='' && p.quotationCurrentMantra!==''));
for (const [label,cfg] of [['ZonaOrientale',zona],['FantaMantraManager',mantra]]) {
 check(`${label} stagione 2026-2027`,cfg?.currentSeasonId==='2026-2027');
 check(`${label} usa manifest condiviso`,cfg?.dataPaths?.listoniManifest==='../fanta-engine/data/shared-assets/current/assets/listoni/manifest.json');
 check(`${label} configurazione lega preservata`, Boolean(cfg?.currentVersion) && Boolean(cfg?.branding?.footerLastUpdated));
}
for (const [label,app] of [['ZonaOrientale',zonaApp],['FantaMantraManager',mantraApp]]) {
 check(`${label} seleziona ultimo listone`,app.includes('const latest = available[0]') && app.includes('state.selectedListoneId = latest.id'));
 check(`${label} mantiene selettore storico`,app.includes('function renderListoneSelect(listone)'));
 check(`${label} link usa ID selezionato`,app.includes('function buildFantacalcioPlayerUrl(player)') && app.includes('player?.fantacalcioId'));
 check(`${label} link Frosinone corretto`,app.includes('FRO: \"frosinone\"') && app.includes('frosinone: \"FRO\"'));
}
console.log(`Audit ioSudo/listone V785: ${checks.filter(x=>x.ok).length}/${checks.length} controlli superati.`);
checks.forEach(x=>console.log(`${x.ok?'OK':'ERRORE'} - ${x.label}`));
if(failures.length){console.error(`Audit V785 fallito: ${failures.length} problemi.`);process.exit(1);}
