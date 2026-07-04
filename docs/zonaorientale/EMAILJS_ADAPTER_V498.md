# EmailJS adapter comune V498 - ZonaOrientale

## Scopo

La V498 centralizza il meccanismo EmailJS nel motore comune `static/fanta-engine/js/email/emailjs-adapter-v498.js`, mantenendo separati i valori specifici di ciascuna lega.

## Cosa cambia

- `assets/emailjs.js` importa `createEmailJsSenderV498` dal motore comune.
- Le API pubbliche `isEmailJsConfigured()` e `sendTransferEmail()` restano invariate.
- Il runtime esistente continua a importare `./emailjs.js`.
- Fallback `mailto:` disponibile tramite `buildEmailJsMailtoFallback()`.

## Guardrail

- Non spostare service ID/template/destinatari dentro il motore comune.
- Non usare il service FantaMantraManager in ZonaOrientale.
- Non usare il service ZonaOrientale in FantaMantraManager.
- Non modificare Firebase/rules con questa patch.

## Verifica

Eseguire da `static`:

```bash
node fanta-engine/tools/audit-emailjs-adapter-v498.mjs
node fanta-engine/tools/audit-runtime-regression-v498.mjs
node fanta-engine/tools/audit-multileague-contamination-v498.mjs
```
