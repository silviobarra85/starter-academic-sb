# V494 - Pulizia duplicati locali: readiness senza cancellazioni

La V494 chiude la fase V480-V494 aggiungendo un piano controllato per le copie locali duplicate create dalle centralizzazioni V485-V491.

## Decisione conservativa

In questa patch **non viene cancellato nessun file locale**.

Motivi:

- gli overlay vengono applicati con `cp -R`, quindi non sono lo strumento corretto per rimuovere file;
- le copie locali sono ancora utili come fallback e rollback;
- la rimozione fisica richiede test reali post-merge e richiesta esplicita;
- la priorita' resta non perdere funzionalita'.

## File tracciati

Il manifest `static/fanta-engine/data/local-duplicate-cleanup-plan-v494.json` traccia 79 file centralizzati come candidati alla futura pulizia:

- 42 asset dati listone/calciomercato centralizzati in V485;
- 22 CSS comuni centralizzati in V487;
- 3 JS classici centralizzati in V489;
- 12 moduli JS selettivi centralizzati in V491.

## Audit

Nuovo audit:

```bash
cd static
node fanta-engine/tools/audit-local-duplicate-cleanup-readiness-v494.mjs
```

L'audit verifica:

- manifest V494 presente;
- central files presenti e con hash stabile;
- fallback locali principali presenti in ZonaOrientale e FantaMantraManager;
- config aggiornate a V494;
- guardrail `noPhysicalDeletionInV494` attivo;
- footer/cache-buster V494.

## Quando si potra' cancellare davvero

La cancellazione fisica va rimandata a una patch futura e va fatta solo dopo:

1. test manuale su branch deploy Netlify;
2. audit V494 senza fail;
3. verifica Listone, Player, Calciomercato, Admin e Dashboard su ZonaOrientale e FantaMantraManager;
4. branch/tag di backup;
5. richiesta esplicita dell'utente ad usare comandi `rm`.
