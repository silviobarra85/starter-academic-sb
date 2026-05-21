# ZonaOrientale V123 cleanup

Pulizia consigliata dalla root della repo:

```bash
git rm -r --ignore-unmatch static/zonaorientale_backup
git rm -r --ignore-unmatch static/zonaorientale_refactor_backup
find static -name ".DS_Store" -print -delete
```

Motivo: queste cartelle e file macOS vengono pubblicati dentro `static/` ma non servono al sito pubblico.

Nota: lo zip overlay non puo eliminare file gia presenti nella repo, quindi le rimozioni vanno fatte con i comandi sopra.
