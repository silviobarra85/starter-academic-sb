// V506 - Validatori comuni form/tool multi-lega.
// Modulo puro: non contiene brand, Firebase, EmailJS o dati specifici di lega.
export const FORM_VALIDATORS_VERSION_V506 = 'V506';

export function normalizeTextV506(value, options = {}) {
  const text = String(value ?? '');
  const trimmed = options.trim === false ? text : text.trim();
  return options.collapseWhitespace === false ? trimmed : trimmed.replace(/\s+/g, ' ');
}

export function toIntegerV506(value, fallback = null) {
  if (value === null || value === undefined || value === '') return fallback;
  const number = Number.parseInt(String(value), 10);
  return Number.isFinite(number) ? number : fallback;
}

export function clampIntegerV506(value, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER, fallback = min) {
  const number = toIntegerV506(value, fallback);
  const safeNumber = Number.isFinite(number) ? number : fallback;
  return Math.min(max, Math.max(min, safeNumber));
}

export function uniqueSortedIntegersV506(values, options = {}) {
  const min = Number.isFinite(options.min) ? options.min : Number.MIN_SAFE_INTEGER;
  const max = Number.isFinite(options.max) ? options.max : Number.MAX_SAFE_INTEGER;
  const out = [];
  for (const value of Array.isArray(values) ? values : []) {
    const parsed = toIntegerV506(value, null);
    if (parsed === null || parsed < min || parsed > max) continue;
    out.push(parsed);
  }
  return Array.from(new Set(out)).sort((a, b) => a - b);
}

export function parseIntegerTokensV506(raw, options = {}) {
  const min = Number.isFinite(options.min) ? options.min : Number.MIN_SAFE_INTEGER;
  const max = Number.isFinite(options.max) ? options.max : Number.MAX_SAFE_INTEGER;
  const allowRanges = options.allowRanges !== false;
  const clamp = options.clamp !== false;
  const text = normalizeTextV506(raw, { collapseWhitespace: false });
  if (!text) return [];
  const values = [];
  const tokens = text.split(/[\s,;]+/).map((token) => token.trim()).filter(Boolean);
  tokens.forEach((token) => {
    const rangeMatch = allowRanges ? token.match(/^(\d{1,4})\s*-\s*(\d{1,4})$/) : null;
    if (rangeMatch) {
      const start = clamp ? clampIntegerV506(rangeMatch[1], min, max, min) : toIntegerV506(rangeMatch[1], null);
      const end = clamp ? clampIntegerV506(rangeMatch[2], min, max, min) : toIntegerV506(rangeMatch[2], null);
      if (start === null || end === null) return;
      const from = Math.min(start, end);
      const to = Math.max(start, end);
      for (let value = from; value <= to; value += 1) values.push(value);
      return;
    }
    const parsed = clamp ? clampIntegerV506(token, min, max, min) : toIntegerV506(token, null);
    if (parsed !== null) values.push(parsed);
  });
  return uniqueSortedIntegersV506(values, { min, max });
}

export function validateRequiredV506(value, label = 'Campo') {
  const normalized = normalizeTextV506(value);
  if (!normalized) return { ok: false, code: 'required', message: `${label} obbligatorio.` };
  return { ok: true, value: normalized };
}

export function validateIntegerRangeV506(value, options = {}) {
  const label = options.label || 'Valore';
  const min = Number.isFinite(options.min) ? options.min : Number.MIN_SAFE_INTEGER;
  const max = Number.isFinite(options.max) ? options.max : Number.MAX_SAFE_INTEGER;
  const parsed = toIntegerV506(value, null);
  if (parsed === null) return { ok: false, code: 'not_integer', message: `${label} deve essere un numero intero.` };
  if (parsed < min || parsed > max) return { ok: false, code: 'out_of_range', message: `${label} deve essere tra ${min} e ${max}.` };
  return { ok: true, value: parsed };
}

export function validateRangeOrderV506(fromValue, toValue, options = {}) {
  const min = Number.isFinite(options.min) ? options.min : Number.MIN_SAFE_INTEGER;
  const max = Number.isFinite(options.max) ? options.max : Number.MAX_SAFE_INTEGER;
  const from = clampIntegerV506(fromValue, min, max, min);
  const to = clampIntegerV506(toValue, min, max, max);
  return {
    ok: true,
    from: Math.min(from, to),
    to: Math.max(from, to),
    originalFrom: from,
    originalTo: to,
    swapped: from > to
  };
}

export function buildValidationSummaryV506(results = []) {
  const errors = results.filter((item) => item && item.ok === false);
  return {
    ok: errors.length === 0,
    errors,
    messages: errors.map((item) => item.message).filter(Boolean)
  };
}

export function getInputValueV506(idOrElement, doc = document) {
  const element = typeof idOrElement === 'string' ? doc.getElementById(idOrElement) : idOrElement;
  return element?.value ?? '';
}

export function setFieldMessageV506(idOrElement, message = '', options = {}) {
  const doc = options.document || document;
  const element = typeof idOrElement === 'string' ? doc.getElementById(idOrElement) : idOrElement;
  if (!element) return false;
  element.textContent = message || '';
  element.classList?.toggle?.(options.errorClass || 'is-error', Boolean(options.isError));
  return true;
}

export function escapeHtmlV506(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

export function installFormValidatorsV506(target = window) {
  const api = Object.freeze({
    version: FORM_VALIDATORS_VERSION_V506,
    normalizeText: normalizeTextV506,
    toInteger: toIntegerV506,
    clampInteger: clampIntegerV506,
    uniqueSortedIntegers: uniqueSortedIntegersV506,
    parseIntegerTokens: parseIntegerTokensV506,
    validateRequired: validateRequiredV506,
    validateIntegerRange: validateIntegerRangeV506,
    validateRangeOrder: validateRangeOrderV506,
    buildValidationSummary: buildValidationSummaryV506,
    getInputValue: getInputValueV506,
    setFieldMessage: setFieldMessageV506,
    escapeHtml: escapeHtmlV506
  });
  target.FantaEngineFormValidatorsV506 = api;
  return api;
}

if (typeof window !== 'undefined') {
  installFormValidatorsV506(window);
}
