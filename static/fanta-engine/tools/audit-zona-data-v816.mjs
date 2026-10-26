import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8'); const j=p=>JSON.parse(read(p));
let ok=0, bad=0; const check=(c,m)=>{if(c){ok++;console.log('OK - '+m)}else{bad++;console.error('FAIL - '+m)}};
const norm=x=>String(x||'').trim().replace(/\s+/g,' ').toLocaleLowerCase('it');
const camp=j('static/zonaorientale/assets/competitions/2026-2027/campionato-2026-2027.json');
const champ=j('static/zonaorientale/assets/competitions/2026-2027/champions-league-2026-2027.json');
const cm=j('static/zonaorientale/assets/competitions/manifest.json');
const rm=j('static/zonaorientale/assets/rose/manifest.json');
const roster=j('static/zonaorientale/assets/rose/2026-2027-2026-10-26.json');
const snap=j('static/zonaorientale/assets/snapshots/seasons/2026-2027.json');
const sm=j('static/zonaorientale/assets/snapshots/seasons/manifest.json');
const cfg=j('static/zonaorientale/assets/league-config.json');
const rel=j('static/zonaorientale/release.json');
const app=read('static/zonaorientale/assets/app.js');
const index=read('static/zonaorientale/index.html');
const competition=read('static/zonaorientale/competition.html');
const player=read('static/zonaorientale/player.html');
const service=read('static/zonaorientale/assets/js/data/static-files-service.js');
const ui=read('static/zonaorientale/assets/js/core/ui.js');
const bilanci=read('static/zonaorientale/assets/js/sections/bilanci-snapshot-section-v435.js');

check(rel.version==='816' && rel.entrypoint==='assets/app.js?v=816','release V816');
check(cfg.currentVersion==='816' && String(cfg.lastOverlay||'').startsWith('V816'),'config V816');
check(index.includes('assets/app.js?v=816') && index.includes('league-config-v443.js?v=816'),'home cache-buster V816');
check([app,competition,player,service,ui,bilanci].every(s=>s.includes('league-config-v443.js?v=816')),'runtime usa config V816');
check(app.includes('version: "V816"') && app.includes('Aggiornato al 26/10/2026'),'footer canonico V816');
check(app.includes('import("./firebase.js?v=814")'),'fix Auth V814 preservato senza modificare Firebase');

const campPlayed=camp.matches.filter(m=>m.status==='GIOCATA');
check(camp.matches.length===180 && campPlayed.length===40,'Campionato: 180 gare, 40 giocate');
check(campPlayed.filter(m=>Number(m.leagueMatchday)>=4 && Number(m.leagueMatchday)<=8).length===25,'Campionato: importate 25 gare G4-G8');
check(camp.results.length===10 && camp.results.every(r=>r.played===8),'classifica ufficiale a 8 giornate');
const expected=[['Real Pisistrius',14,595],['As Paperopoli',14,573],['Beetlejuice',14,564],['Ac Milan',13,611.5],['Afc Severgas Baronissi',13,557.5],['River Plaid',11,585],['Olympic Salerno FC',10,562],['FC DueFratelli2005',9,552.5],['Prestige Worldwide',8,565.5],['real mappine',6,547]];
check(expected.every((e,i)=>norm(camp.results[i]?.teamName)===norm(e[0]) && Number(camp.results[i]?.points)===e[1] && Number(camp.results[i]?.fantapoints)===e[2]),'ordine/punti/fantapunti classifica coincidono con Excel');
// recompute standings
const rows=new Map(); const ensure=id=>{if(!rows.has(id))rows.set(id,{p:0,fp:0,gf:0,ga:0,g:0,v:0,n:0,s:0});return rows.get(id)};
for(const m of campPlayed){const h=ensure(m.homeSeasonTeamId),a=ensure(m.awaySeasonTeamId);const hg=Number(m.homeGoals),ag=Number(m.awayGoals);h.g++;a.g++;h.gf+=hg;h.ga+=ag;a.gf+=ag;a.ga+=hg;h.fp+=Number(m.homeScore);a.fp+=Number(m.awayScore);if(hg>ag){h.v++;a.s++;h.p+=3}else if(hg<ag){a.v++;h.s++;a.p+=3}else{h.n++;a.n++;h.p++;a.p++;}}
check(camp.results.every(r=>{const x=rows.get(r.seasonTeamId);return x && x.g===r.played&&x.v===r.wins&&x.n===r.draws&&x.s===r.losses&&x.gf===r.goalsFor&&x.ga===r.goalsAgainst&&x.p===r.points&&x.fp===r.fantapoints;}),'classifica coerente con le 40 partite');

check(champ.matches.length===8 && champ.matches.filter(m=>m.status==='GIOCATA').length===4,'Champions: 4 andate giocate su 8 gare');
check(champ.matches.filter(m=>m.leg==='RITORNO').every(m=>m.status==='DA_GIOCARE'),'Champions: tutti i ritorni ancora da giocare');
check(champ.competition.status==='ATTIVA','Champions attiva');
check(cm.competitions.find(x=>x.id==='2026-2027-campionato')?.playedMatches===40 && cm.competitions.find(x=>x.id==='2026-2027-champions-league')?.playedMatches===4,'manifest competizioni aggiornato');

const latest=rm.rosters[0]; check(latest?.id==='2026-2027-2026-10-26' && latest?.players===296,'rosa primaria 26/10 con 296 giocatori');
const rr=roster.rosters.flatMap(t=>(t.players||[]).map(p=>({team:t.name,...p})));
const heggem=rr.find(x=>norm(x.playerName)==='heggem'); const joao=rr.find(x=>norm(x.playerName)==='joao mario'); const torn=rr.find(x=>norm(x.playerName)==='tornqvist'); const gim=rr.find(x=>norm(x.playerName)==='gimenez');
check(norm(heggem?.team)==='olympic salerno fc' && Number(heggem?.cost)===1,'Heggem a Olympic Salerno FC costo 1');
check(norm(joao?.team)==='as paperopoli' && Number(joao?.cost)===19,'Joao Mario ad As Paperopoli costo 19');
check(norm(torn?.team)==='as paperopoli' && Number(torn?.cost)===0 && Number(torn?.loanOriginalCost)===1 && torn?.loanType==='FREE_LOAN','Tornqvist mantiene prestito gratuito/costo originario');
check(gim?.listoneStatusCode==='ASTERISCATO','Gimenez resta asteriscato');
const byId=new Map(snap.seasonTeams.map(t=>[t.id,t.name])); const sr=snap.rosterEntries.map(x=>`${norm(byId.get(x.seasonTeamId))}|${norm(x.playerName)}|${Number(x.cost)}`); const pr=rr.map(x=>`${norm(x.team)}|${norm(x.playerName)}|${Number(x.cost)}`); const ss=new Set(sr);
check(sr.length===296 && pr.length===296 && pr.every(x=>ss.has(x)),'snapshot e rosa primaria coincidono 296/296');
check(snap.snapshotVersion===41 && sm.snapshots.find(x=>x.seasonId==='2026-2027')?.snapshotVersion===41,'snapshot V41');
check(snap.competitionMatches.filter(m=>m.competitionId==='2026-2027_campionato'&&m.status==='GIOCATA').length===40,'snapshot contiene 40 gare Campionato giocate');
check(snap.competitionMatches.filter(m=>m.competitionId==='2026-2027_champions'&&m.status==='GIOCATA').length===4,'snapshot contiene 4 gare Champions giocate');
const sept=snap.fmMovements.filter(x=>x.type==='SVINCOLO'&&String(x.description||'').startsWith('SVINCOLI SETTEMBRE 2026:'));
check(sept.length===10 && sept.every(x=>x.date==='2026-09-09'),'correzione svincoli V814 preservata');
check(snap.fmMovements.find(x=>x.id==='syQ6oloV2U2BFHGtzuUO')?.date==='2026-08-20','correzione acquisto Baronissi V814 preservata');

const olympicId=snap.seasonTeams.find(t=>norm(t.name)==='olympic salerno fc')?.id;
const paperId=snap.seasonTeams.find(t=>norm(t.name)==='as paperopoli')?.id;
const trade=snap.fmMovements.filter(x=>String(x.source||'')==='static-trade-october-v816');
check(trade.length===2 && trade.every(x=>x.type==='SCAMBIO' && x.date==='2026-10-12'),'scambio Heggem/Joao Mario registrato il 12/10/2026');
check(trade.some(x=>x.seasonTeamId===olympicId && Number(x.amount)===-8 && norm(x.playerName)==='heggem'),'Olympic: Heggem e uscita 8 FM');
check(trade.some(x=>x.seasonTeamId===paperId && Number(x.amount)===8 && norm(x.playerName)==='joao mario'),'Paperopoli: Joao Mario e entrata 8 FM');
const balance=id=>snap.fmMovements.filter(x=>x.seasonTeamId===id).reduce((a,x)=>a+Number(x.amount||0),0);
check(balance(olympicId)===10 && balance(paperId)===8,'saldi post-scambio: Olympic 10 FM, Paperopoli 8 FM');
check(Number(snap.metrics?.fm?.total)===341 && Number(snap.metrics?.fm?.average)===34.1,'totale FM lega invariato dopo il conguaglio');

console.log(`\nAudit V816: ${ok}/${ok+bad} controlli superati.`); if(bad) process.exit(1);
