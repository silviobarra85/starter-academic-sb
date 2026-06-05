/*
 * ZonaOrientale V341 - Shared helper bridge.
 *
 * Refactor protetto: centralizza l'accesso agli helper puri gia' disponibili
 * senza cambiare i nomi storici usati da assets/app.js. I fallback locali
 * preservano il comportamento precedente se il modulo V295 non fosse caricato.
 */

const DIACRITICS_RE = /[\u0300-\u036f]/g;
const CSV_NEEDS_QUOTE_RE = /["\n\r;,]/;

function toSafeString(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function fallbackNormalizeWhitespace(value) {
  return toSafeString(value).replace(/\s+/g, " ").trim();
}

function fallbackNormalizeLooseSearchKey(value) {
  return fallbackNormalizeWhitespace(value)
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .toLowerCase();
}

function fallbackNormalizeStrictSearchKey(value) {
  return toSafeString(value)
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function fallbackCsvEscape(value) {
  const text = toSafeString(value);
  if (!CSV_NEEDS_QUOTE_RE.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function fallbackRowsToCsv(rows, columns, separator = ";") {
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeColumns = Array.isArray(columns) ? columns : [];
  const header = safeColumns.map((column) => fallbackCsvEscape(column.label || column.key || "")).join(separator);
  const body = safeRows.map((row) => safeColumns.map((column) => {
    const key = column.key;
    const value = typeof column.value === "function" ? column.value(row) : row?.[key];
    return fallbackCsvEscape(value);
  }).join(separator));
  return [header, ...body].join("\n");
}

export function createSharedHelperBridgeV341(options = {}) {
  const getSharedHelpers = () => options.sharedHelpers || globalThis.ZonaOrientaleSharedHelpersV295 || null;
  const strictNormalizer = typeof options.normalizeKey === "function" ? options.normalizeKey : fallbackNormalizeStrictSearchKey;

  function normalizeLooseSearchKey(value) {
    const helper = getSharedHelpers();
    if (helper && typeof helper.normalizeSearchKey === "function") return helper.normalizeSearchKey(value);
    if (helper && typeof helper.searchKey === "function") return helper.searchKey(value);
    return fallbackNormalizeLooseSearchKey(value);
  }

  function normalizeStrictSearchKey(value) {
    return strictNormalizer(value);
  }

  function csvEscape(value) {
    const helper = getSharedHelpers();
    if (helper && typeof helper.csvEscape === "function") return helper.csvEscape(value);
    return fallbackCsvEscape(value);
  }

  function rowsToCsv(rows, columns, separator = ";") {
    const helper = getSharedHelpers();
    if (helper && typeof helper.rowsToCsv === "function") return helper.rowsToCsv(rows, columns, separator);
    return fallbackRowsToCsv(rows, columns, separator);
  }

  function runSmokeTest() {
    const csv = rowsToCsv([{ name: 'A "test"', value: "B;C" }], [{ key: "name", label: "Nome" }, { key: "value", label: "Valore" }]);
    return {
      ok: normalizeLooseSearchKey("  Éder  Militao ") === "eder militao"
        && normalizeStrictSearchKey("Kalulu, Juventus") === "kalulu juventus"
        && csv.includes('"A ""test"""')
        && csv.includes('"B;C"'),
      csvPreview: csv
    };
  }

  return Object.freeze({
    version: "V341",
    behaviorChange: false,
    normalizeLooseSearchKey,
    normalizeStrictSearchKey,
    csvEscape,
    rowsToCsv,
    runSmokeTest
  });
}
