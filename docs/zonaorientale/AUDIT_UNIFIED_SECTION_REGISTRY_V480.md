# Audit V480 - Registro sezioni unificato

## Obiettivo

Verificare che il primo modulo condiviso `fanta-engine` sia disponibile e che i registry di ZonaOrientale e FantaMantraManager siano compatibili con il runtime esistente.

## Comando

```bash
cd static
node fanta-engine/tools/audit-unified-section-registry-v480.mjs
```

## Controlli principali

- Motore comune `static/fanta-engine/js/core/unified-section-registry-v480.js` presente.
- Factory `createUnifiedSectionRegistryV480` presente.
- Helper `listNavItems` e `listDashboardCards` presenti.
- Wrapper registry presenti in entrambe le leghe.
- `assets/app.js` preferisce `FantaLeagueSectionRegistryV480`.
- Cache-buster `section-registry-v405.js` e `assets/app.js` allineati a V480.
- `league-config.json` con `currentVersion: 480`.
- FantaMantraManager registra `ruleproposals`.
- ZonaOrientale non registra `ruleproposals`.

## Esito verificato

```text
34 OK, 0 FAIL
```
