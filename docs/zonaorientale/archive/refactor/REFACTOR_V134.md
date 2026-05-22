# V134 - Admin utenti e comunicati

Data: 2026-05-20
Branch consigliato: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Rendere esplicito il comportamento richiesto in Admin:

- un utente rifiutato viene eliminato definitivamente da `pendingUsers/{uid}`;
- un utente approvato resta in `pendingUsers` con `status: APPROVED` e resta visibile nella lista utenti approvati, insieme al record operativo in `teamUsers`;
- i comunicati Admin mostrano tutta la raccolta `news`, non solo gli ultimi 40;
- l'eliminazione di un comunicato cancella definitivamente il documento da `news/{id}` in Firebase.

## File modificati

- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/zonaorientale/assets/js/admin/admin-users.js`

## Note tecniche

- La cancellazione utenti usa `deleteDoc(doc(db, "pendingUsers", uid))`.
- L'approvazione continua a scrivere/aggiornare `teamUsers/{uid}` e a mantenere `pendingUsers/{uid}` con `status: APPROVED`.
- Il pannello comunicati non applica piu il limite UI degli ultimi 40 record.
- La cancellazione comunicati usa `deleteDoc(doc(db, "news", newsId))`.

## Test consigliati

- Admin -> Utenti e comunicazioni -> Accetta utenti
- Approva un utente di test e verifica che resti in Accessi approvati
- Rifiuta un utente di test e verifica che sparisca da `pendingUsers` in Firebase
- Admin -> Utenti e comunicazioni -> Comunicati
- Verifica che siano presenti tutti i comunicati
- Cancella un comunicato di test e verifica che sparisca da `news` in Firebase
