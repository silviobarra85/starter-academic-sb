# V467 - Setup standard da Admin

Questa patch rimuove dal caricamento dell’interfaccia Admin gli strumenti massivi/tecnici introdotti nelle versioni V458-V464.

Il flusso consigliato torna a essere quello standard del gestionale:

1. Creare/verificare la stagione 2026-2027.
2. Creare le squadre reali dalla sezione Admin.
3. Far registrare i presidenti o crearli in Firebase Authentication.
4. Accettare gli utenti e associarli alla squadra corretta.
5. Impostare budget, stadio e dati gestionali.
6. Generare gli snapshot pubblici con la procedura standard Admin.
7. Applicare gli overlay snapshot alla repo.

I dati placeholder V457 sono neutralizzati nei JSON statici: la stagione 2026-2027 parte vuota finché non vengono generati dati reali dal flusso Admin.

## Aggiornamento V468

La V468 conferma il setup standard da Admin come flusso principale. Gli strumenti tecnici/massivi precedenti non vengono piu' caricati e possono essere rimossi fisicamente con:

```bash
bash static/fantapetillomantramanager/tools/cleanup-standard-admin-v468.sh
```

Resta attivo il pannello informativo `Setup standard da Admin 2026-2027`.

