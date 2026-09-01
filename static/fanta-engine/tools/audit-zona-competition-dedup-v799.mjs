import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const json=(p)=>JSON.parse(read(p));
let ok=0, fail=0;
function check(c,m){if(c){console.log('OK - '+m);ok++;}else{console.error('ERRORE - '+m);fail++;}}
const release=json('static/zonaorientale/release.json');
const cfg=json('static/zonaorientale/assets/league-config.json');
const app=read('static/zonaorientale/assets/app.js');
const detail=read('static/zonaorientale/competition.html');
const loader=read('static/zonaorientale/assets/js/core/league-config-v443.js');
const calendar=json('static/zonaorientale/assets/competitions/2026-2027/campionato-2026-2027.json');
const snapshot=json('static/zonaorientale/assets/snapshots/seasons/2026-2027.json');

check(release.version==='799','release V799');
check(release.entrypoint==='assets/app.js?v=799','entrypoint V799');
check(String(cfg.currentVersion)==='799','league-config JSON V799');
check(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "799"'),'diagnostica app V799');
check(loader.includes("currentVersion: '799'")&&loader.includes('league-config.json?v=799'),'loader/config URL V799');
check(detail.includes('league-config-v443.js?v=799'),'competition usa loader V799');
check(detail.includes('function isSameFixtureV799'),'matcher fixture V799 presente');
check(detail.includes('function findFixtureIndexV799'),'ricerca fixture robusta V799 presente');
check(detail.includes('collapseDuplicateFixturesV799'),'deduplica finale V799 presente');
check(detail.includes('Firebase deve sovrascrivere la gara base'),'contratto override Firebase documentato');

const target=(calendar.matches||[]).filter(m=>Number(m.leagueMatchday)===2 && m.homeTeamName==='Prestige Worldwide' && m.awayTeamName==='Afc Severgas Baronissi');
check(target.length===1,'calendario statico contiene una sola Prestige-Baronissi alla giornata 2');
check(target[0]?.homeGoals===1&&target[0]?.awayGoals===2&&Number(target[0]?.homeScore)===71&&Number(target[0]?.awayScore)===72.5,'risultato statico corretto 1-2 (71-72,5)');
const snap=(snapshot.competitionMatches||[]).filter(m=>Number(m.serieAMatchday)===2 && m.homeTeamName==='Prestige Worldwide' && m.awayTeamName==='Afc Severgas Baronissi');
check(snap.length===1,'snapshot contiene una sola Prestige-Baronissi alla giornata 2');
check(Boolean(target[0]?.id)&&Boolean(snap[0]?.id)&&target[0].id!==snap[0].id,'id statico e snapshot diversi: caso di deduplica reale coperto');

function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
function round(m){const d=Number(m?.leagueMatchday);if(Number.isFinite(d)&&d>0)return d;const t=String(m?.matchday||m?.stage||'');const p=Number((t.match(/\d+/)||[])[0]);if(Number.isFinite(p)&&p>0)return p;const s=Number(m?.serieAMatchday);return Number.isFinite(s)&&s>0?s:0;}
function teamEq(a,b,side){const id=side==='home'?'homeSeasonTeamId':'awaySeasonTeamId';const name=side==='home'?'homeTeamName':'awayTeamName';const ai=String(a?.[id]||'').trim(),bi=String(b?.[id]||'').trim();if(ai&&bi)return ai===bi;const an=norm(a?.[name]),bn=norm(b?.[name]);return Boolean(an&&bn&&an===bn);}
function same(a,b){if(String(a.competitionId||'')&&String(b.competitionId||'')&&a.competitionId!==b.competitionId)return false;if(!teamEq(a,b,'home')||!teamEq(a,b,'away'))return false;const ar=round(a),br=round(b);if(ar&&br&&ar!==br)return false;const as=Number(a.serieAMatchday),bs=Number(b.serieAMatchday);if(Number.isFinite(as)&&as>0&&Number.isFinite(bs)&&bs>0&&as!==bs)return false;return Boolean(ar||br||(as>0&&bs>0));}
const firebaseOverride={...snap[0],id:'firebase_editable_prestige_baronissi',matchday:'2',leagueMatchday:null,homeTeamName:'',awayTeamName:'',source:'firebase-admin-v795'};
check(same(target[0],snap[0]),'matcher riconosce statico e snapshot come stessa gara');
check(same(target[0],firebaseOverride),'matcher riconosce anche override Firebase con id/testo giornata diversi');
check(firebaseOverride.id==='firebase_editable_prestige_baronissi','simulazione preserva id record amministrativo modificabile');

console.log(`\nAudit V799 deduplica competizioni: ${ok}/${ok+fail} controlli superati.`);
if(fail) process.exit(1);
