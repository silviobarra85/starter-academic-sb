(function adminCardVisibilityV454() {
  "use strict";

  const VERSION = "454";
  const CONTROL_ID = "adminCardSelectorV454";
  const CONTROL_MOUNT_ID = "adminTopControlsMountV313";
  const CHECKLIST_ID = "manualQaPanelV358";
  const SLUG = (window.location.pathname.split("/").filter(Boolean)[0] || "fantalega").toLowerCase();
  const STORAGE_SELECTED = `${SLUG}.adminCardVisibility.v454.selectedCards`;
  const STORAGE_QA = `${SLUG}.adminCardVisibility.v454.showQaChecklist`;
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

  function getCardTitle(card) {
    return (card.querySelector(":scope > .panel-header h2, :scope > .panel-header h3, h2, h3, h4")?.textContent || card.id || "Card Admin").trim();
  }

  function getCategoryTitle(card) {
    const category = card.closest(".admin-category-section, .admin-category");
    return (category?.querySelector(":scope > .admin-category-heading h2, :scope > header h2")?.textContent || "Altro").trim();
  }

  function ensureCardKey(card, index) {
    if (!card.dataset.adminCardVisibilityKeyV454) {
      const title = getCardTitle(card);
      card.dataset.adminCardVisibilityKeyV454 = card.id || `admin-card-${makeKey(title)}-${index}`;
    }
    return card.dataset.adminCardVisibilityKeyV454;
  }

  function getAdminCards(adminPanel = getAdminPanel()) {
    if (!adminPanel) return [];
    const candidates = Array.from(adminPanel.querySelectorAll(".admin-category-body > .panel, #adminTopControlsMountV313 > .panel, #adminPanel > .panel, #adminPublicationDashboardMountV368 > .panel, .admin-publication-dashboard-v368"));
    const seen = new Set();
    return candidates
      .filter((card) => card && !card.closest(`#${CONTROL_ID}`) && !card.classList.contains("admin-card-selector-v454"))
      .filter((card, index) => {
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

  function renderControls(adminPanel, cards) {
    if (!adminPanel || !cards.length) return null;
    let mount = adminPanel.querySelector(`#${CONTROL_MOUNT_ID}`);
    const heading = adminPanel.querySelector(":scope > .page-heading, .page-heading");
    if (!mount && heading) {
      mount = document.createElement("div");
      mount.id = CONTROL_MOUNT_ID;
      mount.className = "admin-top-controls-v313";
      heading.insertAdjacentElement("afterend", mount);
    }
    if (!mount) return null;

    let control = document.getElementById(CONTROL_ID);
    if (!control) {
      control = document.createElement("section");
      control.id = CONTROL_ID;
      control.className = "admin-card-selector-v454";
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
        const title = getCardTitle(card);
        return `
          <label class="admin-card-selector-v454__option">
            <input type="checkbox" data-admin-card-toggle-v454 value="${safeText(key)}" ${selected.has(key) ? "checked" : ""} />
            <span>${safeText(title)}</span>
          </label>`;
      }).join("");
      return `
        <div class="admin-card-selector-v454__group">
          <h4>${safeText(category)}</h4>
          <div class="admin-card-selector-v454__checks">${checkboxes}</div>
        </div>`;
    }).join("");

    control.innerHTML = `
      <div class="admin-card-selector-v454__header">
        <div>
          <p class="eyebrow">Visibilità Admin · V${VERSION}</p>
          <h3>Seleziona le card da mostrare</h3>
          <p>Di default le card sono nascoste: spunta solo quelle che ti servono in questa sessione.</p>
        </div>
        <span class="admin-card-selector-v454__badge" data-admin-card-summary-v454>${visible}/${total} visibili</span>
      </div>
      <details class="admin-card-selector-v454__details" open>
        <summary>Menu card Admin</summary>
        <div class="admin-card-selector-v454__actions">
          <button class="button button-secondary button-small" type="button" data-admin-card-action-v454="all">Mostra tutte</button>
          <button class="button button-secondary button-small" type="button" data-admin-card-action-v454="none">Nascondi tutte</button>
        </div>
        <div class="admin-card-selector-v454__grid">${groupsHtml}</div>
        <label class="admin-card-selector-v454__qa">
          <input type="checkbox" data-admin-qa-toggle-v454 ${isQaChecklistEnabled() ? "checked" : ""} />
          <span>Mostra Checklist QA Admin in basso</span>
        </label>
      </details>`;
    return control;
  }

  function applyQaChecklistVisibility() {
    const panel = document.getElementById(CHECKLIST_ID);
    if (!panel) return;
    const enabled = isQaChecklistEnabled();
    panel.classList.toggle("admin-qa-hidden-v454", !enabled);
    if (!enabled) {
      panel.hidden = true;
      panel.setAttribute("aria-hidden", "true");
    } else {
      panel.hidden = false;
      panel.removeAttribute("aria-hidden");
    }
    const toggle = document.querySelector("[data-admin-qa-toggle-v454]");
    if (toggle) toggle.checked = enabled;
  }

  function applyCategoryVisibility(adminPanel) {
    if (!adminPanel) return;
    adminPanel.querySelectorAll(".admin-category-section, .admin-category").forEach((category) => {
      const cards = Array.from(category.querySelectorAll(".panel[data-admin-card-visibility-key-v454], .admin-publication-dashboard-v368[data-admin-card-visibility-key-v454]"));
      if (!cards.length) return;
      const anyVisible = cards.some((card) => !card.classList.contains("admin-card-hidden-v454"));
      category.classList.toggle("admin-category-empty-v454", !anyVisible);
      category.hidden = !anyVisible;
      category.setAttribute("aria-hidden", anyVisible ? "false" : "true");
    });
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
      card.classList.toggle("admin-card-hidden-v454", !visible);
      card.hidden = !visible;
      card.setAttribute("aria-hidden", visible ? "false" : "true");
    });
    applyCategoryVisibility(adminPanel);
    const summary = document.querySelector("[data-admin-card-summary-v454]");
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
    const cardToggle = event.target.closest?.("[data-admin-card-toggle-v454]");
    if (cardToggle) {
      const selected = new Set(getSelectedCards());
      if (cardToggle.checked) selected.add(cardToggle.value);
      else selected.delete(cardToggle.value);
      setSelectedCards(Array.from(selected));
      applyCardVisibility();
      return;
    }
    const qaToggle = event.target.closest?.("[data-admin-qa-toggle-v454]");
    if (qaToggle) {
      setQaChecklistEnabled(Boolean(qaToggle.checked));
      applyQaChecklistVisibility();
    }
  });

  document.addEventListener("click", (event) => {
    const action = event.target.closest?.("[data-admin-card-action-v454]")?.dataset?.adminCardActionV454;
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.body, { childList: true, subtree: true });
      applyCardVisibility();
    });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
    applyCardVisibility();
  }

  window.LeagueAdminCardVisibilityV454 = Object.freeze({
    version: `V${VERSION}`,
    storageSelected: STORAGE_SELECTED,
    storageQa: STORAGE_QA,
    apply: applyCardVisibility,
    getSelectedCards,
    setSelectedCards,
    isQaChecklistEnabled,
    setQaChecklistEnabled
  });
  window.ZonaOrientaleAdminCardVisibilityV454 = window.LeagueAdminCardVisibilityV454;
  window.FantaPetilloAdminCardVisibilityV454 = window.LeagueAdminCardVisibilityV454;
})();
