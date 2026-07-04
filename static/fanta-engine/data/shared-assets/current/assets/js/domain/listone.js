import { parseDecimalValue } from "../core/ui.js";

export function getListoneValue(player, key) {
  if (key === "fantasyRoster") return player.fantasyRoster || "Svincolati";
  return player[key] ?? "";
}

export function compareListoneValues(a, b, column) {
  const valueA = getListoneValue(a, column.key);
  const valueB = getListoneValue(b, column.key);

  if (column.numeric) {
    const numberA = parseDecimalValue(valueA) ?? Number.NEGATIVE_INFINITY;
    const numberB = parseDecimalValue(valueB) ?? Number.NEGATIVE_INFINITY;
    return numberA - numberB;
  }

  return String(valueA || "").localeCompare(String(valueB || ""), "it", { numeric: true, sensitivity: "base" });
}
