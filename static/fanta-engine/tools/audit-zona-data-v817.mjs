import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8'); const j=p=>JSON.parse(read(p));
let ok=0,bad=0; const check=(c,m)=>{if(c){ok++;console.log('OK - '+m)}else{bad++;console.error('FAIL - '+m)}};
const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toLocaleLowerCase('it');
const camp=j('static/zonaorientale/assets/competitions/2026-2027/campionato-2026-2027.json');
const champ=j('static/zonaorientale/assets/competitions/2026-2027/champions-league-2026-2027.json');
const coppa=j('static/zonaorientale/assets/competitions/2026-2027/coppa-italia-2026-2027.json');
const cm=j('static/zonaorientale/assets/competitions/manifest.json');
const rm=j('static/zonaorientale/assets/rose/manifest.json');
const roster=j('static/zonaorientale/assets/rose/2026-2027-2026-11-11.json');
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

check(rel.version==='817' && rel.entrypoint==='assets/app.js?v=817','release V817');
check(Number(cfg.currentVersion)===817 && String(cfg.lastOverlay||'').startsWith('V817'),'config V817');
check(index.includes('assets/app.js?v=817') && index.includes('league-config-v443.js?v=817'),'home cache-buster V817');
check([app,competition,player,service,ui,bilanci].every(s=>s.includes('league-config-v443.js?v=817')),'runtime usa config V817');
check(app.includes('version: "V817"') && app.includes('Aggiornato al 11/11/2026'),'footer canonico V817');
check(app.includes('import("./firebase.js?v=814")'),'fix Auth Safari V814 preservato');

const campPlayed=camp.matches.filter(m=>m.status==='GIOCATA');
check(camp.matches.length===180 && campPlayed.length===55,'Campionato: 180 gare, 55 giocate');
check(campPlayed.filter(m=>Number(m.leagueMatchday)>=9 && Number(m.leagueMatchday)<=11).length===15,'Campionato: nuove G9-G11 complete');
check(camp.meta.sourceFile==='Calendario_Serie-A-Zonaorientale-2026-2027(3).xlsx','fonte calendario Campionato aggiornata');
check(camp.results.length===10 && camp.results.every(r=>r.played===11),'classifica ufficiale a 11 giornate');
const expCamp=[['Real Pisistrius',23,820],['As Paperopoli',20,783],['Beetlejuice',20,779],['Afc Severgas Baronissi',16,780],['River Plaid',14,798.5],['Prestige Worldwide',14,780],['FC DueFratelli2005',13,782],['Olympic Salerno FC',13,777.5],['Ac Milan',13,827.5],['real mappine',10,766.5]];
check(expCamp.every((e,i)=>norm(camp.results[i]?.teamName)===norm(e[0])&&Number(camp.results[i]?.points)===e[1]&&Number(camp.results[i]?.fantapoints)===e[2]),'ordine/punti/FPT Campionato coincidono con Excel');
const rows=new Map(); const ensure=id=>{if(!rows.has(id))rows.set(id,{p:0,fp:0,gf:0,ga:0,g:0,v:0,n:0,s:0});return rows.get(id)};
for(const m of campPlayed){const h=ensure(m.homeSeasonTeamId),a=ensure(m.awaySeasonTeamId);const hg=Number(m.homeGoals),ag=Number(m.awayGoals);h.g++;a.g++;h.gf+=hg;h.ga+=ag;a.gf+=ag;a.ga+=hg;h.fp+=Number(m.homeScore);a.fp+=Number(m.awayScore);if(hg>ag){h.v++;a.s++;h.p+=3}else if(hg<ag){a.v++;h.s++;a.p+=3}else{h.n++;a.n++;h.p++;a.p++;}}
check(camp.results.every(r=>{const x=rows.get(r.seasonTeamId);return x&&x.g===r.played&&x.v===r.wins&&x.n===r.draws&&x.s===r.losses&&x.gf===r.goalsFor&&x.ga===r.goalsAgainst&&x.p===r.points&&x.fp===r.fantapoints;}),'classifica Campionato coerente con le 55 partite');

check(champ.matches.length===12 && champ.matches.filter(m=>m.status==='GIOCATA').length===8,'Champions: 12 gare, 8 quarti giocati');
check(champ.matches.filter(m=>m.stage==='QUARTI').length===8 && champ.matches.filter(m=>m.stage==='QUARTI').every(m=>m.status==='GIOCATA'),'quarti Champions completati');
const sf=champ.matches.filter(m=>m.stage==='SEMIFINALI');
check(sf.length===4 && sf.every(m=>m.status==='DA_GIOCARE'),'quattro semifinali Champions programmate');
const sfPairs=sf.map(m=>`${norm(m.homeTeamName)}>${norm(m.awayTeamName)}`);
check(sfPairs.includes('beetlejuice>real pisistrius')&&sfPairs.includes('real pisistrius>beetlejuice')&&sfPairs.includes('river plaid>olympic salerno fc')&&sfPairs.includes('olympic salerno fc>river plaid'),'accoppiamenti semifinali Champions corretti');
check(champ.meta.sourceFile==="Calendario_Champion's-League-2026-2027(2).xlsx",'fonte Champions aggiornata');

check(coppa.competition.status==='ATTIVA' && coppa.rounds.length===4,'Coppa Italia Battle Royale attiva con 4 giornate');
check(coppa.rounds[0]?.status==='GIOCATA' && coppa.rounds.slice(1).every(r=>r.status==='DA_GIOCARE'),'solo G1 Coppa Italia giocata');
check(coppa.matches.length===10 && coppa.matches.every(m=>m.entryMode==='BATTLE_ROYALE'&&m.status==='GIOCATA'&&Number(m.leagueMatchday)===1),'Coppa G1: 10 prestazioni Battle Royale');
check(coppa.results.length===10 && coppa.results.every(r=>r.played===9),'classifica Coppa ufficiale: 9 confronti per squadra');
const expCoppa=[['Real Pisistrius',27,78.5],['Ac Milan',16,77.5],['real mappine',16,76.5],['River Plaid',16,76.5],['As Paperopoli',16,75.5],['Beetlejuice',16,75.5],['Afc Severgas Baronissi',7,70.5],['Olympic Salerno FC',7,68.5],['FC DueFratelli2005',1,62.5],['Prestige Worldwide',1,0]];
check(expCoppa.every((e,i)=>norm(coppa.results[i]?.teamName)===norm(e[0])&&Number(coppa.results[i]?.points)===e[1]&&Number(coppa.results[i]?.fantapoints)===e[2]),'classifica Coppa coincide con Excel');
check(coppa.meta.sourceFile==='Calendario_Coppa-Italia-2026-2027(1).xlsx' && coppa.meta.standingsSourceFile==='Classifica_Coppa-Italia-2026-2027.xlsx','fonti Coppa aggiornate');

const mc=id=>cm.competitions.find(x=>x.id===id);
check(mc('2026-2027-campionato')?.playedMatches===55 && mc('2026-2027-champions-league')?.playedMatches===8 && mc('2026-2027-coppa-italia')?.playedRounds===1,'manifest competizioni aggiornato');

const latest=rm.rosters[0]; check(latest?.id==='2026-2027-2026-11-11'&&latest?.players===296,'rosa primaria verificata 11/11 con 296 giocatori');
const rr=roster.rosters.flatMap(t=>(t.players||[]).map(p=>({team:t.name,...p})));
const own=n=>rr.find(x=>norm(x.playerName)===norm(n));
check(norm(own('Molina N.')?.team)==='olympic salerno fc' && Number(own('Molina N.')?.cost)===42,'Molina a Olympic costo 42');
check(norm(own('Koopmeiners')?.team)==='olympic salerno fc' && Number(own('Koopmeiners')?.cost)===22,'Koopmeiners a Olympic costo 22');
check(norm(own('Hermoso')?.team)==='fc duefratelli2005' && Number(own('Hermoso')?.cost)===9,'Hermoso a DueFratelli costo 9');
check(norm(own('Mandragora')?.team)==='fc duefratelli2005' && Number(own('Mandragora')?.cost)===1,'Mandragora a DueFratelli costo 1');
check(norm(own('Falcone')?.team)==='river plaid' && norm(own('Muric')?.team)==='fc duefratelli2005','Falcone/Muric non importati come secondo scambio');
const torn=own('Tornqvist'),gim=own('Gimenez'),heggem=own('Heggem'),joao=own('Joao Mario');
check(norm(torn?.team)==='as paperopoli'&&Number(torn?.cost)===0&&Number(torn?.loanOriginalCost)===1&&torn?.loanType==='FREE_LOAN','Tornqvist conserva prestito gratuito');
check(gim?.listoneStatusCode==='ASTERISCATO','Gimenez resta asteriscato');
check(norm(heggem?.team)==='olympic salerno fc'&&norm(joao?.team)==='as paperopoli','scambio storico Heggem/Joao preservato');

check(snap.snapshotVersion===42 && sm.snapshots.find(x=>x.seasonId==='2026-2027')?.snapshotVersion===42,'snapshot V42');
check(snap.competitionMatches.filter(m=>m.competitionId==='2026-2027_campionato'&&m.status==='GIOCATA').length===55,'snapshot contiene 55 gare Campionato giocate');
check(snap.competitionMatches.filter(m=>m.competitionId==='2026-2027_champions'&&m.status==='GIOCATA').length===8,'snapshot contiene 8 gare Champions giocate');
check(snap.competitionMatches.filter(m=>m.competitionId==='2026-2027_coppa_italia'&&m.status==='GIOCATA').length===10,'snapshot contiene 10 prestazioni Coppa G1');
const byId=new Map(snap.seasonTeams.map(t=>[t.id,t.name]));
const sr=snap.rosterEntries.map(x=>`${norm(byId.get(x.seasonTeamId))}|${norm(x.playerName)}|${Number(x.cost)}`); const ss=new Set(sr); const pr=rr.map(x=>`${norm(x.team)}|${norm(x.playerName)}|${Number(x.cost)}`);
check(sr.length===296&&pr.length===296&&pr.every(x=>ss.has(x)),'snapshot e rosa primaria coincidono 296/296');

const sept=snap.fmMovements.filter(x=>x.type==='SVINCOLO'&&String(x.description||'').startsWith('SVINCOLI SETTEMBRE 2026:'));
check(sept.length===10&&sept.every(x=>x.date==='2026-09-09'),'correzione svincoli V814 preservata');
check(snap.fmMovements.find(x=>x.id==='syQ6oloV2U2BFHGtzuUO')?.date==='2026-08-20','correzione acquisto Baronissi V814 preservata');
const oldTrade=snap.fmMovements.filter(x=>x.source==='static-trade-october-v816');
check(oldTrade.length===2&&oldTrade.reduce((s,x)=>s+Number(x.amount||0),0)===0,'scambio Heggem/Joao V816 preservato');
const newTrade=snap.fmMovements.filter(x=>x.source==='static-trade-november-v817');
check(newTrade.length===2&&newTrade.every(x=>x.type==='SCAMBIO'&&x.date==='2026-11-11'&&Number(x.amount)===0),'nuovo scambio DueFratelli/Olympic registrato senza conguaglio');
const dueId=snap.seasonTeams.find(t=>norm(t.name)==='fc duefratelli2005')?.id, olyId=snap.seasonTeams.find(t=>norm(t.name)==='olympic salerno fc')?.id;
check(newTrade.some(x=>x.seasonTeamId===dueId&&String(x.playerName).includes('Hermoso'))&&newTrade.some(x=>x.seasonTeamId===olyId&&String(x.playerName).includes('Molina')),'movimenti scambio associati alle due squadre corrette');
check(Number(snap.metrics?.fm?.total)===341&&Number(snap.metrics?.fm?.average)===34.1,'totale FM lega invariato');

console.log(`\nAudit V817: ${ok}/${ok+bad} controlli superati.`); if(bad) process.exit(1);
