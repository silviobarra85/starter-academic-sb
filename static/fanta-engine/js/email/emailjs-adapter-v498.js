// V498 - FantaEngine EmailJS adapter comune.
// Centralizza validazione, normalizzazione payload, invio API e fallback mailto.
// I valori sensibili/lega-specifici restano nei singoli assets/emailjs.js o in league-config.json.
export const EMAILJS_ADAPTER_VERSION_V498 = 'V498';

const PLACEHOLDER_VALUES_V498 = new Set([
  '',
  'YOUR_PUBLIC_KEY',
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  'undefined',
  'null'
]);

function cleanStringV498(value) {
  return String(value ?? '').trim();
}

function isUsableEmailJsValueV498(value) {
  const clean = cleanStringV498(value);
  return Boolean(clean && !PLACEHOLDER_VALUES_V498.has(clean));
}

export function buildEmailJsConfigV498(config = {}) {
  const publicKey = cleanStringV498(config.publicKey || config.userId || config.EMAILJS_PUBLIC_KEY);
  const serviceId = cleanStringV498(config.serviceId || config.EMAILJS_SERVICE_ID);
  const templateId = cleanStringV498(config.templateId || config.defaultTemplateId || config.EMAILJS_TEMPLATE_ID);
  const templates = {
    ...(config.templates || {}),
    default: cleanStringV498((config.templates || {}).default || templateId)
  };
  const flowTemplateMap = { ...(config.flowTemplateMap || {}) };
  return Object.freeze({
    version: EMAILJS_ADAPTER_VERSION_V498,
    leagueId: cleanStringV498(config.leagueId),
    publicKey,
    serviceId,
    templateId,
    templates,
    flowTemplateMap,
    endpoint: cleanStringV498(config.endpoint || 'https://api.emailjs.com/api/v1.0/email/send'),
    defaultRecipient: cleanStringV498(config.defaultRecipient),
    defaultFlow: cleanStringV498(config.defaultFlow || 'default'),
    fallbackSubject: cleanStringV498(config.fallbackSubject || 'Comunicazione fantacalcio')
  });
}

export function isEmailJsConfiguredV498(config = {}) {
  const normalized = config.version === EMAILJS_ADAPTER_VERSION_V498 ? config : buildEmailJsConfigV498(config);
  return Boolean(
    isUsableEmailJsValueV498(normalized.publicKey) &&
    isUsableEmailJsValueV498(normalized.serviceId) &&
    isUsableEmailJsValueV498(normalized.templateId)
  );
}

export function normalizeEmailJsPayloadV498(templateParams = {}, config = {}) {
  const normalized = config.version === EMAILJS_ADAPTER_VERSION_V498 ? config : buildEmailJsConfigV498(config);
  const {
    __service_id: serviceOverride,
    __template_id: templateOverride,
    __emailjs_flow: flowOverride,
    ...cleanParams
  } = templateParams || {};
  const flow = cleanStringV498(flowOverride || normalized.defaultFlow || 'default');
  const mappedTemplate = cleanStringV498(normalized.flowTemplateMap?.[flow] || normalized.templates?.[flow]);
  const templateId = cleanStringV498(templateOverride || mappedTemplate || normalized.templateId || normalized.templates?.default);
  const serviceId = cleanStringV498(serviceOverride || normalized.serviceId);
  const params = { ...cleanParams };
  if (normalized.defaultRecipient && !params.to_email && !params.to_name) {
    params.to_email = normalized.defaultRecipient;
  }
  return Object.freeze({
    serviceId,
    templateId,
    flow,
    params
  });
}

export function buildEmailJsRequestBodyV498(config = {}, templateParams = {}) {
  const normalized = config.version === EMAILJS_ADAPTER_VERSION_V498 ? config : buildEmailJsConfigV498(config);
  const payload = normalizeEmailJsPayloadV498(templateParams, normalized);
  return Object.freeze({
    service_id: payload.serviceId,
    template_id: payload.templateId,
    user_id: normalized.publicKey,
    template_params: payload.params
  });
}

export async function sendEmailJsTemplateV498(config = {}, templateParams = {}, options = {}) {
  const normalized = config.version === EMAILJS_ADAPTER_VERSION_V498 ? config : buildEmailJsConfigV498(config);
  if (!isEmailJsConfiguredV498(normalized)) {
    throw new Error('EmailJS non configurato. Verifica public key, service ID e template ID negli assets della lega.');
  }
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== 'function') {
    throw new Error('Fetch API non disponibile: impossibile inviare EmailJS.');
  }
  const body = buildEmailJsRequestBodyV498(normalized, templateParams);
  const response = await fetchImpl(normalized.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Invio EmailJS non riuscito (${response.status}). ${text}`.trim());
  }
  return response;
}

export function buildEmailJsMailtoFallbackV498(config = {}, templateParams = {}) {
  const normalized = config.version === EMAILJS_ADAPTER_VERSION_V498 ? config : buildEmailJsConfigV498(config);
  const payload = normalizeEmailJsPayloadV498(templateParams, normalized);
  const params = payload.params || {};
  const to = cleanStringV498(params.to_email || normalized.defaultRecipient);
  const subject = cleanStringV498(params.subject || params.title || normalized.fallbackSubject);
  const body = cleanStringV498(params.message || params.body || params.text || '');
  const query = new URLSearchParams();
  if (subject) query.set('subject', subject);
  if (body) query.set('body', body);
  return `mailto:${encodeURIComponent(to)}${query.toString() ? `?${query.toString()}` : ''}`;
}

export function createEmailJsSenderV498(config = {}) {
  const normalized = buildEmailJsConfigV498(config);
  return Object.freeze({
    version: EMAILJS_ADAPTER_VERSION_V498,
    config: normalized,
    isConfigured: () => isEmailJsConfiguredV498(normalized),
    normalize: (templateParams = {}) => normalizeEmailJsPayloadV498(templateParams, normalized),
    requestBody: (templateParams = {}) => buildEmailJsRequestBodyV498(normalized, templateParams),
    send: (templateParams = {}, options = {}) => sendEmailJsTemplateV498(normalized, templateParams, options),
    buildMailtoFallback: (templateParams = {}) => buildEmailJsMailtoFallbackV498(normalized, templateParams)
  });
}

if (typeof window !== 'undefined') {
  window.FantaEngineEmailJsAdapterV498 = Object.freeze({
    version: EMAILJS_ADAPTER_VERSION_V498,
    buildEmailJsConfigV498,
    isEmailJsConfiguredV498,
    normalizeEmailJsPayloadV498,
    buildEmailJsRequestBodyV498,
    sendEmailJsTemplateV498,
    buildEmailJsMailtoFallbackV498,
    createEmailJsSenderV498
  });
}
