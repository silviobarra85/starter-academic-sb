import { escapeHtml } from "../core/utils.js";

export const FM_MOVEMENT_TYPES = [
  { value: "INITIAL_BUDGET", label: "Budget iniziale", player: false, target: false },
  { value: "ACQUISTO", label: "Acquisto", player: true, target: false },
  { value: "VENDITA", label: "Vendita", player: true, target: false },
  { value: "SVINCOLO", label: "Svincolo", player: true, target: false },
  { value: "SCAMBIO", label: "Scambio", player: true, target: true },
  { value: "RETTIFICA", label: "Rettifica", player: false, target: false },
  { value: "BONUS", label: "Bonus", player: false, target: false },
  { value: "PENALITA", label: "Penalità", player: false, target: false },
  { value: "ALTRO", label: "Altro", player: false, target: false }
];

export function getFmMovementLabel(type) {
  return FM_MOVEMENT_TYPES.find((item) => item.value === type)?.label || type || "-";
}

export function renderFmMovementTypeBadge(type) {
  return `<span class="status status-muted movement-type-badge">${escapeHtml(getFmMovementLabel(type))}</span>`;
}
