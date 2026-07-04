# V495 - Cleanup copia annidata `static/zonaorientale/static`

## Sintesi

La V495 chiude la verifica sulla vecchia copia annidata `static/zonaorientale/static`.
Il controllo runtime ha confermato che il sito reale non la usa: il path canonico resta `static/zonaorientale/`.

La rimozione fisica non viene effettuata dall'overlay, perché gli overlay si applicano con `cp -R` e non possono cancellare file in modo affidabile. Dopo aver applicato l'overlay V495 va eseguito il comando esplicito:

```bash
git rm -r static/zonaorientale/static
```

## Ordine corretto

1. Applicare overlay V495.
2. Eseguire `git rm -r static/zonaorientale/static`.
3. Eseguire gli audit V495.
4. Testare manualmente ZonaOrientale e FantaMantraManager.
5. Fare commit sul branch.

## Redirect Netlify

V495 aggiunge un redirect di sicurezza:

```toml
[[redirects]]
  from = "/zonaorientale/static/*"
  to = "/zonaorientale/:splat"
  status = 301
```

Serve solo a mitigare eventuali vecchi bookmark o link condivisi verso il path annidato.

## Cosa non cambia

- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna modifica a Dashboard Presidente/Admin/Area Squadra.
- Nessuna modifica a listone/calciomercato runtime.
- Nessuna modifica a `FUNZIONALITA'.md`.
