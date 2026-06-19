# Handoff V478 - EmailJS dedicato e riattivazione card presidente

## Stato prima della V478

- In V477 erano state nascoste le card `Svincola Giocatori` e `Comunicato avvenuto scambio` perche non era ancora pronto un servizio EmailJS dedicato a FantaMantraManager.
- La Dashboard Presidente era stata nascosta quando la sessione corrente e Admin.
- Area Squadra era gia visibile da V476.

## Richiesta utente

Riattivare le card presidente dopo la creazione del servizio EmailJS FantaMantraManager, mantenendo separati i flussi da ZonaOrientale.

Dati ricevuti:

- Service ID: `service_ttjf7js`;
- Template `Comunicato Avvenuto Scambio`: `template_svkkhlr`;
- Template svincolo: non necessario come template dedicato perche il sito compone gia la mail;
- destinatario operativo: `barra.silvio@gmail.com`;
- Public Key: gia presente nel sito/documentazione.

## Cosa fa la V478

- aggiorna `assets/emailjs.js` con il service dedicato e supporto a template diversi per flusso;
- mantiene `template_e1o7z5e` come template generico per `Svincola Giocatori`;
- usa `template_svkkhlr` per `Comunicato avvenuto scambio`;
- sostituisce ogni vecchio destinatario operativo FantaMantraManager con `barra.silvio@gmail.com`;
- riattiva le due card operative presidente;
- mantiene la Dashboard Presidente non renderizzata quando il login corrente e Admin;
- aggiorna cache-buster e footer fallback a V478;
- aggiorna docs e audit.

## File modificati dall'overlay

- `fantapetillomantramanager/assets/app.js`
- `fantapetillomantramanager/assets/emailjs.js`
- `fantapetillomantramanager/assets/league-config.json`
- `fantapetillomantramanager/index.html`
- `fantapetillomantramanager/competition.html`
- `fantapetillomantramanager/player.html`
- `fantapetillomantramanager/news.html`
- `fantapetillomantramanager/bilanci.html`
- `fantapetillomantramanager/tools/audit-emailjs-president-tools-v478.mjs`
- `docs/fantapetillomantramanager/README.md`
- `docs/fantapetillomantramanager/EMAILJS_PRESIDENT_TOOLS_V478.md`
- `docs/fantapetillomantramanager/HANDOFF_V478_EMAILJS_PRESIDENT_TOOLS.md`

## Funzionalita da non perdere nelle prossime patch

- Non toccare ZonaOrientale quando si lavora su FantaMantraManager, salvo richiesta esplicita.
- Non rinominare la cartella `fantapetillomantramanager`: il nome pubblico e FantaMantraManager, ma slug/URL restano invariati.
- Conservare `Area Squadra` visibile come da V476.
- Conservare Dashboard Presidente nascosta per login Admin come da V477.
- Conservare le card `Svincola Giocatori` e `Comunicato avvenuto scambio` attive dopo V478.
- Conservare il destinatario FantaMantraManager `barra.silvio@gmail.com`.
