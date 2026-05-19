/* Adaptive mobile viewport sizing.
   Adds viewport-aware classes and CSS variables so the mobile UI can adapt to
   small phones, tall phones, landscape mode and browser UI changes. */
export function setupAdaptiveMobileViewport({ getUpdateMobileUxClass, setUpdateMobileUxClass } = {}) {
  let scheduled = false;

  function getViewportSize() {
    // Use the layout viewport for layout decisions. visualViewport changes during
    // pinch-zoom and could remove/move the bottom menu.
    const width = Math.round(window.innerWidth || document.documentElement.clientWidth || 0);
    const height = Math.round(window.innerHeight || document.documentElement.clientHeight || 0);
    const visualWidth = Math.round(window.visualViewport?.width || width);
    const visualHeight = Math.round(window.visualViewport?.height || height);
    return { width, height, visualWidth, visualHeight };
  }

  function setBoolClass(element, className, enabled) {
    element.classList.toggle(className, Boolean(enabled));
  }

  function applyViewportSizing() {
    scheduled = false;

    const { width, height, visualWidth, visualHeight } = getViewportSize();
    const root = document.documentElement;
    const body = document.body;
    if (!body || !width || !height) return;

    const displayMode = localStorage.getItem("zonaOrientaleDisplayMode") || "auto";
    const mediaMobile = window.matchMedia("(max-width: 900px), (hover: none) and (pointer: coarse)").matches;
    const coarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile|SamsungBrowser/i.test(navigator.userAgent || "");
    const isMobile = displayMode !== "desktop" && (mediaMobile || coarsePointer || mobileUserAgent || width <= 900);
    const isLandscape = width > height;

    const sizeName = width <= 360 ? "xs" : width <= 430 ? "sm" : width <= 768 ? "md" : "lg";
    const heightName = height <= 620 ? "short" : height <= 780 ? "regular" : "tall";

    const navInset = sizeName === "xs" ? 6 : sizeName === "sm" ? 8 : 10;
    const navPadding = sizeName === "xs" ? 6 : sizeName === "sm" ? 7 : 8;
    const navGap = sizeName === "xs" ? 4 : 6;
    const navRadius = sizeName === "xs" ? 18 : 24;
    const navFont = sizeName === "xs" ? 0.58 : sizeName === "sm" ? 0.64 : 0.7;
    const navIcon = sizeName === "xs" ? 0.92 : sizeName === "sm" ? 1.0 : 1.08;
    const navHeight = sizeName === "xs" ? 66 : sizeName === "sm" ? 72 : 78;

    const visibleRows = heightName === "short" ? 8 : heightName === "regular" ? 9 : 10;
    const rowHeight = sizeName === "xs" ? 30 : sizeName === "sm" ? 32 : 34;
    const headerHeight = sizeName === "xs" ? 30 : 34;
    const tableMaxHeight = Math.min(
      Math.round(height * (isLandscape ? 0.5 : 0.58)),
      headerHeight + rowHeight * visibleRows
    );

    root.style.setProperty("--viewport-width", `${width}px`);
    root.style.setProperty("--viewport-height", `${height}px`);
    root.style.setProperty("--visual-viewport-width", `${visualWidth}px`);
    root.style.setProperty("--visual-viewport-height", `${visualHeight}px`);
    root.style.setProperty("--mobile-nav-inset", `${navInset}px`);
    root.style.setProperty("--mobile-nav-padding", `${navPadding}px`);
    root.style.setProperty("--mobile-nav-gap", `${navGap}px`);
    root.style.setProperty("--mobile-nav-radius", `${navRadius}px`);
    root.style.setProperty("--mobile-nav-font-size", `${navFont}rem`);
    root.style.setProperty("--mobile-nav-icon-size", `${navIcon}rem`);
    root.style.setProperty("--mobile-nav-height", `${navHeight}px`);
    root.style.setProperty("--mobile-table-visible-rows", String(visibleRows));
    root.style.setProperty("--mobile-table-row-height", `${rowHeight}px`);
    root.style.setProperty("--mobile-table-max-height", `${tableMaxHeight}px`);

    setBoolClass(body, "is-mobile-ux", isMobile);
    setBoolClass(body, "is-desktop-forced", displayMode === "desktop");
    setBoolClass(body, "screen-xs", isMobile && sizeName === "xs");
    setBoolClass(body, "screen-sm", isMobile && sizeName === "sm");
    setBoolClass(body, "screen-md-mobile", isMobile && sizeName === "md");
    setBoolClass(body, "screen-lg-mobile", isMobile && sizeName === "lg");
    setBoolClass(body, "screen-short", isMobile && heightName === "short");
    setBoolClass(body, "screen-regular", isMobile && heightName === "regular");
    setBoolClass(body, "screen-tall", isMobile && heightName === "tall");
    setBoolClass(body, "screen-landscape", isMobile && isLandscape);
    body.dataset.viewportWidth = String(width);
    body.dataset.viewportHeight = String(height);

    document.querySelectorAll("[data-display-mode-toggle]").forEach((button) => {
      button.textContent = displayMode === "desktop" ? "Passa a vista mobile" : "Passa a vista desktop";
    });
  }

  function scheduleViewportSizing() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(applyViewportSizing);
  }

  const previousUpdateMobileUxClass = typeof getUpdateMobileUxClass === "function" ? getUpdateMobileUxClass() : null;
  if (typeof previousUpdateMobileUxClass === "function" && typeof setUpdateMobileUxClass === "function") {
    setUpdateMobileUxClass(function updateMobileUxClassV46() {
      previousUpdateMobileUxClass();
      scheduleViewportSizing();
    });
  }

  window.addEventListener("resize", scheduleViewportSizing, { passive: true });
  window.addEventListener("orientationchange", scheduleViewportSizing, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleViewportSizing, { passive: true });
  // Do not react to visualViewport scroll: during pinch-zoom it can make fixed UI jump/disappear.
  document.addEventListener("DOMContentLoaded", scheduleViewportSizing);
  window.addEventListener("load", scheduleViewportSizing);
  scheduleViewportSizing();
}
