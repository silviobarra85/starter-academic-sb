# Matrice audit Calciomercato player diagnostics V359

| Area | Stato | Note |
| --- | --- | --- |
| Modulo V359 | Attivo | Importato da `assets/app.js` con cache-buster V359 |
| Modulo V340 | Conservato | Storico, non rimosso in V359 |
| Tag giocatore | Preservato | Wrapper `renderCalciomercatoPlayerTagsV335` mantenuto |
| Timeline modal | Preservata | Modal V336 invariata |
| Falso positivo `giovane` | Preservato | Alias singolo richiede token con iniziale maiuscola |
| Alias configurati | Aggiunti | Lettura conservativa da campi alias/nickname/shortName se presenti |
| Nomi compatti | Aggiunti | Gestisce casi tipo `N'Doye`/`Ndoye` |
| Diagnostica QA | Aggiunta | Check `calciomercato-player-diagnostics` nella checklist Admin |
| Firebase | Non toccato | Nessuna scrittura |
| Netlify | Non toccato | Nessuna modifica Functions |
| Archivi JSON | Non toccati | Nessuna modifica dati |
