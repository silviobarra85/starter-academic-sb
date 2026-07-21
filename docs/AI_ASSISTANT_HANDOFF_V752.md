# AI Assistant Handoff - V752

## Stato
Overlay V752 per il sito ZonaOrientale.

## Fix principali
1. Pagina squadra: nella sezione "Ultimi movimenti" viene mostrata anche la descrizione del movimento, quindi gli svincoli sono visibili anche da desktop.
2. Sezione "Tutte le Rose": l'espansione delle rose e' singleton. Aprendo una squadra si chiude quella precedentemente aperta.
3. Smartphone: toccando una squadra in "Tutte le Rose" il focus scorre all'inizio della lista giocatori della squadra aperta.
4. Mantenuto il fix V751 sugli svincoli statici e sul file `static/zonaorientale/assets/snapshots/seasons/2026-2027.json`.
5. Footer/versione aggiornati a V752.

## Note operative
- Se il sito continua a mostrare vecchie descrizioni degli svincoli, verificare che `index.html` carichi `app.js?v=752` e che il JSON pubblicato contenga le descrizioni complete.
- Da console browser:

```js
document.querySelector('script[src*="app.js"]')?.src
fetch('/zonaorientale/assets/snapshots/seasons/2026-2027.json?v=' + Date.now()).then(r => r.json()).then(d => d.fmMovements.filter(m => m.type === 'SVINCOLO'))
window.FantaSiteRosterNavigationV752
```

## Regole deduplica da conservare
- Kevin Bruno Sassuolo diverso da Bruno Galassi Lazio.
- Andrej Kostic Milan diverso da Filip Kostic Juventus.
- Proteggere le disambiguazioni gia' confermate: Carboni, Esposito, Thuram, Ferguson, Russo, Arena, Bonfanti, Rossi, Colombo, Marin, Moreno, Nicolas, Pedro, David, Rrahmani, Toure/El Bilal Toure, Oyono, Stankovic, Ilic, Gelli, Traore, Konate, Miranda, Moro, Kone, Vasquez, Perez, Terracciano, Liberali, Paz, Berardi, Vaz.
