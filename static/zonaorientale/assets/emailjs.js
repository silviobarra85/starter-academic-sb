export const EMAILJS_PUBLIC_KEY = "Rl3BRmJx1IeJEqQAH";
export const EMAILJS_SERVICE_ID = "service_trz4dxe";
export const EMAILJS_TEMPLATE_ID = "template_e1o7z5e5e";

export function isEmailJsConfigured() {
  return Boolean(
    EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" &&
    EMAILJS_SERVICE_ID && EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
    EMAILJS_TEMPLATE_ID && EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID"
  );
}

export async function sendTransferEmail(templateParams) {
  if (!isEmailJsConfigured()) {
    throw new Error("EmailJS non configurato. Inserisci public key, service ID e template ID in assets/emailjs.js.");
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams
    })
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Invio EmailJS non riuscito (${response.status}). ${text}`.trim());
  }
}
