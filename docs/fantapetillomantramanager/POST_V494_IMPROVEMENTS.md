# Migliorie consigliate dopo V494

## Priorita' alta

1. **Test su Netlify branch deploy**: verificare entrambi i siti prima del merge su master.
2. **Fix UI Proposte regolamento FantaMantraManager**: il codice V479 e' presente, ma se la sezione non compare va agganciata stabilmente al registry/dashboard.
3. **Audit dinamico browser**: aggiungere Playwright o uno script equivalente per aprire le pagine reali e catturare errori console/404.
4. **Checklist Firebase rules FantaMantraManager**: verificare in console che le rules V479 siano pubblicate prima di usare le proposte regolamento.

## Motore unico

5. **Template nuova lega**: creare uno script/wizard che genera nuova cartella lega da config minima.
6. **Adapter EmailJS comune**: centralizzare wrapper e lasciare solo service/template per lega in config.
7. **Adapter Firebase multi-lega**: standardizzare `leagueId` in tutte le query e preparare in futuro `/leagues/{leagueId}/...`.
8. **Import-map JS**: utile per centralizzare altri moduli con import relativi senza rompere path locali.

## Manutenzione

9. **Pulizia fisica duplicati locali**: solo dopo test reali e richiesta esplicita, perche' oggi le copie locali sono fallback.
10. **Riduzione progressiva copia annidata ZonaOrientale/static**: prima va chiarito se e' ancora usata da deploy o link storici.
11. **Report automatico anti-contaminazione in CI**: eseguire audit a ogni push/PR.
12. **Documentazione operativa breve per nuovo assistente**: una pagina singola con comandi, branch, deploy e guardrail.
