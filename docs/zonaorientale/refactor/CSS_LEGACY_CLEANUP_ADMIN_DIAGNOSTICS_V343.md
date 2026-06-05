# V343 - Cleanup CSS legacy e Diagnostica Admin

## Scopo

La V343 chiude il ciclo aperto con l'audit V342 sui CSS refactor versionati vecchi e aggiunge feedback esplicito alla diagnostica Admin.

## CSS legacy

I file V291/V292 erano gia non importati dagli HTML attivi. La V343 li tratta come gruppo di pulizia isolato, mantenendo i CSS stabili V299/V333.

Candidati:

```text
assets/css/refactor/mobile-controls-v291.css
assets/css/refactor/rosters-tables-v291.css
assets/css/refactor/mobile-controls-v292.css
assets/css/refactor/rosters-tables-v292.css
assets/css/refactor/theme-light-suspended-v292.css
```

Tool:

```bash
static/zonaorientale/tools/cleanup-css-legacy-v343.sh
```

Il tool controlla che gli alias stabili esistano e blocca la pulizia se rileva riferimenti runtime inattesi.

## Diagnostica Admin

Il bottone `Aggiorna diagnostica` ora aggiorna un timestamp locale:

```text
Ultimo aggiornamento: dd/mm/yyyy, HH:mm:ss
```

Il fuso orario usato e `Europe/Rome`.

## Funzionalita a rischio e protezione

Area a rischio: Admin Diagnostica dati.
Protezione: il render V276 resta il punto centrale; V343 avvolge il rendering e intercetta il click con handler delegato in capture phase.

Area a rischio: CSS mobile/Listone/Rose.
Protezione: i CSS attivi non cambiano; la pulizia riguarda solo file non importati.

Area a rischio: tooling di verifica.
Protezione: `check-zonaorientale.sh` ora esegue dry-run cleanup e audit Admin V343.
