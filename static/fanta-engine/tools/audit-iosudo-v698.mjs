import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/manifest.json','utf8'));
const data = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/sudatori-data.json','utf8'));
const index = fs.readFileSync('static/iosudo/index.html','utf8');
function ok(c,m){ if(!c) throw new Error(m); }
ok(manifest.version === 'V698','manifest non V698');
ok(manifest.updatedAtTime && manifest.updatedAtTime.includes('T'),'header data+ora non disponibile');
ok(index.includes('iosudo-app-v698.js?v=698'),'index non punta al JS V698');
ok(index.includes('iosudo-app-v698.css?v=698'),'index non punta al CSS V698');
ok((manifest.players||0) === Object.values(data.playersByTeam||{}).reduce((a,b)=>a+b.length,0),'conteggio giocatori incoerente');
ok((manifest.officialMoves||0) === Object.values(data.officialMovesByTeam||{}).reduce((a,b)=>a+b.length,0),'conteggio ufficialita incoerente');
console.log('Audit ioSudo V698 OK', JSON.stringify({players:manifest.players,talks:manifest.teamTransferTalks,official:manifest.officialMoves,friendlies:manifest.friendlies,sources:manifest.sources,updatedAtTime:manifest.updatedAtTime}));
