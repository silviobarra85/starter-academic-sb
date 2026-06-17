const DEFAULT_MOBILE_WIDTH = 900;
const DEFAULT_BUTTON_ID = "globalScrollTopBtnV218";
const DEFAULT_BUTTON_CLASS = "zo-scroll-top-v218";
const DEFAULT_DISPLAY_MODE_KEY = "fantaPetilloDisplayMode";

export function isSmartphoneViewportV220(options = {}) {
  const width = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);
  const maxWidth = Number(options.maxWidth || DEFAULT_MOBILE_WIDTH);
  const storageKey = options.displayModeStorageKey || DEFAULT_DISPLAY_MODE_KEY;
  const displayMode = localStorage.getItem(storageKey) || "auto";
  return displayMode !== "desktop" && width > 0 && width <= maxWidth;
}

export function getOrCreateGlobalScrollTopButtonV220(options = {}) {
  const buttonId = options.buttonId || DEFAULT_BUTTON_ID;
  let button = document.getElementById(buttonId);
  if (!button) {
    button = document.createElement("button");
    button.id = buttonId;
    button.className = options.buttonClass || DEFAULT_BUTTON_CLASS;
    button.type = "button";
    button.setAttribute("aria-label", options.ariaLabel || "Torna in cima alla pagina");
    button.innerHTML = options.innerHtml || '<span aria-hidden="true">↑</span><strong>Su</strong>';
    document.body.appendChild(button);
  }
  return button;
}

export function createMobileChromeControllerV220(options = {}) {
  const scrollThreshold = Number(options.scrollThreshold || 360);
  const buttonId = options.buttonId || DEFAULT_BUTTON_ID;
  const moreSheetId = options.moreSheetId || "mobileMoreSheet";
  const moreBackdropId = options.moreBackdropId || "mobileMoreBackdrop";
  const moreButtonId = options.moreButtonId || "mobileMoreBtn";
  const mobileSelectors = options.mobileSelectors || ".mobile-bottom-nav, .mobile-more-sheet, .mobile-more-backdrop, .mobile-page-subnav";

  function isSmartphone() {
    return isSmartphoneViewportV220(options);
  }

  function hideOpenMobileChromeIfDesktop(enabled) {
    if (enabled) return;
    document.getElementById(moreSheetId)?.classList.add("hidden");
    document.getElementById(moreBackdropId)?.classList.add("hidden");
    document.getElementById(moreButtonId)?.setAttribute("aria-expanded", "false");
    document.querySelectorAll(mobileSelectors).forEach((node) => {
      if (node.id === moreSheetId || node.id === moreBackdropId) {
        node.classList.add("hidden");
      }
    });
  }

  function updateScrollTopButton() {
    const button = document.getElementById(buttonId);
    if (!button) return;
    const show = isSmartphone() && window.scrollY > scrollThreshold;
    button.classList.toggle("is-visible", show);
    button.setAttribute("aria-hidden", show ? "false" : "true");
    button.tabIndex = show ? 0 : -1;
  }

  function enforceSmartphoneChrome() {
    const enabled = isSmartphone();
    const displayMode = localStorage.getItem(options.displayModeStorageKey || DEFAULT_DISPLAY_MODE_KEY) || "auto";
    document.body?.classList.toggle("is-mobile-ux", enabled);
    document.body?.classList.toggle("is-desktop-forced", !enabled && displayMode === "desktop");
    hideOpenMobileChromeIfDesktop(enabled);
    updateScrollTopButton();
  }

  function setupGlobalScrollTopButton() {
    const button = getOrCreateGlobalScrollTopButtonV220(options);
    if (button.dataset.boundV220 === "true") {
      updateScrollTopButton();
      return;
    }
    button.dataset.boundV220 = "true";
    button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", updateScrollTopButton, { passive: true });
    window.addEventListener("resize", enforceSmartphoneChrome, { passive: true });
    window.addEventListener("orientationchange", enforceSmartphoneChrome, { passive: true });
    enforceSmartphoneChrome();
  }

  return {
    isSmartphone,
    updateScrollTopButton,
    enforceSmartphoneChrome,
    setupGlobalScrollTopButton
  };
}

export function setupMobileChromeV220(options = {}) {
  const controller = createMobileChromeControllerV220(options);
  controller.setupGlobalScrollTopButton();
  return controller;
}
