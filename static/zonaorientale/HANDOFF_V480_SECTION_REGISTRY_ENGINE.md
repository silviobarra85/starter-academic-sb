# Handoff V480 - Registro sezioni unificato e fanta-engine

## Contesto

L'utente sta lavorando su un branch dedicato per evolvere i due siti verso un motore unico. La V480 e' il primo passo strutturale: un registry sezioni comune, senza refactor invasivo.

## Scope

La modifica coinvolge entrambe le leghe, ma non rimuove funzioni e non cambia Firebase, dati, snapshot o flussi Admin/Presidente.

File chiave ZonaOrientale:

```text
static/zonaorientale/assets/js/core/section-registry-v405.js
static/zonaorientale/assets/app.js
static/zonaorientale/assets/league-config.json
static/zonaorientale/index.html
```

File comuni:

```text
static/fanta-engine/js/core/unified-section-registry-v480.js
static/fanta-engine/tools/audit-unified-section-registry-v480.mjs
```

## Guardrail

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita dell'utente.
- Non cancellare funzionalita' esistenti.
- Non importare in ZonaOrientale sezioni specifiche FantaMantraManager come `Proposte regolamento`.
- Mantenere il badge dispositivo V434.
- Mantenere separati footer, news, regolamenti, EmailJS e Firebase.

## Prossimi step consigliati

- V481: estrarre nel motore comune il bootstrap navigazione/footer/branding in modo incrementale.
- V482: audit anti-contaminazione multi-lega.
- V483: docs consolidate FantaMantraManager.

## Audit

```bash
cd static
node fanta-engine/tools/audit-unified-section-registry-v480.mjs
```

Esito verificato: `34 OK, 0 FAIL`.
