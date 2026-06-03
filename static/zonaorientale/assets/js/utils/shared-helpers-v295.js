/*
 * ZonaOrientale V295 - Shared pure helpers.
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

export function toSafeStringV295(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function normalizeWhitespaceV295(value) {
  return toSafeStringV295(value).replace(SPACE_RE, " ").trim();
}

export function normalizeSearchKeyV295(value) {
  return normalizeWhitespaceV295(value)
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .toLowerCase();
}

export function slugifyTextV295(value) {
  return normalizeSearchKeyV295(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

export function toFiniteNumberV295(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function formatSignedNumberV295(value) {
  const number = toFiniteNumberV295(value, 0);
  if (number > 0) return `+${number}`;
  return String(number);
}

export function csvEscapeV295(value) {
  const text = toSafeStringV295(value);
  if (!CSV_NEEDS_QUOTE_RE.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

export function rowsToCsvV295(rows, columns, separator = ";") {
  const safeRows = Array.isArray(rows) ? rows : [];
  const safeColumns = Array.isArray(columns) ? columns : [];
  const header = safeColumns.map((column) => csvEscapeV295(column.label || column.key || "")).join(separator);
  const body = safeRows.map((row) => safeColumns.map((column) => {
    const key = column.key;
    const value = typeof column.value === "function" ? column.value(row) : row?.[key];
    return csvEscapeV295(value);
  }).join(separator));
  return [header, ...body].join("\n");
}

export function uniqueByKeyV295(items, getKey) {
  const seen = new Set();
  const result = [];
  for (const item of Array.isArray(items) ? items : []) {
    const key = typeof getKey === "function" ? getKey(item) : item?.[getKey];
    const normalizedKey = normalizeSearchKeyV295(key);
    if (!normalizedKey || seen.has(normalizedKey)) continue;
    seen.add(normalizedKey);
    result.push(item);
  }
  return result;
}

export function runSharedHelpersSmokeTestV295() {
  const csv = rowsToCsvV295(
    [{ name: 'A "test"', delta: 2 }, { name: "B;test", delta: -1 }],
    [
      { key: "name", label: "Nome" },
      { key: "delta", label: "Delta", value: (row) => formatSignedNumberV295(row.delta) }
    ]
  );
  return {
    ok: normalizeSearchKeyV295("  Éder  Militao ") === "eder militao"
      && slugifyTextV295("Listone 30/05") === "listone-30-05"
      && csv.includes('"A ""test"""')
      && csv.includes('"B;test"'),
    csvPreview: csv
  };
}

export function createZonaOrientaleSharedHelpersV295() {
  return Object.freeze({
    version: "V295",
    behaviorChange: false,
    toSafeString: toSafeStringV295,
    normalizeWhitespace: normalizeWhitespaceV295,
    normalizeSearchKey: normalizeSearchKeyV295,
    slugifyText: slugifyTextV295,
    toFiniteNumber: toFiniteNumberV295,
    formatSignedNumber: formatSignedNumberV295,
    csvEscape: csvEscapeV295,
    rowsToCsv: rowsToCsvV295,
    uniqueByKey: uniqueByKeyV295,
    runSmokeTest: runSharedHelpersSmokeTestV295
  });
}

export const ZonaOrientaleSharedHelpersV295 = createZonaOrientaleSharedHelpersV295();
