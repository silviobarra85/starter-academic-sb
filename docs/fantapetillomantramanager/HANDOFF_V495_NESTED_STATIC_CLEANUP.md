# Handoff V495 - Cleanup nested static ZonaOrientale

Questa patch riguarda la rimozione della copia annidata storica `static/zonaorientale/static`.
Non modifica il runtime FantaMantraManager, salvo aggiornamento versione/footer/cache-buster a V495 e documentazione.

## Funzionalità FantaMantraManager da preservare

- Brand FantaMantraManager.
- Area Squadra sbloccata.
- Dashboard Presidente nascosta quando entra Admin.
- Card Svincola Giocatori e Comunicato Avvenuto Scambio per presidenti.
- Proposte regolamento preservate nel codice.
- EmailJS dedicato `service_ttjf7js`.

## Ordine operativo

1. Applicare overlay V495.
2. Eseguire `git rm -r static/zonaorientale/static`.
3. Eseguire audit V495.
4. Testare manualmente anche FantaMantraManager per regressioni indirette.
