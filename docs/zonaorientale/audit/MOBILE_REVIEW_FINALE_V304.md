# V304 - Mobile review finale e audit pre-Calciomercato

## Scopo

V304 chiude la fase di stabilizzazione mobile/refactor prima di iniziare la nuova funzionalita `Calcio mercato`.

Questa release non introduce nuove funzioni e non cambia dati: serve a fissare la checklist finale delle funzionalita da preservare e dei test minimi prima della fase successiva.

## Funzionalita a rischio da non perdere

Durante i prossimi overlay, in particolare per la sezione Calcio mercato, vanno preservate esplicitamente:

- Home pubblica e navigazione desktop/mobile.
- News e share WhatsApp dinamico via Netlify Function.
- Listone pubblico e Admin.
- Colonna `Modifica`, filtro `Modifiche`, usciti storici.
- Export CSV modifiche solo Admin.
- Rose pubbliche, pagina squadra e Dashboard Presidente.
- Trattative, comunicati presidente e svincoli.
- Admin: Diagnostica dati, Richieste presidenti, Converti listone Excel, snapshot e workflow pubblicazione.
- Competizioni, `competition.html`, Archivio, Statistiche e Confronta.
- `player.html`.
- Mobile bottom navigation, menu Altro e pulsante Su.
- Dark mode unico V289 con toggle Light nascosto.

## Test mobile finale consigliato

Viewport:

- 390x844 smartphone standard.
- 430x932 smartphone grande.
- 768x1024 tablet verticale.

Sezioni:

1. Home: navigazione, card, accessi rapidi, bottom nav.
2. Listone pubblico: filtri, ricerca, colonna `Modifica`, assenza export CSV.
3. Listone Admin: export CSV visibile e funzionante.
4. Pagina squadra -> Rosa: prima colonna sticky, righe compatte, nomi leggibili.
5. Dashboard Presidente: tabelle rosa, bottoni, form e notifiche.
6. Admin -> Diagnostica dati: righe V303 visibili e refresh senza errori.
7. Admin -> Richieste presidenti: aggiorna, approva/rifiuta visivamente integri.
8. Competizioni e `competition.html`: classifiche e scroll tabelle.
9. `player.html`: layout mobile e tema dark.
10. Bottom nav, menu Altro e pulsante Su.

## Criteri per iniziare Calcio mercato

La fase Calcio mercato puo iniziare quando:

- `static/zonaorientale/tools/check-zonaorientale.sh` passa.
- La review mobile sopra non segnala regressioni critiche.
- La Light mode resta sospesa, quindi la nuova sezione va progettata solo per Dark mode.
- La nuova feature viene introdotta in modo isolato, senza toccare Listone/Rose/Admin salvo necessita documentata.

## Indicazione tecnica per la prossima feature

La prima versione Calcio mercato dovrebbe essere statica/configurabile, senza scraping diretto dal browser:

- pagina/sezione pubblica `Calcio mercato`;
- dati da JSON statico o configurazione locale;
- card articolo con titolo, fonte, squadra, topic, immagine opzionale, link esterno;
- nessuna chiamata automatica a siti esterni nella prima versione;
- successiva evoluzione con Netlify Function solo dopo test e scelta fonti.

## Diagnostica

```js
window.ZonaOrientaleMobileFinalReviewV304
```

Valori attesi:

```js
window.ZonaOrientaleMobileFinalReviewV304.behaviorChange === false
window.ZonaOrientaleMobileFinalReviewV304.calciomercatoImplemented === false
```
