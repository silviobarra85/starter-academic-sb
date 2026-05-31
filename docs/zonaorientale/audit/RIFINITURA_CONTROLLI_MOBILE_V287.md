# V287 - Rifinitura controlli mobile

## Scopo

V287 applica una rifinitura CSS mirata ai controlli mobile dopo V285/V286.
L'obiettivo e' rendere piu' leggibili e comodi da usare form, filtri, bottoni, menu e aree scrollabili da smartphone, soprattutto in tema Light.

## Tipo intervento

- Solo CSS/UI.
- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica ai dati JSON.
- Nessuna modifica alle logiche Listone/Rose/Admin.
- `FUNZIONALITA'.md` non modificato.

## Aree coinvolte

- Filtri Listone e form generici.
- Bottoni primari, secondari e ghost.
- Pill/filter chip e subnav mobile.
- Bottom navigation e menu mobile Altro.
- Aree tabellari scrollabili.
- Modali/sheet con larghezza vincolata su smartphone.

## Correzioni principali

- Target touch minimo piu' coerente per input, select, textarea, bottoni e link interattivi.
- Font size mobile degli input portato a 16px per ridurre zoom automatico su iOS.
- Focus ring piu' evidente in tema Light.
- Controlli e gruppi checkbox/radio piu' leggibili su sfondo chiaro.
- Bottoni e pill attivi con contrasto piu' netto.
- Safe area migliorata per bottom navigation.
- Scroll orizzontale tabelle piu' fluido con `-webkit-overflow-scrolling: touch`.

## Diagnostica runtime

```js
window.ZonaOrientaleMobileControlsV287
```

## Test manuali consigliati

Da smartphone o viewport mobile:

1. Tema Light attivo.
2. Home: menu, subnav, pulsanti principali.
3. Listone: ricerca, filtri, campi visibili, filtro Modifiche, export CSV.
4. Rose squadra: tabella e scroll orizzontale.
5. Dashboard Presidente: form e bottoni.
6. Admin: Diagnostica dati, Richieste presidenti, form e toolbar.
7. Tema Dark: controllo rapido per assenza regressioni evidenti.

## Note

V287 non riscrive il layout mobile: aggiunge regole finali conservative per aumentare usabilita' e leggibilita'. Eventuali problemi residui vanno corretti con patch puntuali sulla singola sezione.
