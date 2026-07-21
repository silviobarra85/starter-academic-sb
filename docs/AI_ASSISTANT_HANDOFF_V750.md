# AI Assistant Handoff V750

Il sito ZonaOrientale nello zip ricevuto caricava ancora `assets/app.js?v=698` da `index.html`, quindi gli overlay V748/V749 non risultavano effettivamente attivi nel runtime.

V750 applica una correzione hard:

- `static/zonaorientale/index.html` ora deve caricare `assets/app.js?v=750`;
- `static/zonaorientale/assets/app.js` contiene un wrapper finale `zonaOrientaleStaticSvincoliV750`;
- il wrapper legge direttamente `assets/snapshots/seasons/{seasonId}.json` con cache busting;
- prima del render sostituisce le descrizioni deboli/vuote/generiche dei movimenti `SVINCOLO` con le descrizioni complete presenti nello snapshot statico;
- funziona anche quando il desktop/admin carica `fmMovements` da Firestore;
- debug: `window.ZonaOrientaleStaticSvincoliV750`, `window.enforceStaticSvincoliV750()`.

Controllare sempre che il browser carichi davvero `app.js?v=750` dal pannello Network. Se vede ancora `v=698`, il problema e' copia overlay/deploy/cache, non logica dati.
