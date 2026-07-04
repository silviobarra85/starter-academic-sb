# AI Assistant handoff V542 - Safe repository cleanup

## Baseline

Versione overlay: V542.

## Obiettivo

V542 pulisce la repository da metadati macOS e da uno script obsoleto del template Hugo Academic/Kickstart, senza cambiare il comportamento applicativo.

## File principali dell'overlay

- `docs/SAFE_REPO_CLEANUP_V542.md`
- `docs/AI_ASSISTANT_HANDOFF_V542.md`
- `docs/AI_ASSISTANT_HANDOFF_CURRENT.md`
- `docs/OVERLAY_ROADMAP.md`
- `docs/CENTRALIZATION_STATUS_V521.md`
- `static/fanta-engine/tools/audit-safe-repo-cleanup-v542.mjs`

Inoltre sono riallineati cache-buster/footer/config a V542 su entrambe le leghe.

## Cancellazioni manuali richieste

Lo zip non puo' cancellare file esistenti. Dopo avere copiato l'overlay, eseguire:

```bash
find . -name ".DS_Store" -delete
find . -name "__MACOSX" -type d -prune -exec rm -rf {} +
rm -f scripts/init_kickstart.sh
rmdir scripts 2>/dev/null || true
```

## Audit

```bash
node static/fanta-engine/tools/audit-safe-repo-cleanup-v542.mjs
```

L'audit deve confermare che non restano `.DS_Store`, `__MACOSX/` o `scripts/init_kickstart.sh`.

## Guardrail

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non cancellare fallback locali Listoni/Calciomercato senza approvazione esplicita.
- Non toccare Firebase, EmailJS, Admin, Presidente e Netlify in questa fase.
- Ogni overlay futuro deve aggiornare docs e handoff.
