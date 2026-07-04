export function getDashboardNewsPreview(body, maxLength = 190) {
  const text = String(body || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/[\s,.!?;:]+$/g, "")}...`;
}
