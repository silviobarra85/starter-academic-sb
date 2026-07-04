# AI Assistant handoff V560

## Versione

V560 - Boot preloader interactive-ready.

## Motivo della patch

La V559 poteva far sparire la rotellina quando l'interfaccia non era ancora realmente cliccabile. La V560 tara la chiusura del preloader su un segnale piu' tardivo: render app completato, `window.load`, controlli DOM essenziali presenti e quiet frame del main thread.

## File modificati

- `static/fanta-engine/css/boot-preloader-v560.css`
- `static/fanta-engine/js/ui/boot-preloader-v560.js`
- `static/fanta-engine/tools/audit-boot-preloader-v560.mjs`
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/index.html`
- `static/fantapetillomantramanager/assets/app.js`
- `docs/BOOT_PRELOADER_V560.md`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`
- `docs/AI_ASSISTANT_HANDOFF_V560.md`
- `docs/OVERLAY_ROADMAP.md`
- `docs/zonaorientale/00_STATO_CORRENTE_E_INDICE.md`
- `docs/fantapetillomantramanager/00_STATO_CORRENTE_E_INDICE.md`

## Runtime

Il preloader V560 e' solo visuale. Non sostituisce router, non carica dati, non scrive Firebase, non usa EmailJS e non reintroduce i layer rimossi in V558. Il nuovo evento di riferimento e' `fanta:app-rendered-v560`.

## Regressioni da evitare

- Non reintrodurre chiusura su solo `window.load`.
- Non far ruotare il numero percentuale: deve ruotare solo l'anello CSS.
- Non bloccare indefinitamente l'utente: restano timeout di sicurezza.
- Non toccare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.

## Audit

```bash
node static/fanta-engine/tools/audit-boot-preloader-v560.mjs
```

## Checklist manuale

- ZonaOrientale da cache pulita: overlay presente, percentuale ferma, anello in rotazione.
- Al termine, clic immediato su Dashboard/Competizioni/Listone/Admin.
- FantaMantraManager con stesso controllo.
- Controllo mobile su menu Altro e bottom navigation.
