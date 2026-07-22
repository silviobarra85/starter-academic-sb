# Handoff sito e FantaEngine

## Stato corrente

- Release sito: V763.
- Bootstrap pubblico: static-first V760.
- Correzione blocco runtime: V761, rimosso il ciclo ricorsivo del MutationObserver.
- Controller Visibilità Admin: V763, controller unico e idempotente.
- FantaEngine è il livello condiviso per bootstrap, componenti, resolver, dati e audit.
- Firebase è usato dopo il primo render per login, ruoli e funzioni amministrative; non deve bloccare i dati pubblici.
- ioSudo è una PWA autonoma che consuma il payload normalizzato del FantaEngine.

## Regole strutturali

1. Nessun timer o watchdog deve sostituire il bootstrap canonico.
2. Il percorso pubblico deve funzionare con Firebase non disponibile.
3. Gli script condivisi devono avere un solo controller per responsabilità.
4. Ogni release deve verificare sorgenti, cartella pubblicata e URL live.
5. Le modifiche comuni devono vivere in `static/fanta-engine/`, con fallback locali solo quando necessari.

## Problemi aperti

- `zonaorientale/assets/app.js` resta un bundle molto grande e va modularizzato gradualmente.
- Le risorse storiche non più usate devono essere rimosse solo dopo audit dei riferimenti.
- Serve mantenere un test browser automatico con Firebase bloccato e controllo del primo render.
