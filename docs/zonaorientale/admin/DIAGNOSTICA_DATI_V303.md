# V303 - Diagnostica dati Admin estesa

## Scopo

V303 estende il pannello `Admin -> Diagnostica dati` con controlli di qualita non distruttivi su Listoni, Rose, Competizioni e News.

## Funzionalita a rischio e preservazione

Funzionalita da preservare:

- Listone pubblico e Admin, inclusi colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV solo Admin.
- Rose pubbliche, pagina squadra e Dashboard Presidente.
- Admin -> Richieste presidenti, Diagnostica dati e Converti listone Excel.
- Mobile navigation, menu Altro, pulsante Su e Dark mode unico.
- Firebase/Auth/EmailJS.

Preservazione adottata:

- Nessuna scrittura Firebase.
- Nessuna modifica ai JSON statici.
- Nessuna funzione storica rimossa da `assets/app.js`.
- La diagnostica V276 resta il pannello canonico; V303 aggiunge righe extra tramite override controllato.

## Controlli aggiunti

- `Listoni - qualita dati`: duplicati, ruoli mancanti, quotazioni mancanti, squadre non canoniche.
- `Rose - qualita dati`: snapshot, rose vuote, giocatori senza nome.
- `Competizioni - completezza`: competizioni senza nome/tipo e calendari senza id.
- `News - completezza`: comunicati senza titolo, testo o topic/tipo.

## Diagnostica runtime

```js
window.ZonaOrientaleAdminDiagnosticsV303
window.ZonaOrientaleAdminDiagnosticsV303.getRows()
window.ZonaOrientaleAdminDiagnosticsV303.getExtraRows()
window.ZonaOrientaleAdminDiagnosticsV303.refresh()
```

## Test consigliati

1. Login Admin.
2. Aprire `Admin -> Diagnostica dati`.
3. Verificare che il pannello mostri anche le righe qualità V303.
4. Premere `Aggiorna diagnostica`.
5. Controllare Listone pubblico/Admin, Rose e Dashboard Presidente per assenza regressioni.
