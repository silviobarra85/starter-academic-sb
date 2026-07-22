(function adminCardVisibilityRuntimeV763() {
  "use strict";

  const RELEASE = "V763";
  const CONTROL_VERSION = "456";
  const CONTROL_ID = "adminCardSelectorV456";
  const CONTROL_MOUNT_ID = "adminTopControlsMountV313";
  const CHECKLIST_ID = "manualQaPanelV358";
  const ROOT_API_NAME = "LeagueAdminCardVisibilityV456";
  const RUNTIME_GUARD = "__leagueAdminCardVisibilityV763";
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

  if (window[RUNTIME_GUARD]) {
    window[ROOT_API_NAME] = window[RUNTIME_GUARD];
    window.ZonaOrientaleAdminCardVisibilityV456 = window[RUNTIME_GUARD];
    window.FantaPetilloAdminCardVisibilityV456 = window[RUNTIME_GUARD];
    return;
  }

  const SLUG = (window.location.pathname.split("/").filter(Boolean)[0] || "fantalega").toLowerCase();
  const STORAGE_SELECTED = `${SLUG}.adminCardVisibility.v456.selectedCards`;
  const STORAGE_QA = `${SLUG}.adminCardVisibility.v456.showQaChecklist`;

  let selectedState = [];
  let qaState = false;
  let storageMode = "memory";
  let observer = null;
  let observerRoot = null;
  let refreshFrame = 0;
  let controlSignature = "";
  let initialized = false;
  let lastError = "";

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

  function normalizeSelected(values) {
    return Array.from(new Set((Array.isArray(values) ? values : []).map(String).filter(Boolean)));
  }

  function storageCandidates() {
    const candidates = [];
    try {
      const probe = `__admin_card_probe_${Date.now()}`;
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      candidates.push({ name: "localStorage", storage: window.localStorage });
    } catch (_) {}
    try {
      const probe = `__admin_card_probe_${Date.now()}`;
      window.sessionStorage.setItem(probe, "1");
      window.sessionStorage.removeItem(probe);
      candidates.push({ name: "sessionStorage", storage: window.sessionStorage });
    } catch (_) {}
    return candidates;
  }

  function readPersistedState() {
    for (const candidate of storageCandidates()) {
      try {
        const rawSelected = candidate.storage.getItem(STORAGE_SELECTED);
        const rawQa = candidate.storage.getItem(STORAGE_QA);
        selectedState = rawSelected ? normalizeSelected(JSON.parse(rawSelected)) : [];
        qaState = rawQa === "true";
        storageMode = candidate.name;
        return;
      } catch (_) {}
    }
    selectedState = [];
    qaState = false;
    storageMode = "memory";
  }

  function persistValue(key, value) {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    for (const candidate of storageCandidates()) {
      try {
        candidate.storage.setItem(key, serialized);
        storageMode = candidate.name;
        return true;
      } catch (_) {}
    }
    storageMode = "memory";
    return false;
  }

  function getSelectedCards() {
    return selectedState.slice();
  }

  function setSelectedCards(ids, options = {}) {
    selectedState = normalizeSelected(ids);
    if (options.persist !== false) persistValue(STORAGE_SELECTED, selectedState);
    return getSelectedCards();
  }

  function isQaChecklistEnabled() {
    return Boolean(qaState);
  }

  function setQaChecklistEnabled(enabled, options = {}) {
    qaState = Boolean(enabled);
    if (options.persist !== false) persistValue(STORAGE_QA, qaState ? "true" : "false");
    return qaState;
  }

  function getAdminPanel() {
    return document.getElementById("adminPanel");
  }

  function cleanupLegacySelectors() {
    LEGACY_CONTROL_IDS.forEach((id) => document.getElementById(id)?.remove());
    const selector = LEGACY_CLASSES.map((className) => `.${className}`).join(", ");
    if (!selector) return;
    document.querySelectorAll(selector).forEach((node) => {
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
    return Boolean(node.closest?.(`#${CONTROL_ID}, #adminCardSelectorV454, #adminCardSelectorV455`));
  }

  function addCandidate(list, seenNodes, node) {
    if (!node || seenNodes.has(node) || isInsideSelector(node)) return;
    if (node.matches?.(".admin-card-selector-v456, .admin-card-selector-v455, .admin-card-selector-v454")) return;
    if (node.closest?.(".admin-card-selector-v456, .admin-card-selector-v455, .admin-card-selector-v454")) return;
    if (node.closest?.(`#${CHECKLIST_ID}`)) return;
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

  function cardsSignature(cards) {
    return cards.map((card, index) => `${ensureCardKey(card, index)}\u0001${getCategoryTitle(card)}\u0001${getTitleFromNode(card)}`).join("\u0002");
  }

  function buildControlHtml(cards) {
    const selected = new Set(getSelectedCards());
    const groups = groupCards(cards);
    const total = cards.length;
    const visible = cards.filter((card, index) => selected.has(ensureCardKey(card, index))).length;
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

    return `
      <div class="admin-card-selector-v456__header">
        <div>
          <p class="eyebrow">Visibilità Admin · V${CONTROL_VERSION}</p>
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
  }

  function bindControl(control) {
    if (!control || control.dataset.adminCardControllerV763 === "true") return;
    control.dataset.adminCardControllerV763 = "true";

    control.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-admin-card-action-v456]");
      if (!button || !control.contains(button)) return;
      const action = button.dataset.adminCardActionV456;
      const cards = getAdminCards();
      if (action === "all") setSelectedCards(cards.map((card, index) => ensureCardKey(card, index)));
      else if (action === "none") setSelectedCards([]);
      else return;
      event.preventDefault();
      event.stopPropagation();
      applyCardVisibility();
    }, true);

    control.addEventListener("change", (event) => {
      const cardToggle = event.target.closest?.("[data-admin-card-toggle-v456]");
      if (cardToggle && control.contains(cardToggle)) {
        const selected = new Set(getSelectedCards());
        if (cardToggle.checked) selected.add(String(cardToggle.value || ""));
        else selected.delete(String(cardToggle.value || ""));
        setSelectedCards(Array.from(selected));
        event.stopPropagation();
        applyCardVisibility();
        return;
      }
      const qaToggle = event.target.closest?.("[data-admin-qa-toggle-v456]");
      if (qaToggle && control.contains(qaToggle)) {
        setQaChecklistEnabled(Boolean(qaToggle.checked));
        event.stopPropagation();
        applyQaChecklistVisibility();
      }
    }, true);
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
    control.classList.remove("admin-card-checkbox-hardfix-v761");
    control.dataset.adminCardRuntime = RELEASE;
    bindControl(control);

    const nextSignature = cardsSignature(cards);
    if (controlSignature !== nextSignature || !control.querySelector("[data-admin-card-summary-v456]")) {
      controlSignature = nextSignature;
      control.innerHTML = buildControlHtml(cards);
    }
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
    if (toggle && toggle.checked !== enabled) toggle.checked = enabled;
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
      if (cards.length) {
        const anyVisible = cards.some((card) => !card.classList.contains("admin-card-hidden-v456"));
        dashboard.classList.toggle("admin-publication-dashboard-empty-v456", !anyVisible);
        dashboard.hidden = !anyVisible;
        dashboard.setAttribute("aria-hidden", anyVisible ? "false" : "true");
      }
    }
  }

  function syncControlState(control, cards) {
    const selected = new Set(getSelectedCards());
    control?.querySelectorAll("[data-admin-card-toggle-v456]").forEach((input) => {
      const checked = selected.has(String(input.value || ""));
      if (input.checked !== checked) input.checked = checked;
    });
    const summary = control?.querySelector("[data-admin-card-summary-v456]");
    if (summary) {
      const visible = cards.filter((card, index) => selected.has(ensureCardKey(card, index))).length;
      summary.textContent = `${visible}/${cards.length} visibili`;
    }
  }

  function applyCardVisibility() {
    try {
      const adminPanel = getAdminPanel();
      if (!adminPanel) {
        applyQaChecklistVisibility();
        return { cards: 0, visible: 0 };
      }
      cleanupLegacySelectors();
      const cards = getAdminCards(adminPanel);
      if (!cards.length) {
        applyQaChecklistVisibility();
        return { cards: 0, visible: 0 };
      }
      const control = renderControls(adminPanel, cards);
      const selected = new Set(getSelectedCards());
      let visibleCount = 0;
      cards.forEach((card, index) => {
        const key = ensureCardKey(card, index);
        const visible = selected.has(key);
        if (visible) visibleCount += 1;
        card.classList.toggle("admin-card-hidden-v456", !visible);
        card.hidden = !visible;
        card.setAttribute("aria-hidden", visible ? "false" : "true");
      });
      applyContainersVisibility(adminPanel);
      syncControlState(control, cards);
      applyQaChecklistVisibility();
      lastError = "";
      return { cards: cards.length, visible: visibleCount };
    } catch (error) {
      lastError = error?.message || String(error);
      console.error(`[${RELEASE}] Admin card visibility apply failed`, error);
      return { cards: 0, visible: 0, error: lastError };
    }
  }

  function scheduleApply() {
    if (refreshFrame) return;
    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = 0;
      applyCardVisibility();
    });
  }

  function mutationNeedsRefresh(mutation) {
    if (mutation.type !== "childList") return false;
    if (mutation.target?.closest?.(`#${CONTROL_ID}`)) return false;
    for (const node of mutation.addedNodes) {
      if (!(node instanceof Element)) continue;
      if (node.id === CONTROL_ID || node.closest?.(`#${CONTROL_ID}`)) continue;
      return true;
    }
    for (const node of mutation.removedNodes) {
      if (!(node instanceof Element)) continue;
      if (node.id === CONTROL_ID || node.closest?.(`#${CONTROL_ID}`)) continue;
      return true;
    }
    return false;
  }

  function connectObserver() {
    const root = getAdminPanel();
    if (!root || observerRoot === root) return;
    observer?.disconnect();
    observerRoot = root;
    observer = new MutationObserver((mutations) => {
      if (mutations.some(mutationNeedsRefresh)) scheduleApply();
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  function diagnostics() {
    const cards = getAdminCards();
    const selected = new Set(getSelectedCards());
    return {
      release: RELEASE,
      controlVersion: `V${CONTROL_VERSION}`,
      initialized,
      storageMode,
      storageSelected: STORAGE_SELECTED,
      storageQa: STORAGE_QA,
      cards: cards.length,
      selected: selected.size,
      visible: cards.filter((card, index) => selected.has(ensureCardKey(card, index))).length,
      observerConnected: Boolean(observer && observerRoot),
      controlBound: document.getElementById(CONTROL_ID)?.dataset?.adminCardControllerV763 === "true",
      lastError
    };
  }

  async function runInteractionSelfTest() {
    const cards = getAdminCards();
    const control = document.getElementById(CONTROL_ID);
    if (!cards.length || !control) return { ok: false, reason: "Selector or cards unavailable", diagnostics: diagnostics() };
    const originalSelected = getSelectedCards();
    const originalQa = isQaChecklistEnabled();
    const results = [];
    try {
      control.querySelector('[data-admin-card-action-v456="all"]')?.click();
      await new Promise((resolve) => requestAnimationFrame(resolve));
      results.push({ step: "show-all", pass: getSelectedCards().length === cards.length && cards.every((card) => !card.hidden) });

      const firstInput = document.querySelector("[data-admin-card-toggle-v456]");
      const firstValue = String(firstInput?.value || "");
      firstInput?.click();
      await new Promise((resolve) => requestAnimationFrame(resolve));
      results.push({ step: "checkbox", pass: firstValue ? !getSelectedCards().includes(firstValue) : false });

      control.querySelector('[data-admin-card-action-v456="none"]')?.click();
      await new Promise((resolve) => requestAnimationFrame(resolve));
      results.push({ step: "hide-all", pass: getSelectedCards().length === 0 && cards.every((card) => card.hidden) });
    } finally {
      setSelectedCards(originalSelected);
      setQaChecklistEnabled(originalQa);
      applyCardVisibility();
    }
    return { ok: results.every((item) => item.pass), results, diagnostics: diagnostics() };
  }

  function init() {
    if (initialized) return;
    initialized = true;
    readPersistedState();
    applyCardVisibility();
    connectObserver();
  }

  const publicApi = Object.freeze({
    version: RELEASE,
    controlVersion: `V${CONTROL_VERSION}`,
    storageSelected: STORAGE_SELECTED,
    storageQa: STORAGE_QA,
    apply: applyCardVisibility,
    scheduleApply,
    getSelectedCards,
    setSelectedCards(ids) { const value = setSelectedCards(ids); applyCardVisibility(); return value; },
    isQaChecklistEnabled,
    setQaChecklistEnabled(enabled) { const value = setQaChecklistEnabled(enabled); applyQaChecklistVisibility(); return value; },
    getAdminCards,
    diagnostics,
    runInteractionSelfTest
  });

  window[RUNTIME_GUARD] = publicApi;
  window[ROOT_API_NAME] = publicApi;
  window.ZonaOrientaleAdminCardVisibilityV456 = publicApi;
  window.FantaPetilloAdminCardVisibilityV456 = publicApi;
  window.LeagueAdminCardCheckboxHardfixV761 = undefined;
  window.ZonaOrientaleAdminCardCheckboxHardfixV761 = undefined;
  window.FantaPetilloAdminCardCheckboxHardfixV761 = undefined;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
