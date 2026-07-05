# V571 - Indicatori resize colonne mobile

## Obiettivo

Rendere comprensibile e usabile, soprattutto da smartphone, lo strumento di ridimensionamento colonne introdotto in V570.

## Modifiche

- Nuovo CSS `table-column-resizer-v571.css` con maniglie visibili sulle intestazioni.
- Nuovo JS `table-column-resizer-v571.js` con badge live della larghezza corrente.
- Maniglie piu grandi su mobile, con `touch-action: none` per evitare conflitto con lo scroll.
- Log in Console a fine trascinamento con tabella, colonna, larghezza e snippet CSS.
- Alias `FantaTableResizeV570 = FantaTableResizeV571` per non rompere istruzioni precedenti.
- Aggiornati riferimenti HTML e cache-buster a V571 su entrambe le leghe.
- Aggiornati `currentVersion` e release notes delle due `league-config.json`.

## Ambito

- ZonaOrientale.
- FantaPetilloMantraManager.
- Tabelle target: Area Squadra, Rose espanse, Listone.

## Preservazioni

- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica a Admin/Presidente.
- Nessuna modifica a snapshot o dati squadre.
- Calciomercato resta disattivato.
- Svincola Giocatori ZonaOrientale resta attivo.
- `FUNZIONALITA'.md` non e' stato modificato.

## Verifica

```bash
node static/fanta-engine/tools/audit-table-column-resizer-v571.mjs
node --check static/fanta-engine/js/ui/table-column-resizer-v571.js
```

## Test manuale

1. Aprire `/zonaorientale/?resizeTabelle=1#teamarea` da smartphone.
2. Verificare che sulle intestazioni appaiano indicatori `<>`.
3. Trascinare l'indicatore della prima colonna della tabella rosa Area Squadra.
4. Verificare che il badge mostri la larghezza in pixel.
5. Rilasciare e copiare dalla Console i valori.
6. Ripetere su Rose e Listone.
7. Ripetere su FantaPetilloMantraManager.
