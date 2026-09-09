import fs from 'node:fs';
const appPath = 'static/zonaorientale/assets/app.js';
const app = fs.readFileSync(appPath,'utf8');
let ok=0, total=0;
function check(cond,msg){ total++; if(cond){ok++; console.log('OK - '+msg);} else {console.error('FAIL - '+msg);} }
const start=app.indexOf('setupAuth = function setupAuthV760()');
const end=app.indexOf('state.authRuntimePromiseV760 = ensureFirebaseRuntimeV760()', start);
const block=start>=0 && end>start ? app.slice(start,end) : '';
check(start>=0,'setupAuthV760 presente');
check(block.includes('forgotPasswordBtn'),'setupAuthV760 collega Password dimenticata');
check(block.includes('sendPasswordResetEmail(auth, email)'),'setupAuthV760 invia reset Firebase');
check(block.indexOf('ensureFirebaseRuntimeV760()') < block.indexOf('sendPasswordResetEmail(auth, email)'),'runtime Firebase inizializzato prima del reset');
check(block.includes("if (!email)"),'email obbligatoria prima del reset');
check(block.includes('auth/invalid-email'),'gestione email non valida');
check(block.includes('auth/too-many-requests'),'gestione troppe richieste');
check(app.includes('let sendPasswordResetEmail = null;'),'binding Firebase reset presente');
check(app.includes('sendPasswordResetEmail = api.sendPasswordResetEmail;'),'API reset caricata dal runtime');
console.log(`Audit password reset hotfix V806: ${ok}/${total}`);
if(ok!==total) process.exit(1);
