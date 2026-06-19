export const EMAILJS_PUBLIC_KEY = "Rl3BRmJx1IeJEqQAH";
export const EMAILJS_SERVICE_ID = "service_ttjf7js";
export const EMAILJS_TEMPLATE_ID = "template_e1o7z5e";
export const EMAILJS_TRANSFER_TEMPLATE_ID = "template_svkkhlr";
export const EMAILJS_DEFAULT_RECIPIENT = "barra.silvio@gmail.com";

export function isEmailJsConfigured() {
  return Boolean(
    EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
    EMAILJS_SERVICE_ID && EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
    EMAILJS_TEMPLATE_ID && EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID"
  );
}

function normalizeEmailJsPayload(templateParams = {}) {
  const {
    __service_id: serviceId,
    __template_id: templateId,
    __emailjs_flow: flow,
    ...cleanParams
  } = templateParams || {};
  return {
    serviceId: serviceId || EMAILJS_SERVICE_ID,
    templateId: templateId || EMAILJS_TEMPLATE_ID,
    flow: flow || "default",
    params: cleanParams
  };
}

export async function sendTransferEmail(templateParams) {
  if (!isEmailJsConfigured()) {
    throw new Error("EmailJS non configurato. Inserisci public key, service ID e template ID in assets/emailjs.js.");
  }

  const payload = normalizeEmailJsPayload(templateParams);
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: payload.serviceId,
      template_id: payload.templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: payload.params
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Invio EmailJS non riuscito (${response.status}). ${text}`.trim());
  }
}
