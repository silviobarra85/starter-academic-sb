# AI Assistant Handoff V501 - Motore comune e prossimi step

Questo documento serve al prossimo assistente AI che lavorera sul progetto multi-lega.

## Stato attuale

Le leghe attive sono:

- `static/zonaorientale` - ZonaOrientale Salerno;
- `static/fantapetillomantramanager` - FantaMantraManager;
- `static/fanta-engine` - motore comune progressivamente centralizzato.

La cartella `static/zonaorientale/static` e stata dismessa in V495. Se ricompare, e un errore. In V501 e stata rilevata anche una possibile cartella accidentale `static/static`: anche questa non deve esistere.

## Cosa e stato centralizzato fino a V501

- V480: registry sezioni comune;
- V481: presentation engine comune;
- V485: asset listoni/calciomercato comuni con fallback locali;
- V487: CSS comuni con fallback locali;
- V491: moduli JS comuni sicuri;
- V496: UI components engine;
- V497: registry card/funzionalita;
- V498: EmailJS adapter comune;
- V499: Firebase adapter comune senza migrazione dati;
- V500: dashboard cards engine in observe-first;
- V501: tool engine comune, partendo dal Sorteggio giornate.

## V501 in dettaglio

Il nuovo file centrale e:

```text
static/fanta-engine/js/tools/matchday-draw-engine-v501.js
```

Il wrapper locale resta in entrambe le leghe:

```text
assets/js/sections/matchday-draw-tool-v473.js
```

Il wrapper carica il motore comune con dynamic import e mantiene fallback locale V473. Non ci sono scritture Firebase, non ci sono service EmailJS e non ci sono dati specifici nel motore comune.

## Guardrail obbligatori

- Non cancellare fallback locali senza richiesta esplicita.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` se non richiesto.
- Non rinominare lo slug `fantapetillomantramanager`.
- Non reintrodurre `static/zonaorientale/static`.
- Non reintrodurre `static/static`.
- Preservare Dashboard Presidente, Svincola, Comunicato avvenuto scambio e Proposte regolamento in FantaMantraManager.
- Preservare EmailJS separati: Zona `service_trz4dxe`, FMM `service_ttjf7js`.
- Preservare Firebase separati e non migrare ancora a `/leagues/{leagueId}/...`.

## Roadmap proposta dopo V501

- V502: template nuova lega e script di generazione.
- V503: test browser Playwright per errori console e 404 reali.
- V504: dashboard engine enforce opzionale, solo dopo test reali.
- V505: migrazione graduale renderer dashboard comuni.
- Futuro: Firebase multi-tenant `/leagues/{leagueId}/...` solo dopo backup, rules dedicate e test browser.
