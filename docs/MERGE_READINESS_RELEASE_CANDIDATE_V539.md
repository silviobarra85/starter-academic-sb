# V539 - Merge readiness / release candidate

## Obiettivo

V539 chiude il ciclo di overlay V521-V538 come release candidate whole-site.

Non introduce nuove funzioni applicative: consolida la baseline, aggiorna runtime/cache-buster a V539 e aggiunge audit finale per verificare che le due leghe restino allineate.

## Stato consolidato

```text
fanta-engine
  motore comune, asset condivisi, adapter multi-season, guardie dashboard/navigation

zonaorientale
  lega storica 2025-2026, dati reali/storici piu pesanti

fantapetillomantramanager
  seconda lega 2026-2027, configurazione separata e asset comuni condivisi

_league-template
  base per creare nuove leghe con wizard V524
```

## Cosa certifica V539

- Overlay whole-site applicabile con un solo giro di comandi.
- Runtime e footer allineati a V539.
- Listoni e Calciomercato restano primari su `static/fanta-engine/data/shared-assets/current/`.
- Fallback locali ancora preservati.
- Nessuna cancellazione automatica.
- Nessuno spostamento fisico dati.
- Adapter multi-season V526 e path resolver V537 preservati.
- Performance guard navigazione V536 preservata.
- Dashboard/Admin/Presidente non sostituiti.
- Firebase ed EmailJS invariati.
- `FUNZIONALITA'.md` non modificato.

## Manifest release candidate

```text
static/fanta-engine/data/release-candidates/release-candidate-v539.json
```

Il manifest dichiara i guardrail della release candidate e la checklist manuale da completare prima di decidere eventuali cleanup successivi.

## Audit

```bash
node static/fanta-engine/tools/audit-merge-readiness-release-candidate-v539.mjs
```

L'audit verifica:

- documentazione e handoff V539 presenti;
- `currentVersion` V539 su entrambe le leghe;
- assenza di residui runtime critici V512/V538;
- `formValidatorsV506: true` ancora presente;
- asset centrali Listoni/Calciomercato allineati ai fallback locali;
- `shared-assets/current` preservato;
- Firebase, EmailJS, Admin, Presidente non dichiarati come modificati.

## Checklist manuale release candidate

1. Aprire ZonaOrientale senza errori console.
2. Aprire FantaPetilloMantraManager senza errori console.
3. Verificare footer V539 su entrambe.
4. Navigare rapidamente Dashboard -> News -> Rose -> Bilanci -> Calciomercato -> Listone -> Sorteggio.
5. Verificare che ZonaOrientale non peggiori rispetto a V536/V538 in fluidita'.
6. Verificare Listone e Calciomercato su entrambe.
7. Verificare login/flussi Admin.
8. Verificare dashboard/flussi Presidente.
9. Controllare Network: entrypoint principali a `?v=539`.
10. Non rimuovere fallback locali prima di approvazione esplicita.

## Decisione dopo V539

Se la release candidate passa i test manuali, la roadmap principale puo considerarsi chiusa.

Eventuale cleanup dei fallback locali duplicati Listoni/Calciomercato deve essere un overlay separato, esplicitamente approvato, e non automatico.
