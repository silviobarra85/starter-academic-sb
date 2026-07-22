# Applicazione overlay V760

L'overlay e incrementale rispetto alla V759 e va applicato dalla radice del repository.

```bash
unzip overlay_v760_bootstrap_duraturo.zip
bash overlay_v760_bootstrap_duraturo/APPLY_OVERLAY.sh /percorso/repository
```

Lo script copia in un solo passaggio le radici `static/`, `docs/`, `netlify/` e `netlify.toml`, poi esegue l'audit V760.

Dopo il push, attendere il completamento della build Netlify e verificare il sito pubblicato:

```bash
node static/zonaorientale/tools/check-live-v760.mjs https://silviobarra.com
```

La release non e valida finche il controllo live non termina con `OK`.
