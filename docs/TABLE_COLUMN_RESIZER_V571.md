# Table Column Resizer V571

V571 migliora lo strumento V570 rendendo visibili le maniglie di ridimensionamento e rendendole usabili anche da mobile.

## Attivazione

```text
?resizeTabelle=1
```

Esempi:

```text
/zonaorientale/?resizeTabelle=1#teamarea
/zonaorientale/?resizeTabelle=1#rose
/zonaorientale/?resizeTabelle=1#listone
/fantapetillomantramanager/?resizeTabelle=1#listone
```

## Uso da mobile

- Aprire la pagina con `?resizeTabelle=1`.
- Cercare gli indicatori `<>` sulle intestazioni della tabella.
- Trascinare lateralmente l'indicatore con il dito.
- Il badge in basso mostra la dimensione corrente.
- Al rilascio, la Console DevTools stampa i valori.

## Comandi console utili

```js
FantaTableResizeV571.print()
FantaTableResizeV571.disable()
FantaTableResizeV571.enable()
```

Per compatibilita, anche il vecchio nome punta al nuovo tool:

```js
FantaTableResizeV570.print()
```

## Output atteso

La Console stampa per ogni tabella:

- nome tabella;
- elenco colonne;
- larghezza in pixel;
- variabile CSS proposta;
- snippet CSS copiabile.

## Nota

Il tool e' opt-in: gli utenti normali non vedono maniglie, badge o misure.
