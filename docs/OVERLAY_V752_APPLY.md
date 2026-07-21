# Overlay V752 - Movimenti pagina squadra e accordion Tutte le Rose

## Scopo
- Nella pagina squadra, la tabella "Ultimi movimenti" mostra anche la colonna Descrizione, quindi gli svincoli sono leggibili anche da desktop.
- Nella sezione "Tutte le Rose", l'espansione e' singleton: quando apri una squadra, quella precedentemente aperta si chiude.
- Da smartphone, toccando una squadra nella sezione "Tutte le Rose" il focus torna all'inizio della lista giocatori della squadra aperta.
- Mantiene il fix statico degli svincoli V751 e il file statico 2026-2027.json con descrizioni complete.

## File inclusi
- static/zonaorientale/assets/app.js
- static/zonaorientale/index.html
- static/zonaorientale/assets/league-config.json
- static/zonaorientale/assets/snapshots/seasons/2026-2027.json
- docs/AI_ASSISTANT_HANDOFF_CURRENT.md
- docs/AI_ASSISTANT_HANDOFF_V752.md

## Applicazione
Dalla root del progetto:

```bash
cp -R ~/Downloads/overlay_site_v752_team_movements_roster_focus/static/* static/
cp -R ~/Downloads/overlay_site_v752_team_movements_roster_focus/docs/* docs/
```

Verifiche:

```bash
grep -n "app.js?v=" static/zonaorientale/index.html
grep -n "Malinovskyi" static/zonaorientale/assets/snapshots/seasons/2026-2027.json
node --check static/zonaorientale/assets/app.js
```

Deve risultare `app.js?v=752`.

## Commit suggerito

```bash
git add static/zonaorientale/assets/app.js static/zonaorientale/index.html static/zonaorientale/assets/league-config.json static/zonaorientale/assets/snapshots/seasons/2026-2027.json docs/OVERLAY_V752_APPLY.md docs/AI_ASSISTANT_HANDOFF_V752.md docs/AI_ASSISTANT_HANDOFF_CURRENT.md
git commit -m "Fix movimenti squadra e focus rose V752"
git push origin master
```
