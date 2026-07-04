const UI_VERSION_V496 = 'V496';

function toArrayV496(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : Array.from(value);
}

function safeQueryAllV496(root, selector) {
  try {
    return toArrayV496(root?.querySelectorAll?.(selector));
  } catch (error) {
    console.warn('Fanta UI V496 query non valida.', selector, error);
    return [];
  }
}

function setTextForSelectorV496(doc, selector, text) {
  if (text === undefined || text === null || !selector) return 0;
  let count = 0;
  safeQueryAllV496(doc, selector).forEach((element) => {
    element.textContent = String(text);
    count += 1;
  });
  return count;
}

function setHtmlForSelectorV496(doc, selector, html) {
  if (html === undefined || html === null || !selector) return 0;
  let count = 0;
  safeQueryAllV496(doc, selector).forEach((element) => {
    element.innerHTML = String(html);
    count += 1;
  });
  return count;
}

function setMetaContentV496(doc, selector, value) {
  if (!value || !selector) return false;
  const element = doc?.head?.querySelector?.(selector);
  if (!element) return false;
  element.setAttribute('content', String(value));
  return true;
}

function setCanonicalV496(doc, value) {
  if (!value || !doc?.head) return false;
  let element = doc.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = doc.createElement('link');
    element.setAttribute('rel', 'canonical');
    doc.head.appendChild(element);
  }
  element.setAttribute('href', String(value));
  return true;
}

function formatTemplateV496(template, tokens = {}) {
  return String(template || '').replace(/\{([a-zA-Z0-9_.-]+)\}/g, (match, key) => {
    const value = tokens[key];
    return value === undefined || value === null ? match : String(value);
  });
}

const DEFAULT_ICON_MAP_V496 = Object.freeze({
  dashboard: '🏠', home: '🏠', news: '📰', teams: '👥', clubs: '👥', fm: '💰', market: '🔁',
  trophy: '🏆', honor: '🏛️', stats: '📊', archive: '🗂️', compare: '⚔️', dice: '🎲',
  rules: '📘', regolamento: '📘', admin: '⚙️', team: '👕', list: '📋', listone: '📋',
  bilanci: '💰', calciomercato: '📰', fantamercato: '🔁'
});

function normalizeIconV496(icon, id = '', iconMap = DEFAULT_ICON_MAP_V496) {
  const value = String(icon || '').trim();
  if (!value) return iconMap[id] || DEFAULT_ICON_MAP_V496[id] || '';
  return iconMap[value] || DEFAULT_ICON_MAP_V496[value] || value;
}

function hasExternalSchemeV496(value) {
  return /^[a-z][a-z0-9+.-]*:/i.test(String(value || ''));
}

function resolveHashHrefV496(href = '#dashboard', options = {}) {
  const value = String(href || '#dashboard');
  if (hasExternalSchemeV496(value) || value.startsWith('./') || value.startsWith('../') || value.startsWith('/')) return value;
  const pageId = options.pageId || options.detectPageId?.(options.document, options.window) || '';
  const standalone = pageId && pageId !== 'home';
  return standalone && value.startsWith('#') ? `./${value}` : value;
}

function setElementVisibilityV496(element, visible, displayValue = '') {
  if (!element) return false;
  element.hidden = !visible;
  element.setAttribute('aria-hidden', visible ? 'false' : 'true');
  if (element.style) element.style.display = visible ? displayValue : 'none';
  return true;
}

function ensureToastHostV496(doc = document) {
  let host = doc.getElementById('fanta-ui-toast-host-v496');
  if (host) return host;
  host = doc.createElement('div');
  host.id = 'fanta-ui-toast-host-v496';
  host.setAttribute('data-fanta-ui-v496', 'toast-host');
  host.setAttribute('aria-live', 'polite');
  host.style.position = 'fixed';
  host.style.right = '16px';
  host.style.bottom = '16px';
  host.style.zIndex = '9999';
  host.style.display = 'grid';
  host.style.gap = '8px';
  doc.body?.appendChild(host);
  return host;
}

function showToastV496(message, options = {}) {
  const doc = options.document || document;
  const host = ensureToastHostV496(doc);
  const toast = doc.createElement('div');
  toast.setAttribute('role', 'status');
  toast.setAttribute('data-fanta-ui-v496', 'toast');
  toast.textContent = String(message || 'Operazione completata.');
  toast.style.maxWidth = '320px';
  toast.style.padding = '10px 12px';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 12px 30px rgba(15, 23, 42, .18)';
  toast.style.background = options.background || 'rgba(15, 23, 42, .94)';
  toast.style.color = options.color || '#fff';
  toast.style.fontSize = '14px';
  host.appendChild(toast);
  const timeout = Number(options.timeout || 3500);
  if (timeout > 0) setTimeout(() => toast.remove(), timeout);
  return toast;
}

function installFantaUiV496(options = {}) {
  const win = options.window || window;
  const doc = options.document || document;
  const api = Object.freeze({
    version: UI_VERSION_V496,
    safeQueryAll: safeQueryAllV496,
    setTextForSelector: (selector, text) => setTextForSelectorV496(doc, selector, text),
    setHtmlForSelector: (selector, html) => setHtmlForSelectorV496(doc, selector, html),
    setMetaContent: (selector, value) => setMetaContentV496(doc, selector, value),
    setCanonical: (value) => setCanonicalV496(doc, value),
    formatTemplate: formatTemplateV496,
    normalizeIcon: normalizeIconV496,
    resolveHashHref: (href, extra = {}) => resolveHashHrefV496(href, { document: doc, window: win, ...extra }),
    setElementVisibility: setElementVisibilityV496,
    showToast: (message, extra = {}) => showToastV496(message, { document: doc, ...extra })
  });
  if (win) win.FantaEngineUIV496 = api;
  return api;
}

export {
  UI_VERSION_V496,
  DEFAULT_ICON_MAP_V496,
  safeQueryAllV496,
  setTextForSelectorV496,
  setHtmlForSelectorV496,
  setMetaContentV496,
  setCanonicalV496,
  formatTemplateV496,
  normalizeIconV496,
  resolveHashHrefV496,
  setElementVisibilityV496,
  ensureToastHostV496,
  showToastV496,
  installFantaUiV496
};
