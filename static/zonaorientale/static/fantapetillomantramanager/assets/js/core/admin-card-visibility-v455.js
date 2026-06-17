(function adminCardVisibilityV455() {
  "use strict";

  const VERSION = "455";
  const CONTROL_ID = "adminCardSelectorV455";
  const CONTROL_MOUNT_ID = "adminTopControlsMountV313";
  const CHECKLIST_ID = "manualQaPanelV358";
  const LEGACY_CONTROL_ID = "adminCardSelectorV454";
  const SLUG = (window.location.pathname.split("/").filter(Boolean)[0] || "fantalega").toLowerCase();
  const STORAGE_SELECTED = `${SLUG}.adminCardVisibility.v455.selectedCards`;
  const STORAGE_QA = `${SLUG}.adminCardVisibility.v455.showQaChecklist`;
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

  function cleanupLegacyV454() {
    document.getElementById(LEGACY_CONTROL_ID)?.remove();
    document.querySelectorAll(".admin-card-hidden-v454, .admin-category-empty-v454, .admin-qa-hidden-v454").forEach((node) => {
      node.classList.remove("admin-card-hidden-v454", "admin-category-empty-v454", "admin-qa-hidden-v454");
      if (node.hidden && !node.classList.contains("admin-card-hidden-v455") && !node.classList.contains("admin-category-empty-v455")) {
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
    if (card.closest("#adminPublicationDashboardMountV368") || card.matches(".admin-publication-dashboard-card-v368")) return "Pubblicazione dati";
    if (card.closest("#adminPublicationReminderMountV189, #publicationStatusMountV190, #publishWizardMountV191")) return "Pubblicazione dati";
    const category = card.closest(".admin-category-section, .admin-category");
    const categoryTitle = category?.querySelector(":scope > .admin-category-heading h2, :scope > header h2")?.textContent;
    return (categoryTitle || "Strumenti Admin").replace(/\s+/g, " ").trim();
  }

  function ensureCardKey(card, index) {
    if (!card.dataset.adminCardVisibilityKeyV455) {
      const category = getCategoryTitle(card);
      const title = getTitleFromNode(card);
      const idPart = card.id ? makeKey(card.id) : makeKey(`${category}-${title}-${index}`);
      card.dataset.adminCardVisibilityKeyV455 = `admin-${idPart}`;
    }
    return card.dataset.adminCardVisibilityKeyV455;
  }

  function isInsideControl(node) {
    return Boolean(node.closest(`#${CONTROL_ID}, #${LEGACY_CONTROL_ID}`));
  }

  function addCandidate(list, node) {
    if (!node || isInsideControl(node)) return;
    if (node.matches(".admin-card-selector-v455, .admin-card-selector-v454")) return;
    if (node.closest(".admin-card-selector-v455, .admin-card-selector-v454")) return;
    if (node.closest("#manualQaPanelV358")) return;
    list.push(node);
  }

  function getAdminCards(adminPanel = getAdminPanel()) {
    if (!adminPanel) return [];
    cleanupLegacyV454();
    const candidates = [];

    adminPanel.querySelectorAll([
      "#adminPublicationReminderMountV189 > .panel",
      "#publicationStatusMountV190 > .panel",
      "#publishWizardMountV191 > .panel",
      "#adminPublicationDashboardMountV368 .admin-publication-dashboard-card-v368",
      ".admin-category-body > .panel",
      ".admin-category-body > details.admin-edit-section",
      ".admin-category-body > section.panel",
      ".admin-category-body > .admin-subsection-block",
      "#adminPanel > .panel:not(.admin-publication-dashboard-v368)",
      "#adminPanel > details.admin-edit-section"
    ].join(", ")).forEach((node) => addCandidate(candidates, node));

    const seen = new Set();
    return candidates.filter((card, index) => {
      if (!adminPanel.contains(card)) return false;
      const nestedInCandidate = candidates.some((other) => other !== card && other.contains(card) && !other.matches(".admin-publication-dashboard-v368"));
      if (nestedInCandidate && !card.matches(".admin-publication-dashboard-card-v368")) return false;
      const key = ensureCardKey(card, index);
      if (seen.has(key)) return false;
      seen.add(key);
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
      control.className = "admin-card-selector-v455";
      mount.insertAdjacentElement("afterbegin", control);
    } else if (control.parentElement !== mount) {
      mount.insertAdjacentElement("afterbegin", control);
    }

    const selected = new Set(getSelectedCards());
    const groups = groupCards(cards);
    const total = cards.length;
    const visible = cards.filter((card) => selected.has(ensureCardKey(card, 0))).length;
    const groupsHtml = Array.from(groups.entries()).map(([category, groupCardsList]) => {
      const checkboxes = groupCardsList.map((card, index) => {
        const key = ensureCardKey(card, index);
        const title = getTitleFromNode(card);
        return `
          <label class="admin-card-selector-v455__option">
            <input type="checkbox" data-admin-card-toggle-v455 value="${safeText(key)}" ${selected.has(key) ? "checked" : ""} />
            <span>${safeText(title)}</span>
          </label>`;
      }).join("");
      return `
        <div class="admin-card-selector-v455__group">
          <h4>${safeText(category)}</h4>
          <div class="admin-card-selector-v455__checks">${checkboxes}</div>
        </div>`;
    }).join("");

    control.innerHTML = `
      <div class="admin-card-selector-v455__header">
        <div>
          <p class="eyebrow">Visibilità Admin · V${VERSION}</p>
          <h3>Seleziona le card da mostrare</h3>
          <p>Di default le card sono nascoste: spunta solo quelle che ti servono.</p>
        </div>
        <span class="admin-card-selector-v455__badge" data-admin-card-summary-v455>${visible}/${total} visibili</span>
      </div>
      <details class="admin-card-selector-v455__details" open>
        <summary>Menu card Admin</summary>
        <div class="admin-card-selector-v455__actions">
          <button class="button button-secondary button-small" type="button" data-admin-card-action-v455="all">Mostra tutte</button>
          <button class="button button-secondary button-small" type="button" data-admin-card-action-v455="none">Nascondi tutte</button>
        </div>
        <div class="admin-card-selector-v455__grid">${groupsHtml}</div>
        <label class="admin-card-selector-v455__qa">
          <input type="checkbox" data-admin-qa-toggle-v455 ${isQaChecklistEnabled() ? "checked" : ""} />
          <span>Mostra Checklist QA Admin in basso</span>
        </label>
      </details>`;
    return control;
  }

  function applyQaChecklistVisibility() {
    const panel = document.getElementById(CHECKLIST_ID);
    const enabled = isQaChecklistEnabled();
    if (panel) {
      panel.classList.toggle("admin-qa-hidden-v455", !enabled);
      panel.hidden = !enabled;
      panel.setAttribute("aria-hidden", enabled ? "false" : "true");
    }
    const toggle = document.querySelector("[data-admin-qa-toggle-v455]");
    if (toggle) toggle.checked = enabled;
  }

  function applyContainersVisibility(adminPanel) {
    if (!adminPanel) return;
    adminPanel.querySelectorAll(".admin-category-section, .admin-category").forEach((category) => {
      const cards = Array.from(category.querySelectorAll("[data-admin-card-visibility-key-v455]"));
      if (!cards.length) return;
      const anyVisible = cards.some((card) => !card.classList.contains("admin-card-hidden-v455"));
      category.classList.toggle("admin-category-empty-v455", !anyVisible);
      category.hidden = !anyVisible;
      category.setAttribute("aria-hidden", anyVisible ? "false" : "true");
    });

    const dashboard = adminPanel.querySelector("#adminPublicationDashboardMountV368 .admin-publication-dashboard-v368");
    if (dashboard) {
      const cards = Array.from(dashboard.querySelectorAll(".admin-publication-dashboard-card-v368[data-admin-card-visibility-key-v455]"));
      const anyVisible = cards.some((card) => !card.classList.contains("admin-card-hidden-v455"));
      dashboard.classList.toggle("admin-publication-dashboard-empty-v455", !anyVisible);
      dashboard.hidden = !anyVisible;
      dashboard.setAttribute("aria-hidden", anyVisible ? "false" : "true");
    }
  }

  function applyCardVisibility() {
    const adminPanel = getAdminPanel();
    if (!adminPanel) { applyQaChecklistVisibility(); return; }
    const cards = getAdminCards(adminPanel);
    if (!cards.length) { applyQaChecklistVisibility(); return; }
    renderControls(adminPanel, cards);
    const selected = new Set(getSelectedCards());
    cards.forEach((card, index) => {
      const key = ensureCardKey(card, index);
      const visible = selected.has(key);
      card.classList.toggle("admin-card-hidden-v455", !visible);
      card.hidden = !visible;
      card.setAttribute("aria-hidden", visible ? "false" : "true");
    });
    applyContainersVisibility(adminPanel);
    const summary = document.querySelector("[data-admin-card-summary-v455]");
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

  document.addEventListener("change", (event) => {
    const cardToggle = event.target.closest?.("[data-admin-card-toggle-v455]");
    if (cardToggle) {
      const selected = new Set(getSelectedCards());
      if (cardToggle.checked) selected.add(cardToggle.value);
      else selected.delete(cardToggle.value);
      setSelectedCards(Array.from(selected));
      applyCardVisibility();
      return;
    }
    const qaToggle = event.target.closest?.("[data-admin-qa-toggle-v455]");
    if (qaToggle) {
      setQaChecklistEnabled(Boolean(qaToggle.checked));
      applyQaChecklistVisibility();
    }
  });

  document.addEventListener("click", (event) => {
    const action = event.target.closest?.("[data-admin-card-action-v455]")?.dataset?.adminCardActionV455;
    if (!action) return;
    event.preventDefault();
    const cards = getAdminCards();
    if (action === "all") setSelectedCards(cards.map((card, index) => ensureCardKey(card, index)));
    if (action === "none") setSelectedCards([]);
    applyCardVisibility();
  });

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

  window.LeagueAdminCardVisibilityV455 = Object.freeze({
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
  window.ZonaOrientaleAdminCardVisibilityV455 = window.LeagueAdminCardVisibilityV455;
  window.FantaPetilloAdminCardVisibilityV455 = window.LeagueAdminCardVisibilityV455;
})();
