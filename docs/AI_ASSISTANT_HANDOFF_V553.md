# AI Assistant Handoff - V553

## Overlay

**V553 - Cache applicativa e render tabelle pesanti**

## Contesto

ZonaOrientale risulta piu' lenta di FantaPetilloMantraManager perche' contiene molti piu' dati reali/storici. V552 ha aggiunto profiler/lazy render guard; V553 prosegue con cache di sessione e ottimizzazione tabelle grandi.

## Modifiche principali

- Nuovo modulo:
  - `static/fanta-engine/js/ui/application-cache-chunked-tables-v553.js`
- Nuovo audit:
  - `static/fanta-engine/tools/audit-application-cache-chunked-tables-v553.mjs`
- Runtime/cache-buster/footer/config a V553.
- Docs e handoff aggiornati.

## Cosa non e' stato toccato

- Firebase.
- EmailJS.
- Admin.
- Presidente.
- Netlify.
- Dati statici.
- Fallback locali Listoni/Calciomercato, gia' rimossi dal workflow.
- `docs/zonaorientale/FUNZIONALITA'.md`.

## Rischi e controlli

Il modulo e' additive-only. Usa `sessionStorage` per JSON statici e `content-visibility` per tabelle grandi. Non modifica i dati e non cambia il router.

Controllare manualmente:

- Rose espanse.
- Listone.
- Bilanci.
- Calciomercato.
- Regolamento senza righe colorate.

## Overlay successivo consigliato

Resta **V554 - Modalita produzione diagnostici con `?debug=1`**, se la navigazione resta corretta dopo V553.
