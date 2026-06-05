# Refactor V346 - Audit candidati legacy minori

## Tipo intervento

Audit-only. Nessuna cancellazione e nessun cambio comportamento.

## File aggiunti

- `static/zonaorientale/tools/audit-minor-legacy-v346.mjs`
- `docs/zonaorientale/audit/MINOR_LEGACY_CANDIDATES_V346.md`
- `docs/zonaorientale/FUNZIONALITAV346.md`
- `docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V346.md`
- `docs/zonaorientale/release/RELEASE_V346_MINOR_LEGACY_AUDIT.md`

## Runtime marker

`window.ZonaOrientaleMinorLegacyAuditV346`

## Perche non rimuove file

Dopo V343-V345 restano candidati minori con rischio non nullo: simulatori trade, workflow Admin storico, hotfix mobile e modulo competizioni. Sono candidati plausibili, ma non abbastanza sicuri per una rimozione cumulativa.

## Prossima V consigliata

V347: rimozione controllata del solo duplicato `assets/js/trade-notification-simulator-v255.js`, lasciando attivo `assets/js/dev/trade-notification-simulator-v255.js`, solo se l'audit conferma assenza di import/link runtime.
