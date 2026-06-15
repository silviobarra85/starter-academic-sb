/*
 * FantaPetillo V294 - Shared pure helpers.
 *
 * Modulo volutamente piccolo e non invasivo: espone helper puri riutilizzabili
 * senza sostituire ancora i call-site storici dentro assets/app.js.
 *
 * Funzionalita da preservare: Listone, rose, Admin, Dashboard Presidente,
 * mobile chrome, news share e flussi Firebase/EmailJS non vengono toccati.
 */

const SPACE_RE = /\s+/g;
const DIACRITICS_RE = /[\u0300-\u036f]/g;
const CSV_NEEDS_QUOTE_RE = /["\n\r;,]/;

export function toSafeStringV294(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function normalizeWhitespaceV294(value) {
  return toSafeStringV294(value).replace(SPACE_RE, " ").trim();
}

export function normalizeSearchKeyV294(value) {
  return normalizeWhitespaceV294(value)
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .toLowerCase();
}

export function slugifyTextV294(value) {
  return normalizeSearchKeyV294(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

export function toFiniteNumberV294(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatSignedNumberV294(value) {
  const number = toFiniteNumberV294(value, 0);
  if (number > 0) return `+${number}`;
  return String(number);
}

export function csvEscapeV294(value) {
  const text = toSafeStringV294(value);
  if (!CSV_NEEDS_QUOTE_RE.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

export function rowsToCsvV294(rows, columns, separator = ";") {
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeColumns = Array.isArray(columns) ? columns : [];
  const header = safeColumns.map((column) => csvEscapeV294(column.label || column.key || "")).join(separator);
  const body = safeRows.map((row) => safeColumns.map((column) => {
    const key = column.key;
    const value = typeof column.value === "function" ? column.value(row) : row?.[key];
    return csvEscapeV294(value);
  }).join(separator));
  return [header, ...body].join("\n");
}

export function uniqueByKeyV294(items, getKey) {
  const seen = new Set();
  const result = [];
  for (const item of Array.isArray(items) ? items : []) {
    const key = typeof getKey === "function" ? getKey(item) : item?.[getKey];
    const normalizedKey = normalizeSearchKeyV294(key);
    if (!normalizedKey || seen.has(normalizedKey)) continue;
    seen.add(normalizedKey);
    result.push(item);
  }
  return result;
}

export function runSharedHelpersSmokeTestV294() {
  const csv = rowsToCsvV294(
    [{ name: 'A "test"', delta: 2 }, { name: "B;test", delta: -1 }],
    [
      { key: "name", label: "Nome" },
      { key: "delta", label: "Delta", value: (row) => formatSignedNumberV294(row.delta) }
    ]
  );
  return {
    ok: normalizeSearchKeyV294("  Éder  Militao ") === "eder militao"
      && slugifyTextV294("Listone 30/05") === "listone-30-05"
      && csv.includes('"A ""test"""')
      && csv.includes('"B;test"'),
    csvPreview: csv
  };
}

export function createFantaPetilloSharedHelpersV294() {
  return Object.freeze({
    version: "V294",
    behaviorChange: false,
    toSafeString: toSafeStringV294,
    normalizeWhitespace: normalizeWhitespaceV294,
    normalizeSearchKey: normalizeSearchKeyV294,
    slugifyText: slugifyTextV294,
    toFiniteNumber: toFiniteNumberV294,
    formatSignedNumber: formatSignedNumberV294,
    csvEscape: csvEscapeV294,
    rowsToCsv: rowsToCsvV294,
    uniqueByKey: uniqueByKeyV294,
    runSmokeTest: runSharedHelpersSmokeTestV294
  });
}

export const FantaPetilloSharedHelpersV294 = createFantaPetilloSharedHelpersV294();
