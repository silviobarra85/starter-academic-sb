(function adminCardVisibilityV456() {
  "use strict";

  const VERSION = "456";
  const CONTROL_ID = "adminCardSelectorV456";
  const CONTROL_MOUNT_ID = "adminTopControlsMountV313";
  const CHECKLIST_ID = "manualQaPanelV358";
  const LEGACY_CONTROL_IDS = ["adminCardSelectorV454", "adminCardSelectorV455"];
  const LEGACY_CLASSES = [
    "admin-card-hidden-v454",
    "admin-category-empty-v454",
    "admin-qa-hidden-v454",
    "admin-card-hidden-v455",
    "admin-category-empty-v455",
    "admin-publication-dashboard-empty-v455",
    "admin-qa-hidden-v455"
  ];
  const SLUG = (window.location.pathname.split("/").filter(Boolean)[0] || "fantalega").toLowerCase();
  const STORAGE_SELECTED = `${SLUG}.adminCardVisibility.v456.selectedCards`;
  const STORAGE_QA = `${SLUG}.adminCardVisibility.v456.showQaChecklist`;
  let refreshScheduled = false;

  function safeText(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function makeKey(value, fallback = "card") {
    const normalized = String(value || fallback)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return normalized || fallback;
  }

  function readJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function getSelectedCards() {
    const value = readJson(STORAGE_SELECTED, []);
    return Array.isArray(value) ? value.map(String) : [];
  }

  function setSelectedCards(ids) {
    writeJson(STORAGE_SELECTED, Array.from(new Set((ids || []).map(String).filter(Boolean))));
  }

  function isQaChecklistEnabled() {
    try { return window.localStorage.getItem(STORAGE_QA) === "true"; } catch (_) { return false; }
  }

  function setQaChecklistEnabled(enabled) {
    try { window.localStorage.setItem(STORAGE_QA, enabled ? "true" : "false"); } catch (_) {}
  }

  function getAdminPanel() {
    return document.getElementById("adminPanel");
  }

  function cleanupLegacySelectors() {
    LEGACY_CONTROL_IDS.forEach((id) => document.getElementById(id)?.remove());
    document.querySelectorAll(LEGACY_CLASSES.map((className) => `.${className}`).join(", ")).forEach((node) => {
      LEGACY_CLASSES.forEach((className) => node.classList.remove(className));
      if (!node.classList.contains("admin-card-hidden-v456") && !node.classList.contains("admin-category-empty-v456")) {
        node.hidden = false;
        node.removeAttribute("aria-hidden");
      }
    });
  }

  function getTitleFromNode(card) {
    const titleNode = card.querySelector([
      ":scope > .panel-header h2",
      ":scope > .panel-header h3",
      ":scope > .admin-publication-dashboard-card-head-v368 h4",
      ":scope > .admin-publication-dashboard-card-head-v368 h3",
      ":scope > summary",
      ":scope > .admin-subsection-headerline h2",
      ":scope > .admin-subsection-headerline h3",
      ":scope > .admin-subsection-headerline h4",
      ":scope > h2",
      ":scope > h3",
      ":scope > h4",
      "h2",
      "h3",
      "h4"
    ].join(", "));
    const raw = titleNode?.textContent || card.getAttribute("aria-label") || card.id || "Card Admin";
    return raw.replace(/\s+/g, " ").trim() || "Card Admin";
  }

  function getCategoryTitle(card) {
    if (card.matches(".communication-generator-v197") || card.closest(".communication-generator-v197")) return "Comunicati";
    if (card.closest("#adminPublicationDashboardMountV368") || card.matches(".admin-publication-dashboard-card-v368")) return "Pubblicazione dati";
    if (card.closest("#adminPublicationReminderMountV189, #publicationStatusMountV190, #publishWizardMountV191")) return "Pubblicazione dati";
    const category = card.closest(".admin-category-section, .admin-category");
    const categoryTitle = category?.querySelector(":scope > .admin-category-heading h2, :scope > header h2, :scope > h2")?.textContent;
    return (categoryTitle || "Strumenti Admin").replace(/\s+/g, " ").trim();
  }

  function ensureCardKey(card, index) {
    if (!card.dataset.adminCardVisibilityKeyV456) {
      const category = getCategoryTitle(card);
      const title = getTitleFromNode(card);
      const idPart = card.id ? makeKey(card.id) : makeKey(`${category}-${title}-${index}`);
      card.dataset.adminCardVisibilityKeyV456 = `admin-${idPart}`;
    }
    return card.dataset.adminCardVisibilityKeyV456;
  }

  function isInsideSelector(node) {
    return Boolean(node.closest(`#${CONTROL_ID}, #adminCardSelectorV454, #adminCardSelectorV455`));
  }

  function addCandidate(list, seenNodes, node) {
    if (!node || seenNodes.has(node)) return;
    if (isInsideSelector(node)) return;
    if (node.matches(".admin-card-selector-v456, .admin-card-selector-v455, .admin-card-selector-v454")) return;
    if (node.closest(".admin-card-selector-v456, .admin-card-selector-v455, .admin-card-selector-v454")) return;
    if (node.closest("#manualQaPanelV358")) return;
    list.push(node);
    seenNodes.add(node);
  }

  function getAdminCards(adminPanel = getAdminPanel()) {
    if (!adminPanel) return [];
    cleanupLegacySelectors();
    const candidates = [];
    const seenNodes = new Set();

    adminPanel.querySelectorAll([
      "#adminPublicationDashboardMountV368 .admin-publication-dashboard-card-v368",
      "#adminPublicationReminderMountV189 > .panel",
      "#publicationStatusMountV190 > .panel",
      "#publishWizardMountV191 > .panel",
      ".communication-generator-v197",
      ".admin-category-body > .panel",
      ".admin-category-body > section.panel",
      ".admin-category-body > section.communication-generator-v197",
      ".admin-category-body > details.admin-edit-section",
      ".admin-category-body > .admin-subsection-block",
      ".admin-category-body > article.panel",
      ".admin-category-body > div.panel",
      "#adminPanel > .panel:not(.admin-publication-dashboard-v368)",
      "#adminPanel > details.admin-edit-section"
    ].join(", ")).forEach((node) => addCandidate(candidates, seenNodes, node));

    const seenKeys = new Set();
    return candidates.filter((card, index) => {
      if (!adminPanel.contains(card)) return false;
      if (card.id === CONTROL_MOUNT_ID || card.id === CONTROL_ID) return false;
      const nestedInCandidate = candidates.some((other) => other !== card && other.contains(card) && !other.matches(".admin-publication-dashboard-v368"));
      if (nestedInCandidate && !card.matches(".admin-publication-dashboard-card-v368")) return false;
      const key = ensureCardKey(card, index);
      if (seenKeys.has(key)) return false;
      seenKeys.add(key);
      return true;
    });
  }

  function groupCards(cards) {
    const groups = new Map();
    cards.forEach((card) => {
      const category = getCategoryTitle(card);
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(card);
    });
    return groups;
  }

  function ensureControlMount(adminPanel) {
    let mount = adminPanel.querySelector(`#${CONTROL_MOUNT_ID}`);
    const heading = adminPanel.querySelector(":scope > .page-heading, .page-heading");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = CONTROL_MOUNT_ID;
      mount.className = "admin-top-controls-v313";
      if (heading) heading.insertAdjacentElement("afterend", mount);
      else adminPanel.insertAdjacentElement("afterbegin", mount);
    }
    mount.hidden = false;
    mount.removeAttribute("aria-hidden");
    if (heading && mount.previousElementSibling !== heading) heading.insertAdjacentElement("afterend", mount);
    return mount;
  }

  function renderControls(adminPanel, cards) {
    if (!adminPanel || !cards.length) return null;
    const mount = ensureControlMount(adminPanel);
    if (!mount) return null;

    let control = document.getElementById(CONTROL_ID);
    if (!control) {
      control = document.createElement("section");
      control.id = CONTROL_ID;
      control.className = "admin-card-selector-v456";
      mount.insertAdjacentElement("afterbegin", control);
    } else if (control.parentElement !== mount) {
      mount.insertAdjacentElement("afterbegin", control);
    }
    control.hidden = false;
    control.removeAttribute("aria-hidden");

    const selected = new Set(getSelectedCards());
    const groups = groupCards(cards);
    const total = cards.length;
    const visible = cards.filter((card) => selected.has(ensureCardKey(card, 0))).length;
    const groupsHtml = Array.from(groups.entries()).map(([category, groupCardsList]) => {
      const checkboxes = groupCardsList.map((card, index) => {
        const key = ensureCardKey(card, index);
        const title = getTitleFromNode(card);
        return `
          <label class="admin-card-selector-v456__option">
            <input type="checkbox" data-admin-card-toggle-v456 value="${safeText(key)}" ${selected.has(key) ? "checked" : ""} />
            <span>${safeText(title)}</span>
          </label>`;
      }).join("");
      return `
        <div class="admin-card-selector-v456__group">
          <h4>${safeText(category)}</h4>
          <div class="admin-card-selector-v456__checks">${checkboxes}</div>
        </div>`;
    }).join("");

    control.innerHTML = `
      <div class="admin-card-selector-v456__header">
        <div>
          <p class="eyebrow">Visibilità Admin · V${VERSION}</p>
          <h3>Seleziona le card da mostrare</h3>
          <p>Di default le card sono nascoste: spunta solo quelle che ti servono.</p>
        </div>
        <span class="admin-card-selector-v456__badge" data-admin-card-summary-v456>${visible}/${total} visibili</span>
      </div>
      <div class="admin-card-selector-v456__actions" aria-label="Azioni rapide visibilità Admin">
        <button class="button button-secondary button-small" type="button" data-admin-card-action-v456="all">Mostra tutte</button>
        <button class="button button-secondary button-small" type="button" data-admin-card-action-v456="none">Nascondi tutte</button>
      </div>
      <div class="admin-card-selector-v456__grid">${groupsHtml}</div>
      <label class="admin-card-selector-v456__qa">
        <input type="checkbox" data-admin-qa-toggle-v456 ${isQaChecklistEnabled() ? "checked" : ""} />
        <span>Mostra Checklist QA Admin in basso</span>
      </label>`;
    return control;
  }

  function applyQaChecklistVisibility() {
    const panel = document.getElementById(CHECKLIST_ID);
    const enabled = isQaChecklistEnabled();
    if (panel) {
      panel.classList.toggle("admin-qa-hidden-v456", !enabled);
      panel.hidden = !enabled;
      panel.setAttribute("aria-hidden", enabled ? "false" : "true");
    }
    const toggle = document.querySelector("[data-admin-qa-toggle-v456]");
    if (toggle) toggle.checked = enabled;
  }

  function applyContainersVisibility(adminPanel) {
    if (!adminPanel) return;
    adminPanel.querySelectorAll(".admin-category-section, .admin-category").forEach((category) => {
      if (category.closest(`#${CONTROL_ID}`)) return;
      const cards = Array.from(category.querySelectorAll("[data-admin-card-visibility-key-v456]"));
      if (!cards.length) return;
      const anyVisible = cards.some((card) => !card.classList.contains("admin-card-hidden-v456"));
      category.classList.toggle("admin-category-empty-v456", !anyVisible);
      category.hidden = !anyVisible;
      category.setAttribute("aria-hidden", anyVisible ? "false" : "true");
    });

    const dashboard = adminPanel.querySelector("#adminPublicationDashboardMountV368 .admin-publication-dashboard-v368");
    if (dashboard) {
      const cards = Array.from(dashboard.querySelectorAll(".admin-publication-dashboard-card-v368[data-admin-card-visibility-key-v456]"));
      if (!cards.length) return;
      const anyVisible = cards.some((card) => !card.classList.contains("admin-card-hidden-v456"));
      dashboard.classList.toggle("admin-publication-dashboard-empty-v456", !anyVisible);
      dashboard.hidden = !anyVisible;
      dashboard.setAttribute("aria-hidden", anyVisible ? "false" : "true");
    }
  }

  function applyCardVisibility() {
    const adminPanel = getAdminPanel();
    if (!adminPanel) { applyQaChecklistVisibility(); return; }
    cleanupLegacySelectors();
    const cards = getAdminCards(adminPanel);
    if (!cards.length) { applyQaChecklistVisibility(); return; }
    renderControls(adminPanel, cards);
    const selected = new Set(getSelectedCards());
    cards.forEach((card, index) => {
      const key = ensureCardKey(card, index);
      const visible = selected.has(key);
      card.classList.toggle("admin-card-hidden-v456", !visible);
      card.hidden = !visible;
      card.setAttribute("aria-hidden", visible ? "false" : "true");
    });
    applyContainersVisibility(adminPanel);
    const summary = document.querySelector("[data-admin-card-summary-v456]");
    if (summary) summary.textContent = `${cards.filter((card) => selected.has(ensureCardKey(card, 0))).length}/${cards.length} visibili`;
    applyQaChecklistVisibility();
  }

  function scheduleApply() {
    if (refreshScheduled) return;
    refreshScheduled = true;
    window.requestAnimationFrame(() => {
      refreshScheduled = false;
      applyCardVisibility();
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-admin-card-action-v456]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();
    const cards = getAdminCards();
    const action = button.dataset.adminCardActionV456;
    if (action === "all") setSelectedCards(cards.map((card, index) => ensureCardKey(card, index)));
    if (action === "none") setSelectedCards([]);
    applyCardVisibility();
  }, true);

  document.addEventListener("change", (event) => {
    const cardToggle = event.target.closest?.("[data-admin-card-toggle-v456]");
    if (cardToggle) {
      event.stopPropagation();
      const selected = new Set(getSelectedCards());
      if (cardToggle.checked) selected.add(cardToggle.value);
      else selected.delete(cardToggle.value);
      setSelectedCards(Array.from(selected));
      applyCardVisibility();
      return;
    }
    const qaToggle = event.target.closest?.("[data-admin-qa-toggle-v456]");
    if (qaToggle) {
      event.stopPropagation();
      setQaChecklistEnabled(Boolean(qaToggle.checked));
      applyQaChecklistVisibility();
    }
  }, true);

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.target?.id === CONTROL_ID || mutation.target?.closest?.(`#${CONTROL_ID}`))) return;
    scheduleApply();
  });

  function init() {
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    applyCardVisibility();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.LeagueAdminCardVisibilityV456 = Object.freeze({
    version: `V${VERSION}`,
    storageSelected: STORAGE_SELECTED,
    storageQa: STORAGE_QA,
    apply: applyCardVisibility,
    getSelectedCards,
    setSelectedCards,
    isQaChecklistEnabled,
    setQaChecklistEnabled,
    getAdminCards
  });
  window.ZonaOrientaleAdminCardVisibilityV456 = window.LeagueAdminCardVisibilityV456;
  window.FantaPetilloAdminCardVisibilityV456 = window.LeagueAdminCardVisibilityV456;
})();

/* V761 - Hardfix selettore Visibilita Admin senza loop MutationObserver.
 * La decorazione e idempotente e usa una classe CSS sul contenitore.
 * L'observer reagisce solo quando il selettore viene aggiunto o ricreato.
 */
(function adminCardSelectorDesktopHardfixV761(){
  'use strict';
  const VERSION = 'V761';
  if (window.LeagueAdminCardCheckboxHardfixV761) return;

  const CONTROL_ID = 'adminCardSelectorV456';
  const HARDENED_CLASS = 'admin-card-checkbox-hardfix-v761';
  const SLUG = (window.location.pathname.split('/').filter(Boolean)[0] || 'fantalega').toLowerCase();
  const STORAGE_SELECTED = `${SLUG}.adminCardVisibility.v456.selectedCards`;
  const STORAGE_QA = `${SLUG}.adminCardVisibility.v456.showQaChecklist`;
  let decorateFrame = 0;
  let observer = null;

  function readSelected(){
    try {
      const parsed = JSON.parse(window.localStorage.getItem(STORAGE_SELECTED) || '[]');
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (_) { return []; }
  }

  function writeSelected(values){
    try {
      window.localStorage.setItem(
        STORAGE_SELECTED,
        JSON.stringify(Array.from(new Set((values || []).map(String).filter(Boolean))))
      );
    } catch (_) {}
  }

  function writeQa(enabled){
    try { window.localStorage.setItem(STORAGE_QA, enabled ? 'true' : 'false'); } catch (_) {}
  }

  function api(){
    return window.LeagueAdminCardVisibilityV456 ||
      window.ZonaOrientaleAdminCardVisibilityV456 ||
      window.FantaPetilloAdminCardVisibilityV456 ||
      null;
  }

  function decorate(){
    const control = document.getElementById(CONTROL_ID);
    if (!control) return false;
    if (!control.classList.contains(HARDENED_CLASS)) control.classList.add(HARDENED_CLASS);
    if (control.dataset.adminCheckboxHardfixV761 !== 'true') {
      control.dataset.adminCheckboxHardfixV761 = 'true';
    }
    return true;
  }

  function scheduleDecorate(){
    if (decorateFrame) return;
    decorateFrame = window.requestAnimationFrame(() => {
      decorateFrame = 0;
      try { decorate(); } catch (_) {}
    });
  }

  function applySoon(){
    window.requestAnimationFrame(() => {
      try { api()?.apply?.(); } catch (_) {}
      scheduleDecorate();
    });
  }

  function syncCardInput(input, nextChecked){
    if (!input || input.disabled) return;
    input.checked = Boolean(nextChecked);
    const selected = new Set(readSelected());
    const value = String(input.value || '');
    if (input.checked) selected.add(value);
    else selected.delete(value);
    writeSelected(Array.from(selected));
    applySoon();
  }

  function syncQaInput(input, nextChecked){
    if (!input || input.disabled) return;
    input.checked = Boolean(nextChecked);
    writeQa(input.checked);
    applySoon();
  }

  function setAll(action){
    const runtime = api();
    if (!runtime || typeof runtime.getAdminCards !== 'function') return false;
    const cards = runtime.getAdminCards() || [];
    if (action === 'all') {
      const values = cards
        .map((card) => String(card?.dataset?.adminCardVisibilityKeyV456 || ''))
        .filter(Boolean);
      writeSelected(values);
    } else if (action === 'none') {
      writeSelected([]);
    } else {
      return false;
    }
    applySoon();
    return true;
  }

  function intercept(event){
    const target = event.target;
    if (!target || !target.closest) return;
    const control = target.closest(`#${CONTROL_ID}`);
    if (!control) return;

    const actionButton = target.closest('[data-admin-card-action-v456]');
    if (actionButton && control.contains(actionButton)) {
      const action = actionButton.getAttribute('data-admin-card-action-v456');
      if (setAll(action)) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
      }
      return;
    }

    const label = target.closest('label.admin-card-selector-v456__option, label.admin-card-selector-v456__qa');
    if (!label || !control.contains(label)) return;
    const input = label.querySelector('input[type="checkbox"]');
    if (!input || input.disabled) return;

    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();

    const nextChecked = !input.checked;
    if (input.matches('[data-admin-card-toggle-v456]')) syncCardInput(input, nextChecked);
    else if (input.matches('[data-admin-qa-toggle-v456]')) syncQaInput(input, nextChecked);
  }

  function nodeContainsControl(node){
    if (!(node instanceof Element)) return false;
    return node.id === CONTROL_ID || Boolean(node.querySelector?.(`#${CONTROL_ID}`));
  }

  function startObserver(){
    if (observer) return;
    const root = document.body || document.documentElement;
    if (!root) return;
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (nodeContainsControl(node)) {
            scheduleDecorate();
            return;
          }
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  function boot(){
    decorate();
    startObserver();
  }

  document.addEventListener('click', intercept, true);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  const publicApi = Object.freeze({
    version: VERSION,
    storageSelected: STORAGE_SELECTED,
    storageQa: STORAGE_QA,
    observerMode: 'targeted-added-nodes',
    decorate,
    scheduleDecorate,
    setAll
  });

  window.LeagueAdminCardCheckboxHardfixV761 = publicApi;
  window.ZonaOrientaleAdminCardCheckboxHardfixV761 = publicApi;
  window.FantaPetilloAdminCardCheckboxHardfixV761 = publicApi;
})();
