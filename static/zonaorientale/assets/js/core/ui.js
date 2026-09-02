import { escapeHtml } from "./utils.js";
import { getLeagueLogoPathV446 } from "./league-config-v443.js?v=802";

export function renderBoldMarkdown(value) {
  const escaped = escapeHtml(value || "");
  return escaped.replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>");
}

export function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function safeFileName(value) {
  return String(value || "export")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "export";
}

export function showMessage(elementId, message, isError = false) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("text-danger", Boolean(isError));
  element.classList.toggle("text-success", !isError && Boolean(message));
}

export function setError(message) {
  const box = document.getElementById("errorBox");
  if (!box) return;
  if (!message) {
    box.classList.add("hidden");
    box.textContent = "";
    return;
  }
  box.classList.remove("hidden");
  box.textContent = message;
}

export function setLoadingText(targetId, text) {
  const element = document.getElementById(targetId);
  if (element) element.innerHTML = `<p class="muted">${escapeHtml(text)}</p>`;
}

export function getLabel(options, value) {
  return options.find((option) => option.value === value)?.label || value || "-";
}

export function parseDecimalValue(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim().replace(/\s+/g, "").replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function makeIdPart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

export function getInitials(name) {
  const cleanName = String(name || "?").trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
}

export function isBase64Logo(value) {
  return typeof value === "string" && value.trim().startsWith("data:");
}

export function normalizeLogoPath(value) {
  const raw = String(value || "").trim();
  if (!raw || isBase64Logo(raw)) return "";
  return getLeagueLogoPathV446(raw);
}

export function getLogoPathForInput(value) {
  return isBase64Logo(value) ? "" : String(value || "").trim();
}

export function renderTeamLogo(name, logo, extraClass = "") {
  const logoPath = normalizeLogoPath(logo);
  if (logoPath) {
    return `<img class="club-logo ${extraClass}" src="${escapeHtml(logoPath)}" alt="" />`;
  }
  return `<span class="club-logo club-logo-placeholder ${extraClass}">${escapeHtml(getInitials(name))}</span>`;
}

export function readLogoFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const image = new Image();

      image.addEventListener("load", () => {
        const maxSize = 320;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/png"));
      });

      image.addEventListener("error", () => reject(new Error("Logo non leggibile.")));
      image.src = reader.result;
    });

    reader.addEventListener("error", () => reject(new Error("Impossibile leggere il file logo.")));
    reader.readAsDataURL(file);
  });
}
