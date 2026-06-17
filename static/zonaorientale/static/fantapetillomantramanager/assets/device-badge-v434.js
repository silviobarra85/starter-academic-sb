/* V434 - Badge dispositivo diagnostico.
   Rilevazione locale best-effort: i browser non espongono sempre il modello esatto.
   Non invia dati a server esterni. */
(function setupFantaPetilloDeviceBadgeV434() {
  const BADGE_ID = "fantaPetilloDeviceBadgeV434";
  const API_NAME = "FantaPetilloDeviceBadgeV434";

  function cleanText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function detectAppleTabletFromDesktopMode() {
    return /Macintosh|MacIntel/.test(navigator.platform || "") && Number(navigator.maxTouchPoints || 0) > 1;
  }

  function extractAndroidModel(userAgent) {
    const match = String(userAgent || "").match(/Android[^;]*;\s*([^;)]+?)(?:\s+Build\/|;|\))/i);
    if (!match) return "";
    const candidate = cleanText(match[1]);
    if (!candidate || /wv|mobile|chrome|safari|linux/i.test(candidate)) return "";
    return candidate;
  }

  function viewportLabel() {
    const width = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);
    if (!width) return "";
    if (width <= 520) return "mobile";
    if (width <= 900) return "tablet";
    return "desktop";
  }

  async function detectDevice() {
    const ua = navigator.userAgent || "";
    const platform = cleanText(navigator.userAgentData?.platform || navigator.platform || "");
    let model = "";
    let uaPlatform = platform;
    let mobile = false;

    try {
      if (navigator.userAgentData?.getHighEntropyValues) {
        const values = await navigator.userAgentData.getHighEntropyValues(["model", "platform", "mobile"]);
        model = cleanText(values.model);
        uaPlatform = cleanText(values.platform) || uaPlatform;
        mobile = Boolean(values.mobile);
      }
    } catch (_) {}

    if (!model) {
      if (/iPhone/i.test(ua)) model = "iPhone";
      else if (/iPad/i.test(ua) || detectAppleTabletFromDesktopMode()) model = "iPad";
      else if (/Android/i.test(ua)) model = extractAndroidModel(ua) || "Android";
      else if (/Macintosh|Mac OS X/i.test(ua) || /Mac/i.test(uaPlatform)) model = "Mac";
      else if (/Windows/i.test(ua) || /Win/i.test(uaPlatform)) model = "Windows PC";
      else if (/Linux/i.test(ua) || /Linux/i.test(uaPlatform)) model = "Linux";
      else model = uaPlatform || "Dispositivo";
    }

    const view = viewportLabel();
    const compact = cleanText(model);
    const detail = cleanText([model, view, mobile ? "touch" : ""].filter(Boolean).join(" · "));
    return { model: compact, detail, platform: uaPlatform, viewport: view, mobile };
  }

  function ensureBadge() {
    let badge = document.getElementById(BADGE_ID);
    if (badge) return badge;
    badge = document.createElement("aside");
    badge.id = BADGE_ID;
    badge.className = "zo-device-badge-v434";
    badge.setAttribute("role", "status");
    badge.setAttribute("aria-live", "polite");
    badge.innerHTML = '<span class="zo-device-badge-label-v434">Dispositivo</span><span class="zo-device-badge-value-v434">Rilevo...</span>';
    document.body.appendChild(badge);
    document.documentElement.classList.add("zo-device-badge-enabled-v434");
    return badge;
  }

  async function renderBadge() {
    if (!document.body) return;
    const badge = ensureBadge();
    const value = badge.querySelector(".zo-device-badge-value-v434");
    const data = await detectDevice();
    if (value) value.textContent = data.model || "Dispositivo";
    badge.title = `Dispositivo rilevato localmente: ${data.detail || data.model}. Il modello esatto dipende da cio' che il browser espone.`;
    return data;
  }

  function boot() {
    renderBadge();
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderBadge, 180);
    }, { passive: true });
  }

  window[API_NAME] = Object.freeze({
    version: "434",
    detectDevice,
    render: renderBadge,
    privacy: "local-only",
    note: "Il modello esatto e' best-effort: iOS/Safari spesso espongono solo iPhone/iPad."
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
