#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
QUIET=0
if [[ "${1:-}" == "--quiet" ]]; then
  QUIET=1
fi

if [[ ! -d "$SITE_ROOT/assets" ]]; then
  echo "Errore: cartella assets non trovata vicino allo script." >&2
  echo "Esegui: static/zonaorientale/tools/audit-assets-v298.sh" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "Errore: python3 non disponibile; necessario per normalizzare i path dell'audit." >&2
  exit 1
fi

python3 - "$SITE_ROOT" "$QUIET" <<'PY'
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

site = Path(sys.argv[1]).resolve()
quiet = sys.argv[2] == "1"
assets = site / "assets"

html_files = sorted(site.glob("*.html"))
js_files = sorted(assets.rglob("*.js"))
css_files = sorted(assets.rglob("*.css"))
scan_files = html_files + js_files + css_files

local_ref_re = re.compile(r'''(?:href|src)\s*=\s*["']([^"']+)["']|import\s+(?:[^"'()]+?\s+from\s+)?["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|url\(\s*["']?([^"')]+)["']?\s*\)''')

ignore_schemes = {"http", "https", "mailto", "tel", "data", "javascript"}
ignore_prefixes = ("#", "//")
tracked_ext = {".js", ".mjs", ".css", ".json", ".png", ".jpg", ".jpeg", ".webp", ".svg", ".ico", ".html", ".woff", ".woff2"}

refs = {}
missing = []


def clean_ref(raw):
    if not raw:
        return None
    value = raw.strip()
    if not value or value.startswith(ignore_prefixes):
        return None
    parsed = urlparse(value)
    if parsed.scheme in ignore_schemes:
        return None
    value = value.split("#", 1)[0].split("?", 1)[0].strip()
    if not value:
        return None
    if value.startswith("/"):
        # Site is served under /zonaorientale/. Only inspect refs that belong to it.
        if value.startswith("/zonaorientale/"):
            value = value[len("/zonaorientale/"):]
        else:
            return None
    return value


def resolve_ref(source, value):
    source = Path(source)
    if value.startswith("./") or value.startswith("../"):
        return (source.parent / value).resolve()
    if value.startswith("assets/") or value.endswith(".html"):
        return (site / value).resolve()
    return (source.parent / value).resolve()

for source in scan_files:
    try:
        text = source.read_text(encoding="utf-8", errors="ignore")
    except Exception as exc:
        missing.append((str(source.relative_to(site)), "<read-error>", str(exc)))
        continue
    for match in local_ref_re.finditer(text):
        raw = next((g for g in match.groups() if g), None)
        value = clean_ref(raw)
        if not value:
            continue
        target = resolve_ref(source, value)
        try:
            rel_target = target.relative_to(site)
        except ValueError:
            continue
        if target.suffix.lower() not in tracked_ext and not value.startswith("assets/"):
            continue
        refs.setdefault(str(rel_target), set()).add(str(source.relative_to(site)))
        if not target.exists():
            missing.append((str(source.relative_to(site)), value, str(rel_target)))

asset_code_files = sorted([p for p in list(assets.rglob("*.js")) + list(assets.rglob("*.css")) if p.is_file()])
asset_code_rel = [str(p.relative_to(site)) for p in asset_code_files]
html_entry_refs = set(refs.keys())

# Assets that are not referenced by the scanned HTML/JS/CSS. This is only a candidate list:
# some files are loaded dynamically from app.js, Firebase data, tools, or legacy links.
exclude_orphan_patterns = [
    re.compile(r"^assets/js/dev/"),
    re.compile(r"^assets/js/utils/shared-helpers-v294\.js$"),
    re.compile(r"^assets/js/admin/"),
    re.compile(r"^assets/js/refactor/"),
    re.compile(r"^assets/js/data/"),
    re.compile(r"^assets/js/domain/"),
    re.compile(r"^assets/js/market/"),
    re.compile(r"^assets/js/mobile/"),
]

candidate_orphans = []
for rel in asset_code_rel:
    if rel in html_entry_refs:
        continue
    if any(pattern.search(rel) for pattern in exclude_orphan_patterns):
        continue
    # app.js is entrypoint via HTML and should be referenced; keep this generic.
    candidate_orphans.append(rel)

# Versioned superseded files are useful to see separately.
superseded = []
for rel in asset_code_rel:
    name = Path(rel).name
    if re.search(r"-v29[0-7]\.(?:js|css)$", name) and rel not in html_entry_refs:
        superseded.append(rel)

print("== Audit asset/import V298 ==")
print(f"Sito: {site}")
print(f"HTML analizzati: {len(html_files)}")
print(f"JS analizzati: {len(js_files)}")
print(f"CSS analizzati: {len(css_files)}")
print(f"Riferimenti locali rilevati: {len(refs)}")

if missing:
    print("\nFAIL: riferimenti locali mancanti")
    for source, raw, target in missing[:80]:
        print(f"- {source} -> {raw} => {target}")
    if len(missing) > 80:
        print(f"... altri {len(missing) - 80} riferimenti mancanti")
else:
    print("OK: nessun import/href/src/url locale mancante tra i file analizzati")

if superseded:
    print("\nWARN: possibili file versionati superati non referenziati")
    for rel in superseded[:80]:
        print(f"- {rel}")
    if len(superseded) > 80:
        print(f"... altri {len(superseded) - 80} file versionati")
else:
    print("OK: nessun file versionato V290-V297 non referenziato rilevante trovato")

if candidate_orphans and not quiet:
    print("\nWARN: candidati orfani CSS/JS da verificare manualmente")
    for rel in candidate_orphans[:120]:
        print(f"- {rel}")
    if len(candidate_orphans) > 120:
        print(f"... altri {len(candidate_orphans) - 120} candidati")
    print("Nota: questa lista non autorizza cancellazioni automatiche; usare grep/test browser prima di git rm.")
elif candidate_orphans:
    print(f"WARN: {len(candidate_orphans)} candidati orfani CSS/JS da verificare manualmente")
else:
    print("OK: nessun candidato orfano CSS/JS fuori dalle aree escluse")

if missing:
    sys.exit(1)
PY
