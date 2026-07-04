# V542 - Safe repository cleanup

## Scopo

V542 e' un overlay di pulizia sicura della repository. Non aggiunge funzioni runtime e non cambia la navigazione.

La pulizia riguarda solo elementi non funzionali o obsoleti:

- file `.DS_Store` generati da macOS;
- cartelle `__MACOSX/` generate dagli zip macOS;
- `scripts/init_kickstart.sh`, script storico del template Hugo Academic/Kickstart che puo' ripristinare contenuti demo e non appartiene al progetto fantacalcio.

## Perche' non basta lo zip

Uno zip overlay puo' aggiungere o sovrascrivere file, ma non puo' cancellare file gia' presenti nella repo. Per questo V542 include documentazione, handoff, audit e riallineamento runtime a V542; le cancellazioni sicure vanno eseguite con comandi `find`/`rm` dopo l'applicazione dell'overlay.

## Comandi di cleanup

Dalla root della repo:

```bash
find . -name ".DS_Store" -delete
find . -name "__MACOSX" -type d -prune -exec rm -rf {} +
rm -f scripts/init_kickstart.sh
rmdir scripts 2>/dev/null || true
```

## Verifica

```bash
node static/fanta-engine/tools/audit-safe-repo-cleanup-v542.mjs
```

Esito atteso:

```text
Audit V542 superato: pulizia sicura repo completata, runtime whole-site a ?v=542 e docs/handoff aggiornati.
```

## Cosa non viene toccato

- Nessuna modifica a Firebase.
- Nessuna modifica a EmailJS.
- Nessuna cancellazione di fallback Listoni/Calciomercato.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.
- Nessuno spostamento di dati.
- Nessuna modifica a `netlify.toml` o alle funzioni Netlify.

## Prossimo passo consigliato

Dopo V542, fare test manuale completo. L'eventuale cleanup dei fallback locali Listoni/Calciomercato resta una decisione separata e richiede approvazione esplicita.
