import { parseDecimalValue } from "../core/ui.js";

export function loadXlsxLibrary() {
  if (window.XLSX) return Promise.resolve(window.XLSX);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-xlsx-loader]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.XLSX));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
    script.async = true;
    script.dataset.xlsxLoader = "true";
    script.addEventListener("load", () => window.XLSX ? resolve(window.XLSX) : reject(new Error("SheetJS non disponibile.")));
    script.addEventListener("error", () => reject(new Error("Impossibile caricare la libreria Excel.")));
    document.head.appendChild(script);
  });
}

export function abbreviateRealTeam(value) {
  return String(value || "").trim().slice(0, 3).toUpperCase();
}

function toNumberOrValue(value) {
  const parsed = parseDecimalValue(value);
  return parsed === null ? (value ?? "") : parsed;
}

export function parseListoneSheetRows(rows, sourceSheet, status, statusCode) {
  const headerIndex = rows.findIndex((row) => row.some((cell) => String(cell || "").trim().toLowerCase() === "nome"));
  if (headerIndex < 0) return [];
  const headers = rows[headerIndex].map((cell) => String(cell || "").trim().toLowerCase());
  const find = (name) => headers.indexOf(name.toLowerCase());
  const idx = {
    id: find("id"),
    role: find("r"),
    mantra: find("rm"),
    name: find("nome"),
    team: find("squadra"),
    qta: find("qt.a"),
    qti: find("qt.i"),
    diff: find("diff."),
    qtam: find("qt.a m"),
    qtim: find("qt.i m"),
    diffm: find("diff.m"),
    fvm: find("fvm"),
    fvmm: find("fvm m")
  };

  return rows.slice(headerIndex + 1)
    .filter((row) => row[idx.name])
    .map((row) => ({
      fantacalcioId: String(row[idx.id] || ""),
      classicRole: String(row[idx.role] || ""),
      mantraRoles: String(row[idx.mantra] || ""),
      playerName: String(row[idx.name] || ""),
      realTeam: abbreviateRealTeam(row[idx.team]),
      quotationCurrent: toNumberOrValue(row[idx.qta]),
      quotationInitial: toNumberOrValue(row[idx.qti]),
      quotationDiff: toNumberOrValue(row[idx.diff]),
      quotationCurrentMantra: toNumberOrValue(row[idx.qtam]),
      quotationInitialMantra: toNumberOrValue(row[idx.qtim]),
      quotationDiffMantra: toNumberOrValue(row[idx.diffm]),
      fvm: toNumberOrValue(row[idx.fvm]),
      fvmMantra: toNumberOrValue(row[idx.fvmm]),
      fantasyRoster: "",
      rosterRole: "",
      rosterCost: "",
      status,
      statusCode,
      sourceSheet
    }));
}
