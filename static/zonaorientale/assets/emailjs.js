import { createEmailJsSenderV498 } from '../../fanta-engine/js/email/emailjs-adapter-v498.js';

export const EMAILJS_PUBLIC_KEY = "Rl3BRmJx1IeJEqQAH";
export const EMAILJS_SERVICE_ID = "service_trz4dxe";
export const EMAILJS_TEMPLATE_ID = "template_e1o7z5e";

const emailJsSenderV498 = createEmailJsSenderV498({
  leagueId: 'zonaorientale',
  publicKey: EMAILJS_PUBLIC_KEY,
  serviceId: EMAILJS_SERVICE_ID,
  templateId: EMAILJS_TEMPLATE_ID,
  templates: {
    default: EMAILJS_TEMPLATE_ID,
    transfer: EMAILJS_TEMPLATE_ID,
    operational: EMAILJS_TEMPLATE_ID
  },
  defaultFlow: 'default',
  fallbackSubject: 'Comunicazione ZonaOrientale Salerno'
});

export function isEmailJsConfigured() {
  return emailJsSenderV498.isConfigured();
}

export function normalizeEmailJsPayload(templateParams = {}) {
  return emailJsSenderV498.normalize(templateParams);
}

export function buildEmailJsMailtoFallback(templateParams = {}) {
  return emailJsSenderV498.buildMailtoFallback(templateParams);
}

export async function sendTransferEmail(templateParams) {
  return emailJsSenderV498.send(templateParams);
}
