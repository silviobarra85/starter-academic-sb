# V482 - Audit anti-contaminazione multi-lega

## Obiettivo

Introdurre un controllo automatico stabile per evitare contaminazioni tra ZonaOrientale e FantaMantraManager mentre si procede verso il motore unico.

## File principale

```text
static/fanta-engine/tools/audit-multileague-contamination-v482.mjs
```

## Cosa controlla

- presenza delle cartelle `zonaorientale`, `fantapetillomantramanager` e `fanta-engine`;
- `leagueId`, nome pubblico e `currentVersion` nei file `assets/league-config.json`;
- footer V482 corretti nelle pagine principali;
- assenza di riferimenti ZonaOrientale nell'HTML pubblico FantaMantraManager;
- assenza di riferimenti FantaMantra/FantaPetillo nell'HTML pubblico ZonaOrientale;
- EmailJS separato: ZonaOrientale resta su `service_trz4dxe`, FantaMantraManager usa `service_ttjf7js`;
- regolamento FantaMantraManager 2026-2027 preservato;
- news FantaMantraManager non agganciate all'ID news storico ZonaOrientale;
- funzioni V478/V479 preservate nel codice FantaMantraManager.

## Nota sui dati legacy

L'audit V482 controlla soprattutto superfici pubbliche, runtime e configurazioni attive. Non fallisce sui listoni legacy FantaMantraManager che possono ancora avere nomi file sorgente storici ZonaOrientale: quelli saranno trattati in una futura pulizia dati, senza cancellazioni automatiche.

## Esecuzione

Da dentro `static`:

```bash
node fanta-engine/tools/audit-multileague-contamination-v482.mjs
```

Esito verificato: `43 OK, 0 FAIL`.
