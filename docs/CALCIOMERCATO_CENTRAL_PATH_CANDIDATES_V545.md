# V545 - Calciomercato central path candidates

## Obiettivo

Correggere la regressione post-cleanup V543/V544 in cui la pagina Calciomercato poteva mostrare ancora il messaggio "Calciomercato non configurato" dopo la rimozione dei fallback locali.

## Causa

Dopo la rimozione delle copie locali, il frontend deve leggere esclusivamente da:

```text
static/fanta-engine/data/shared-assets/current/assets/calciomercato/
```

V544 ha aggiornato il path principale, ma non era abbastanza robusto nei diversi contesti di pubblicazione/sviluppo locale. In particolare, se il sito viene aperto da una root diversa, un singolo path relativo o assoluto puo fallire anche se gli asset centrali esistono.

## Modifica V545

V545 aggiunge un resolver di candidati nel frontend:

```text
getFantaEngineSharedAssetUrlCandidatesV545
getCalciomercatoSharedAssetUrlsV545
```

Il loader prova piu candidati compatibili con:

- deploy Hugo/Netlify;
- sviluppo locale servito dalla root della repo;
- sviluppo locale servito dalla cartella parent della repo;
- path assoluto `/fanta-engine/...`.

La funzione Netlify resta aggiornata sul path centrale.

## Guardrail

- Non ripristina fallback locali.
- Non modifica Firebase.
- Non modifica EmailJS.
- Non modifica Admin o Presidente.
- Non modifica `FUNZIONALITA'.md`.
- Listoni e Calciomercato restano asset comuni in `fanta-engine`.

## Verifica

```bash
node static/fanta-engine/tools/audit-calciomercato-central-path-candidates-v545.mjs
```

Esito atteso:

```text
Audit V545 superato: Calciomercato usa candidati path centrali robusti, fallback locali non richiesti e runtime whole-site a ?v=545.
```
