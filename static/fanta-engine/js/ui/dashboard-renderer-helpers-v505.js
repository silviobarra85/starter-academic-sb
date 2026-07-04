const DASHBOARD_RENDERER_HELPERS_VERSION_V505 = 'V505';

function defaultEscapeHtmlV505(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function normalizeTokenV505(value, fallback = '') {
  const token = String(value || '').trim();
  return token || fallback;
}

function normalizeFeatureCardIdV505(value) {
  return normalizeTokenV505(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function asClassListV505(value) {
  if (!value) return [];
  const items = Array.isArray(value) ? value : String(value).split(/\s+/);
  return items.map((item) => String(item || '').trim()).filter(Boolean);
}

function buildDataAttributesV505(attributes = {}, escapeHtml = defaultEscapeHtmlV505) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey) return '';
      const attrName = normalizedKey.startsWith('data-')
        ? normalizedKey
        : `data-${normalizedKey.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;
      const attrValue = value === true ? 'true' : String(value);
      return `${attrName}="${escapeHtml(attrValue)}"`;
    })
    .filter(Boolean)
    .join(' ');
}

function createPanelHeaderV505({ eyebrow = '', title = '', description = '', actionsHtml = '', compact = false, escapeHtml = defaultEscapeHtmlV505 } = {}) {
  const headerClass = compact ? 'panel-header compact' : 'panel-header';
  return `
      <div class="${headerClass}">
        <div>
          ${eyebrow ? `<p class="eyebrow">${escapeHtml(eyebrow)}</p>` : ''}
          ${title ? `<h2>${escapeHtml(title)}</h2>` : ''}
          ${description ? `<p>${escapeHtml(description)}</p>` : ''}
        </div>
        ${actionsHtml ? `<div class="panel-actions">${actionsHtml}</div>` : ''}
      </div>`;
}

function renderCollapsiblePanelV505({
  panelId,
  eyebrow = '',
  title = '',
  description = '',
  bodyHtml = '',
  collapsed = false,
  panelClass = 'panel admin-collapsible-panel',
  toggleAttribute = 'data-admin-toggle-panel',
  toggleLabelOpen = 'Apri',
  toggleLabelClose = 'Riduci',
  featureCardId = '',
  visibility = 'admin',
  category = 'admin',
  extraClasses = [],
  extraData = {},
  escapeHtml = defaultEscapeHtmlV505
} = {}) {
  const safePanelId = normalizeTokenV505(panelId, normalizeFeatureCardIdV505(title || eyebrow || 'dashboard-panel'));
  const featureId = normalizeFeatureCardIdV505(featureCardId || safePanelId);
  const classes = [panelClass, ...asClassListV505(extraClasses), collapsed ? 'is-collapsed' : '']
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  const dataAttrs = buildDataAttributesV505({
    featureCardId: featureId,
    dashboardRendererV505: DASHBOARD_RENDERER_HELPERS_VERSION_V505,
    dashboardRendererVisibilityV505: visibility,
    dashboardRendererCategoryV505: category,
    ...extraData
  }, escapeHtml);
  const toggle = `<button class="button button-secondary button-small" type="button" ${toggleAttribute}="${escapeHtml(safePanelId)}">${escapeHtml(collapsed ? toggleLabelOpen : toggleLabelClose)}</button>`;
  return `
    <article class="${escapeHtml(classes)}" id="${escapeHtml(safePanelId)}" ${dataAttrs}>
      ${createPanelHeaderV505({ eyebrow, title, description, actionsHtml: toggle, escapeHtml })}
      ${bodyHtml}
    </article>`;
}

function renderDashboardActionCardV505({
  id = '',
  featureCardId = '',
  eyebrow = '',
  title = '',
  description = '',
  bodyHtml = '',
  actionsHtml = '',
  className = 'panel dashboard-action-card',
  visibility = 'authenticated',
  category = 'dashboard',
  escapeHtml = defaultEscapeHtmlV505
} = {}) {
  const safeId = normalizeTokenV505(id, normalizeFeatureCardIdV505(featureCardId || title || 'dashboard-action-card'));
  const featureId = normalizeFeatureCardIdV505(featureCardId || safeId);
  const dataAttrs = buildDataAttributesV505({
    featureCardId: featureId,
    dashboardRendererV505: DASHBOARD_RENDERER_HELPERS_VERSION_V505,
    dashboardRendererVisibilityV505: visibility,
    dashboardRendererCategoryV505: category
  }, escapeHtml);
  return `
    <article class="${escapeHtml(className)}" id="${escapeHtml(safeId)}" ${dataAttrs}>
      ${createPanelHeaderV505({ eyebrow, title, description, actionsHtml, compact: true, escapeHtml })}
      ${bodyHtml}
    </article>`;
}

function renderMetricCardV505({ label = '', value = '', hint = '', className = 'metric-card', escapeHtml = defaultEscapeHtmlV505 } = {}) {
  return `<article class="${escapeHtml(className)}"><span class="metric-label">${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${hint ? `<small>${escapeHtml(hint)}</small>` : ''}</article>`;
}

function decorateDashboardCardElementV505(element, { featureCardId = '', visibility = '', category = '', renderer = 'V505' } = {}) {
  if (!element) return null;
  if (featureCardId) element.dataset.featureCardId = normalizeFeatureCardIdV505(featureCardId);
  element.dataset.dashboardRendererV505 = renderer || DASHBOARD_RENDERER_HELPERS_VERSION_V505;
  if (visibility) element.dataset.dashboardRendererVisibilityV505 = String(visibility);
  if (category) element.dataset.dashboardRendererCategoryV505 = String(category);
  return element;
}

function installDashboardRendererHelpersV505(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const escapeHtml = typeof options.escapeHtml === 'function' ? options.escapeHtml : defaultEscapeHtmlV505;
  const api = Object.freeze({
    version: DASHBOARD_RENDERER_HELPERS_VERSION_V505,
    escapeHtml,
    createPanelHeader: (props = {}) => createPanelHeaderV505({ ...props, escapeHtml: props.escapeHtml || escapeHtml }),
    renderCollapsiblePanel: (props = {}) => renderCollapsiblePanelV505({ ...props, escapeHtml: props.escapeHtml || escapeHtml }),
    renderDashboardActionCard: (props = {}) => renderDashboardActionCardV505({ ...props, escapeHtml: props.escapeHtml || escapeHtml }),
    renderMetricCard: (props = {}) => renderMetricCardV505({ ...props, escapeHtml: props.escapeHtml || escapeHtml }),
    decorateDashboardCardElement: decorateDashboardCardElementV505,
    normalizeFeatureCardId: normalizeFeatureCardIdV505
  });
  if (win) {
    win.FantaEngineDashboardRendererHelpersV505 = api;
    win.FantaEngineDashboardRendererHelpersRuntimeV505 = api;
  }
  return api;
}

export {
  DASHBOARD_RENDERER_HELPERS_VERSION_V505,
  buildDataAttributesV505,
  createPanelHeaderV505,
  decorateDashboardCardElementV505,
  defaultEscapeHtmlV505,
  installDashboardRendererHelpersV505,
  normalizeFeatureCardIdV505,
  renderCollapsiblePanelV505,
  renderDashboardActionCardV505,
  renderMetricCardV505
};
