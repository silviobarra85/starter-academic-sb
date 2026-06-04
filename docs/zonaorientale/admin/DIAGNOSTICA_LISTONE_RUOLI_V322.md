# V322 - Fix diagnostica ruoli Listone

## Scopo

Correggere il falso positivo nel pannello `Admin -> Diagnostica dati`, riga `Listoni - qualita dati`, dove venivano segnalati `senza ruolo 663` anche se i ruoli erano presenti nei JSON del Listone.

## Causa

La diagnostica V303 cercava il ruolo solo in pochi alias (`role`, `ruolo`, `position`, `fantasyRole`, `R.`). I listoni generati dal convertitore Classic usano invece campi come:

```text
classicRole
rosterRole
mantraRoles
```

Per questo tutti i 663 giocatori risultavano falsamente senza ruolo.

## Modifica

La diagnostica ora riconosce anche:

```text
classicRole
rosterRole
mantraRoles
roleClassic
roleMantra
R
R.
R.MANTRA
```

## Funzionalita a rischio e preservazione

Funzionalita verificate e da preservare:

```text
Listone pubblico
Colonna Modifica
Filtro Modifiche
Mostra usciti storici
Export CSV solo Admin
Convertitore listone Excel
Admin -> Diagnostica dati
Calciomercato RSS
Fantamercato interno
Rose e pagina squadra
Dashboard Presidente
```

Preservazione:

```text
nessun JSON modificato
nessun rendering Listone modificato
nessun convertitore modificato
nessuna funzione Firebase/EmailJS toccata
la modifica riguarda solo il calcolo diagnostico del ruolo
```

## Test

1. Login Admin.
2. Aprire `Admin -> Diagnostica dati`.
3. Cliccare `Aggiorna diagnostica`.
4. Verificare che `Listoni - qualita dati` non segnali piu tutti i giocatori come senza ruolo.
5. Verificare Listone pubblico e Listone Admin.

Diagnostica console:

```js
window.ZonaOrientaleListoneDiagnosticsRoleFixV322
```
