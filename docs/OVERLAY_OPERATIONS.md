# Operazioni overlay

Overlay V782 pronto per la GitHub Action.

1. Caricare lo zip in `incoming/overlays/` e fare commit/push.
2. Il workflow estrae `static/` e `docs/` nella radice del repository.
3. Il workflow esegue automaticamente l'audit più recente: `node static/fanta-engine/tools/audit-iosudo-v782.mjs .`.
4. Vengono inoltre controllati la sintassi dell'app V782 e il service worker.
5. Lo zip viene rimosso automaticamente dopo l'applicazione e le modifiche vengono committate dal bot.

L'overlay contiene soltanto i file effettivamente modificati e non modifica `.github/workflows`.
