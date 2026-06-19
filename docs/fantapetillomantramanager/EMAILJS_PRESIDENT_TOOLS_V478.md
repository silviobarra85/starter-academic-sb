# V478 - EmailJS dedicato e card operative presidente

Data: 19/06/2026  
Scope: solo `static/fantapetillomantramanager`.

## Obiettivo

Riattivare per FantaMantraManager le card operative presidente:

- `Svincola Giocatori`;
- `Comunicato avvenuto scambio`.

La riattivazione avviene perche e stato creato il servizio EmailJS dedicato della lega FantaMantraManager, separato da ZonaOrientale.

## Configurazione EmailJS

Valori applicati nel sito:

- Public Key: gia presente in `assets/emailjs.js` (`Rl3BRmJx1IeJEqQAH`);
- Service ID FantaMantraManager: `service_ttjf7js`;
- Template generico per `Svincola Giocatori`: `template_e1o7z5e`;
- Template specifico per `Comunicato avvenuto scambio`: `template_svkkhlr`;
- Destinatario operativo: `barra.silvio@gmail.com`.

Nota: per `Svincola Giocatori` non viene introdotto un template dedicato, perche il sito compone gia oggetto, corpo email, elenco giocatori e quotazioni. Il template generico continua solo a trasportare i campi EmailJS.

## File runtime modificati

- `assets/emailjs.js`
  - aggiorna `EMAILJS_SERVICE_ID` a `service_ttjf7js`;
  - aggiunge `EMAILJS_TRANSFER_TEMPLATE_ID = template_svkkhlr`;
  - aggiunge `EMAILJS_DEFAULT_RECIPIENT = barra.silvio@gmail.com`;
  - permette override tecnico di service/template tramite parametri interni `__service_id` e `__template_id`.

- `assets/app.js`
  - riattiva i pannelli rimossi in V477;
  - conserva la regola che nasconde la Dashboard Presidente se `state.isAdmin === true`;
  - invia `Comunicato avvenuto scambio` con template `template_svkkhlr`;
  - invia `Svincola Giocatori` con template `template_e1o7z5e`;
  - sostituisce il vecchio destinatario operativo con `barra.silvio@gmail.com`.

- `assets/league-config.json`
  - aggiorna `currentVersion` a `478`;
  - registra service/template/destinatario dedicati;
  - sposta le due card da strumenti disabilitati a strumenti abilitati.

- HTML entrypoint
  - cache-buster aggiornati a `v=478`;
  - footer fallback aggiornato a `V478` dove presente.

## Guardrail preservati

- Nessun file ZonaOrientale viene modificato.
- Nessun flusso Admin/Firebase/teamUsers viene rimosso.
- La Dashboard Presidente resta non visibile quando il login e Admin.
- La cartella e lo slug restano `fantapetillomantramanager` per non rompere URL, redirect e dati.

## Audit

Comando:

```bash
cd static/fantapetillomantramanager
node tools/audit-emailjs-president-tools-v478.mjs
```

Esito verificato sull'overlay: `15 OK, 0 FAIL`.
