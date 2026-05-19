export function getCompetitionStatusClass(status) {
  if (status === "ATTIVA") return "status-ok";
  if (status === "PROGRAMMATA") return "status-warning";
  if (status === "CONCLUSA") return "status-muted";
  return "status-danger";
}

export function requestStatusLabel(status) {
  return {
    PENDING: "In attesa",
    APPROVED: "Approvata",
    REJECTED: "Rifiutata",
    EMAIL_NOT_VERIFIED: "Email da verificare"
  }[status] || status || "-";
}

export function requestTypeLabel(type) {
  return {
    FM_MOVEMENT: "Movimento FM",
    TEAM_NEWS: "Comunicato squadra",
    PLAYER_BUY_REQUEST: "Richiesta acquisto",
    PLAYER_RELEASE_REQUEST: "Richiesta svincolo",
    PLAYER_TRADE_REQUEST: "Richiesta scambio"
  }[type] || type || "-";
}

export function newsTopicLabelV48(topic) {
  const labels = {
    GENERALE: "Generale",
    COMPETIZIONE: "Competizione",
    COMUNICATO_SQUADRA: "Comunicato squadra",
    COMUNICATO_UFFICIALE_SQUADRA: "Comunicato ufficiale squadra",
    TEAM_NEWS: "Comunicato squadra"
  };
  return labels[topic] || topic || "News";
}
