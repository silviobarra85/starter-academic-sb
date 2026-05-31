# V285 - Fix mirati mobile

## Scopo

V285 applica correzioni CSS conservative alla UI mobile, con focus su tema Light, tabelle scrollabili e controlli secondari.

La release non modifica dati, Firebase, EmailJS, formati JSON o logiche runtime. Le modifiche sono concentrate in `assets/styles.css`, con diagnostica runtime in `window.ZonaOrientaleMobileFixesV285`.

## Interventi applicati

- Rafforzato il contrasto dei testi secondari in tema Light mobile.
- Resi piu' solidi pannelli, card e blocchi che in Light potevano risultare troppo trasparenti.
- Migliorata la leggibilita' delle tabelle mobile con bordi, ombre interne e indicazione `Scorri`.
- Rafforzata la prima colonna sticky delle tabelle, inclusi link e testi secondari.
- Migliorati bottoni secondari, pill, chip, badge e campi focus in Light.
- Migliorata la leggibilita' della bottom navigation e del menu mobile in Light.

## Aree da testare

```text
Tema Light attivo
Home
Listone
Competizioni
Archivio
Statistiche
Confronta
Dashboard Presidente
Admin -> Diagnostica dati
Admin -> Richieste presidenti
```

## Viewport consigliati

```text
390x844  - smartphone stretto
430x932  - smartphone grande
768x1024 - tablet verticale
```

## Controlli specifici Listone

- `Storico listoni` non deve essere visibile, come da V280.
- `Modifiche` deve restare disponibile.
- `Mostra usciti storici` deve restare disponibile.
- `Esporta modifiche CSV` deve restare disponibile.
- La tabella deve rimanere scrollabile orizzontalmente.
- La prima colonna sticky deve essere leggibile in Light.

## Controlli specifici Competizioni

- Classifiche e calendari devono rimanere scrollabili.
- Le intestazioni sticky devono restare leggibili.
- Le celle non devono confondersi con lo sfondo.

## Controlli Admin/Presidente

- Dashboard Presidente leggibile in Light.
- Trattative e card operative leggibili.
- Admin -> Diagnostica dati leggibile.
- Admin -> Richieste presidenti leggibile.

## Diagnostica runtime

```js
window.ZonaOrientaleMobileFixesV285
```

Valori attesi:

```text
version: "V285"
cssOnly: true
preservesRuntime: true
```

## Note operative

- Non rimuovere le patch V281: V285 le rafforza, non le sostituisce.
- Non cancellare logiche Listone V269-V278: la UI Storico listoni resta nascosta, ma le logiche servono ancora a colonna `Modifica`, filtro `Modifiche`, usciti storici ed export CSV.
- Se emergono problemi grafici specifici, intervenire con fix piccoli e per area, evitando refactor CSS massivi.
