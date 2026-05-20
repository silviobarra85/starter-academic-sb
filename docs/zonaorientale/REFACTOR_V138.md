# V138 - Fix definitivo Admin Accetta utenti

Data: 2026-05-20
Branch consigliato: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Correggere il comportamento di `Admin -> Accetta utenti`:

- una richiesta rifiutata deve essere eliminata da `pendingUsers/{uid}`;
- dopo il rifiuto non deve piu comparire nella lista;
- sotto le richieste in attesa deve comparire sempre la lista degli accessi approvati;
- deve essere visibile il conteggio dei presidenti gia accettati/registrati.

## Modifiche

File modificati:

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
static/zonaorientale/assets/js/admin/admin-users.js
static/zonaorientale/assets/css/admin-v130.css
```

## Dettagli tecnici

- Il rendering originale di `renderPendingUsersAdminPanelV34` e stato reso robusto anche se viene usato prima degli override successivi.
- Le richieste con stati di rifiuto (`REJECTED`, `RIFIUTATA`, `RIFIUTATO`, `DECLINED`, `REFUSED`) non vengono piu mostrate tra le richieste in attesa.
- L'eliminazione usa `deleteDoc(doc(db, "pendingUsers", uid))`.
- Dopo il delete la richiesta viene rimossa subito anche da `state.raw.pendingUsers` e l'Admin viene ridisegnato, cosi la riga sparisce immediatamente.
- Il pannello mostra `Accessi approvati` e il relativo conteggio.
- Cache busting aggiornato a `v=138`.

## Test consigliati

1. Aprire `Admin -> Utenti e comunicazioni -> Accetta utenti`.
2. Rifiutare una richiesta di test.
3. Verificare che sparisca subito dalla UI.
4. Verificare in Firebase che `pendingUsers/{uid}` sia eliminato.
5. Approvare una richiesta di test.
6. Verificare che compaia sotto `Accessi approvati`.
