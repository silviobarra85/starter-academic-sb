import { createEmailJsSenderV498 } from '../../fanta-engine/js/email/emailjs-adapter-v498.js';

export const EMAILJS_PUBLIC_KEY = "Rl3BRmJx1IeJEqQAH";
export const EMAILJS_SERVICE_ID = "service_ttjf7js";
export const EMAILJS_TEMPLATE_ID = "template_e1o7z5e";
export const EMAILJS_TRANSFER_TEMPLATE_ID = "template_svkkhlr";
export const EMAILJS_DEFAULT_RECIPIENT = "barra.silvio@gmail.com";

const emailJsSenderV498 = createEmailJsSenderV498({
  leagueId: 'fantapetillomantramanager',
  publicKey: EMAILJS_PUBLIC_KEY,
  serviceId: EMAILJS_SERVICE_ID,
  templateId: EMAILJS_TEMPLATE_ID,
  templates: {
    default: EMAILJS_TEMPLATE_ID,
    releasePlayers: EMAILJS_TEMPLATE_ID,
    tradeAnnouncement: EMAILJS_TRANSFER_TEMPLATE_ID,
    comunicatoAvvenutoScambio: EMAILJS_TRANSFER_TEMPLATE_ID
  },
  flowTemplateMap: {
    svincola_giocatori_v478: EMAILJS_TEMPLATE_ID,
    comunicato_avvenuto_scambio_v478: EMAILJS_TRANSFER_TEMPLATE_ID
  },
  defaultRecipient: EMAILJS_DEFAULT_RECIPIENT,
  defaultFlow: 'default',
  fallbackSubject: 'Comunicazione FantaMantraManager'
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
