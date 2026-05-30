# V281 - Contrasto mobile in modalita Light

## Scopo

Correzione mirata della leggibilita su smartphone quando il sito e' in tema Light.

## Intervento

- Rafforzati i testi secondari (`muted`, hint, note, meta e descrizioni) in Light/mobile.
- Resi piu' solidi sfondi e bordi di card, pannelli e controlli.
- Migliorato il contrasto del corpo tabella in Light/mobile.
- Mantenute intestazioni sticky scure con testo chiaro.
- Rafforzata la prima colonna sticky delle tabelle mobile per evitare testo scuro su fondo scuro o testo chiaro su fondo chiaro.
- Normalizzati badge/stati `ok`, `warning`, `danger`, `muted` con colori leggibili su sfondo chiaro.

## Cosa non cambia

- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica ai dati JSON.
- Nessuna modifica alle logiche Listone V269-V278.
- Nessuna modifica a `FUNZIONALITA'.md`.

## Diagnostica runtime

```js
window.ZonaOrientaleMobileLightContrastV281
```

Valori attesi:

```text
version: V281
scope: mobile-light-contrast
cssOnly: true
preservesListoneLogic: true
```

## Test manuale consigliato

Attivare tema Light e testare da smartphone reale o viewport mobile:

1. Home e dashboard pubblica.
2. Listone con filtro `Modifiche`, `Mostra usciti storici` ed export CSV.
3. Competizioni e pagina dettaglio competizione.
4. Archivio, Statistiche e Confronta.
5. Dashboard Presidente.
6. Admin -> Diagnostica dati e Richieste presidenti.

Controllare in particolare: testi secondari, badge, righe tabella, prima colonna sticky, bottoni secondari e menu mobile.
