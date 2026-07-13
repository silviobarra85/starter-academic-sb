# Overlay V641 - GitHub Actions Apply Overlay

## Scopo

Aggiunge un workflow GitHub Actions per applicare automaticamente gli overlay caricati in `incoming/overlays/`.

## Applicazione una tantum da Mac

```bash
cp -R ~/Downloads/fantacalcio_overlay_v641_github_actions_apply_overlay/.github .
cp -R ~/Downloads/fantacalcio_overlay_v641_github_actions_apply_overlay/tools/* tools/
cp -R ~/Downloads/fantacalcio_overlay_v641_github_actions_apply_overlay/incoming/* incoming/
cp -R ~/Downloads/fantacalcio_overlay_v641_github_actions_apply_overlay/docs/* docs/
```

Poi:

```bash
git status
git add -A .github tools incoming docs
git commit -m "V641 aggiunge automazione applicazione overlay"
git push origin HEAD:master
```

## Uso successivo da smartphone

Caricare lo zip overlay in `incoming/overlays/` da GitHub browser e committare. Il workflow partira automaticamente.
