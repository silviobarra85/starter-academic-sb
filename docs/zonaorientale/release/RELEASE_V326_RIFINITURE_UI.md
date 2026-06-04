# Release V326 - Rifiniture UI Calciomercato/Listone/mobile

Data: 04/06/2026

## Sintesi

Release mirata di rifinitura UI. Nessuna modifica a Firestore, Netlify Functions, dati statici Calciomercato/Listone o regole Firebase.

## Modifiche incluse

1. Calciomercato: fallback immagine fonte per ogni articolo senza anteprima.
2. Calciomercato desktop: campi `Cerca`, `Da` e `A` allineati sulla stessa riga.
3. Calciomercato Solo Admin: pannello archivio statico espandibile/riducibile.
4. Mobile: rimosso il toggle `Passa a vista desktop/mobile`.
5. Mobile menu `Altro`: icone garantite anche per link dinamici.
6. Listone: select `Modifiche` uniformata agli altri controlli.

## Funzionalita da verificare dopo deploy

- Aprire `#calciomercato` da desktop e verificare filtri compatti.
- Aprire `#calciomercato` da admin e verificare pulsante `Espandi`/`Riduci` del box Solo Admin.
- Aprire articoli senza immagine e verificare tile della fonte.
- Aprire menu mobile `Altro` e verificare icona accanto a ogni voce.
- Verificare che il toggle vista mobile/desktop non sia piu presente.
- Aprire `#listone` e verificare aspetto del menu `Modifiche`.

## Funzionalita preservate

- Calciomercato feed RSS, fallback statico, archivio giornaliero e download admin.
- Listone pubblico/Admin, filtro Modifiche, export CSV solo Admin.
- Fantamercato interno, Rose, Dashboard Presidente, Admin, Firebase/Auth/EmailJS.
- Mobile bottom nav e navigazione esistente.

## Versione

- Footer e cache-buster: V326.
- `DEPLOY_EXPECTED_VERSION_V181`: `326`.
