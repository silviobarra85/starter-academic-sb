# Applicazione overlay V762 - ioSudo V752

L'overlay contiene soltanto file modificati sotto le radici `static/` e `docs/`.

## Applicazione

Dalla radice del repository `starter-academic-sb`:

```bash
rm -rf ~/Downloads/overlay_v762_iosudo_v752_dati_v135
unzip -q ~/Downloads/overlay_v762_iosudo_v752_dati_v135.zip -d ~/Downloads/

cp -R ~/Downloads/overlay_v762_iosudo_v752_dati_v135/static/* static/
cp -R ~/Downloads/overlay_v762_iosudo_v752_dati_v135/docs/* docs/
```

## Audit locale

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v752.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v752.mjs .
```

## Commit e pubblicazione

```bash
git status
git add static docs
git commit -m "Aggiorna ioSudo V752 con dati Excel v135"
git push origin master
```

## Controllo dopo il deploy

Aprire l'app con hard refresh:

`https://silviobarra.com/iosudo/`

Verificare nell'header:

- `Overlay V752`;
- data 22/07/2026;
- 1054 giocatori nella vista Giocatori;
- presenza di Matteo Zamarian e Luka Tomic;
- una sola identità Evan Ndicka;
- nessuna sovrapposizione rumor/ufficialità.
