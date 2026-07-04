# V541 - Performance consolidation e inventario runtime

## Scopo

V541 e' un overlay di consolidamento, non una nuova funzionalita'.
Serve a congelare la baseline post V540 e a misurare dove il progetto e' piu' pesante, soprattutto la differenza tra ZonaOrientale e FantaPetilloMantraManager.

## Decisione tecnica

La navigazione non viene ulteriormente modificata. Restano attivi i moduli gia' presenti:

- V535 `navigation-fluidity-v535.js`;
- V536 `navigation-performance-guard-v536.js`;
- V537 `season-path-resolver-v537.js`;
- V540 `rules-table-isolation-v540.css`.

V541 aggiunge solo audit/documentazione e riallinea cache-buster/footer a V541.

## Perche' non aggiungere altre guardie ora

La lentezza percepita su ZonaOrientale dipende anche dal peso dei dati reali/storici. FantaPetilloMantraManager e' piu' fluido perche' ha meno snapshot, rose e competizioni reali.
Prima di aggiungere altri moduli e' meglio misurare e consolidare.

## Audit

Eseguire dalla root della repo:

```bash
node static/fanta-engine/tools/audit-performance-consolidation-v541.mjs
```

L'audit controlla:

- cache-buster V541 su entrambe le leghe;
- `currentVersion` V541 nei config JSON;
- fallback JS `league-config-v443.js` allineato a V541;
- presenza di docs e handoff;
- preservazione di `shared-assets/current`;
- preservazione dell'isolamento tabelle Regolamento V540;
- inventario dimensionale di snapshot, rose, competizioni e fallback asset.

## Guardrail preservati

- Nessuna modifica Firebase.
- Nessuna modifica EmailJS.
- Nessuna cancellazione fallback Listoni/Calciomercato.
- Nessuna migrazione fisica dati.
- Nessuna sostituzione dei renderer locali.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Prossimo passo consigliato

V542 dovrebbe essere una pulizia sicura della repo:

- rimuovere `.DS_Store`;
- rimuovere eventuali `__MACOSX/`;
- rimuovere `scripts/init_kickstart.sh` se ancora presente;
- non toccare ancora i fallback locali Listoni/Calciomercato.
