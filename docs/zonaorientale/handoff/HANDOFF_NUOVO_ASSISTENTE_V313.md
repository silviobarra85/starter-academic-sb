# Handoff nuovo assistente - ZonaOrientale V313

## Stato corrente

- Repo: `starter-academic-sb`.
- Webapp: `static/zonaorientale/`.
- Docs: `docs/zonaorientale/`.
- Netlify Functions: `netlify/functions/`.
- Branch lavoro: `refactor/260528-zonaorientale-next`.
- Versione runtime: `V313 admin ordinato e resoconto funzionale`.
- Produzione: `master`, da aggiornare solo dopo test completi.

## Regola irrinunciabile

Non perdere funzionalita vecchie. Ogni proposta deve indicare:

1. funzionalita a rischio;
2. come vengono preservate;
3. test manuali e tecnici.

## Cosa e' cambiato in V313

- Admin: titolo sempre sopra tutto.
- Admin: pannelli informativi spostati sotto il titolo.
- Admin: categorie e pannelli partono ridotti.
- Admin: `Carica dati amministrazione` resta aperto.
- Calciomercato: Netlify Function aggiornata a feed multipli/limiti configurabili.
- Documentazione: resoconto sito V313 e FUNZIONALITA'.md aggiornato su richiesta esplicita.

## File importanti da leggere

```text
docs/zonaorientale/00_START_HERE_V272.md
docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE.md
docs/zonaorientale/handoff/HANDOFF_NUOVO_ASSISTENTE_V313.md
docs/zonaorientale/FUNZIONALITA'.md
docs/zonaorientale/RESOCONTO_SITO_V313.md
docs/zonaorientale/admin/ADMIN_LAYOUT_V313.md
docs/zonaorientale/calciomercato/CALCIOMERCATO_FEED_V313.md
```

## Funzionalita critiche da preservare

- Home/dashboard pubblica.
- News e anteprime WhatsApp via Netlify Function.
- Rose e pagina squadra.
- Fantamercato interno.
- Calciomercato RSS automatico.
- Listone con Modifica, filtro Modifiche, usciti storici, export solo Admin.
- Competizioni, Archivio, Statistiche, Confronta.
- Dashboard Presidente, trattative, comunicati, svincoli.
- Admin leggero/completo, Richieste presidenti, Diagnostica dati, Converti listone Excel, Snapshot, Backup.
- Mobile bottom nav, menu Altro, pulsante Su.
- Dark mode unico; Light mode sospesa.

## Comandi locali

Statico normale:

```bash
cd starter-academic-sb
cd static/zonaorientale
cd ..
python3 -m http.server 1313 --bind 0.0.0.0
```

Netlify Function Calciomercato:

```bash
cd starter-academic-sb
npx netlify-cli dev \
  --command "python3 -m http.server 1314 --directory static --bind 0.0.0.0" \
  --target-port 1314 \
  --port 8888
```

## Controlli

```bash
static/zonaorientale/tools/check-zonaorientale.sh
node --check netlify/functions/calciomercato-feed.js
```

## Merge su master

Solo dopo test completi:

```bash
git checkout master
git pull origin master
git merge --no-ff refactor/260528-zonaorientale-next -m "merge: integra aggiornamenti zonaorientale V313"
git push origin master
git checkout refactor/260528-zonaorientale-next
git merge master
git push origin refactor/260528-zonaorientale-next
```
