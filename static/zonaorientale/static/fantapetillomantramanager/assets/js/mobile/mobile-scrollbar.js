/* Mobile-only page scroll handle.
   Adds a small draggable scrollbar on long mobile pages without changing desktop. */
export function ensureMobilePageScrollHandle() {
  if (!document.body || document.getElementById("mobilePageScrollRail")) return;

  const rail = document.createElement("div");
  rail.id = "mobilePageScrollRail";
  rail.className = "mobile-page-scroll-rail";
  rail.setAttribute("aria-hidden", "true");
  rail.innerHTML = '<div class="mobile-page-scroll-thumb"></div>';
  document.body.appendChild(rail);

  const thumb = rail.querySelector(".mobile-page-scroll-thumb");
  let isDragging = false;
  let dragOffset = 0;

  function isEnabled() {
    const isMobileLike = window.matchMedia("(max-width: 900px), (hover: none) and (pointer: coarse)").matches;
    const displayMode = localStorage.getItem("fantaPetilloDisplayMode") || "auto";
    return isMobileLike && displayMode !== "desktop";
  }

  function getMetrics() {
    const documentElement = document.documentElement;
    const scrollHeight = Math.max(documentElement.scrollHeight, document.body.scrollHeight);
    const viewportHeight = window.innerHeight || documentElement.clientHeight || 1;
    const maxScroll = Math.max(0, scrollHeight - viewportHeight);
    const railRect = rail.getBoundingClientRect();
    const railHeight = Math.max(1, railRect.height);
    const minThumb = 38;
    const thumbHeight = Math.max(minThumb, Math.min(railHeight, (viewportHeight / Math.max(scrollHeight, viewportHeight)) * railHeight));
    const maxThumbTop = Math.max(0, railHeight - thumbHeight);
    return { maxScroll, railHeight, thumbHeight, maxThumbTop, railTop: railRect.top };
  }

  function update() {
    const enabled = isEnabled();
    const metrics = getMetrics();
    const canScroll = enabled && metrics.maxScroll > 24;
    document.body.classList.toggle("mobile-page-scroll-enabled", canScroll);
    if (!thumb || !canScroll) return;

    const ratio = metrics.maxScroll ? (window.scrollY || window.pageYOffset || 0) / metrics.maxScroll : 0;
    const top = Math.max(0, Math.min(metrics.maxThumbTop, ratio * metrics.maxThumbTop));
    thumb.style.height = `${metrics.thumbHeight}px`;
    thumb.style.transform = `translateY(${top}px)`;
  }

  function scrollToClientY(clientY, offset = 0) {
    const metrics = getMetrics();
    if (!metrics.maxScroll || !metrics.maxThumbTop) return;
    const top = Math.max(0, Math.min(metrics.maxThumbTop, clientY - metrics.railTop - offset));
    const ratio = top / metrics.maxThumbTop;
    window.scrollTo({ top: ratio * metrics.maxScroll, behavior: "auto" });
  }

  function startDrag(event) {
    if (!document.body.classList.contains("mobile-page-scroll-enabled")) return;
    const metrics = getMetrics();
    const thumbRect = thumb?.getBoundingClientRect();
    isDragging = true;
    dragOffset = thumbRect && thumbRect.top <= event.clientY && event.clientY <= thumbRect.bottom
      ? event.clientY - thumbRect.top
      : metrics.thumbHeight / 2;
    scrollToClientY(event.clientY, dragOffset);
    rail.classList.add("is-dragging");
    rail.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  function moveDrag(event) {
    if (!isDragging) return;
    scrollToClientY(event.clientY, dragOffset);
    event.preventDefault();
  }

  function endDrag(event) {
    if (!isDragging) return;
    isDragging = false;
    rail.classList.remove("is-dragging");
    rail.releasePointerCapture?.(event.pointerId);
  }

  rail.addEventListener("pointerdown", startDrag);
  rail.addEventListener("pointermove", moveDrag);
  rail.addEventListener("pointerup", endDrag);
  rail.addEventListener("pointercancel", endDrag);

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("orientationchange", () => setTimeout(update, 200));

  if (window.ResizeObserver) {
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
  }

  const mutationObserver = new MutationObserver(() => window.requestAnimationFrame(update));
  mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true });

  update();
}
