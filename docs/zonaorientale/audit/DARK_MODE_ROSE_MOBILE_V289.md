# V289 - Dark mode e rose mobile

## Scopo

V289 sospende temporaneamente la modalita Light, che verra' ripresa in una fase successiva, e corregge le tabelle Rosa da smartphone in modalita Dark.

## Modifiche

- Il bootstrap HTML imposta sempre `document.documentElement.dataset.theme = "dark"`.
- Il runtime `applyZonaOrientaleThemeV89` ignora richieste Light e forza il tema Dark.
- `localStorage.zonaOrientaleTheme` viene riallineato a `dark` quando disponibile.
- Il pulsante `#themeToggleBtn` viene nascosto e reso non focusable.
- La pagina standalone `player.html` applica la stessa regola.
- Le tabelle `.roster-player-table` e `.team-profile-roster-table` da mobile hanno righe piu' compatte e celle centrate verticalmente.
- La prima colonna sticky delle rose resta su sfondo scuro con testo chiaro, anche durante lo scroll orizzontale.

## Test consigliati

1. Impostare manualmente in console `localStorage.setItem("zonaOrientaleTheme", "light")`, ricaricare e verificare che il sito torni Dark.
2. Verificare che il pulsante cambio tema non sia visibile in header.
3. Mobile/Light salvato in precedenza: nessuna schermata deve restare in Light.
4. Mobile/Dark: `Rose`, pagina squadra e Dashboard Presidente devono mostrare righe Rosa compatte.
5. La prima colonna della tabella Rosa deve avere testo leggibile e centrato verticalmente.

## Diagnostica runtime

```js
window.ZonaOrientaleDarkModeOnlyV289
```

## Note

La sospensione Light e' intenzionale e reversibile. Le regole Light precedenti non vengono rimosse: restano nel CSS per una futura ripresa controllata del tema chiaro.
