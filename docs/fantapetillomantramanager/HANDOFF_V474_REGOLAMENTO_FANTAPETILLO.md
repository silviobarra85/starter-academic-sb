# Handoff V474 - Regolamento FantaPetilloMantraManager

## Contesto

L'utente ha caricato il nuovo regolamento 2026-2027 di `FantaPetilloMantraManager`. Ha specificato che non ha nulla a che fare con ZonaOrientale e ha chiesto di aggiornare solo il link download e la pagina regolamento del clone FantaPetillo.

## Vincoli da rispettare

- Non modificare ZonaOrientale.
- Non cancellare funzionalita'.
- Consegnare un overlay con solo i file effettivamente cambiati.
- Aggiornare anche i docs FantaPetillo e includere handoff.
- Il PDF vecchio non va cancellato: il nuovo link deve puntare a un file versionato V474.

## Cosa e' stato fatto

1. Copiato il PDF caricato come:

```text
static/fantapetillomantramanager/assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027-v474.pdf
```

2. Aggiornata la pagina `#regolamento` in:

```text
static/fantapetillomantramanager/assets/js/sections/regolamento-section-v402.js
```

con link `Scarica PDF`, `Apri PDF` e appendice verso il nuovo PDF V474.

3. Aggiornata la sintesi regolamento per evitare incongruenze con il nuovo PDF, soprattutto nei premi in crediti:

- Premio Partecipazione 40 FM;
- Playoff 6 FM;
- Coppa Italia 8 FM;
- Champions League 9 FM;
- Qualificazione Champions League 3 FM.

4. Aggiornata la configurazione:

```text
static/fantapetillomantramanager/assets/league-config.json
```

con `currentVersion: 474`, `regolamento.version: 474` e link al PDF V474.

5. Aggiornati cache-buster e footer fallback solo degli HTML FantaPetillo, per coerenza V474.

6. Aggiunto audit dedicato:

```text
static/fantapetillomantramanager/tools/audit-regolamento-v474.mjs
```

## Verifica effettuata

Comando eseguito nella cartella del clone:

```bash
node tools/audit-regolamento-v474.mjs
```

Esito: audit superato, 20 controlli OK.

## Note per il prossimo assistente

Il check generale `tools/check-fantapetillomantramanager.sh` contiene audit legacy/cross-lega ancora non allineati e non va usato come fonte unica per questa patch V474. Per questa modifica usare l'audit dedicato `audit-regolamento-v474.mjs`.
