export const COLLECTIONS = [
  "leagueSettings",
  "seasons",
  "presidents",
  "teams",
  "seasonTeams",
  "stadiums",
  "competitions",
  "competitionMatches",
  "competitionResults",
  "honorRoll",
  "fifaRankings"
];

export const COMPETITION_TYPES = [
  { value: "CAMPIONATO", label: "Campionato" },
  { value: "COPPA_ITALIA", label: "Coppa Italia" },
  { value: "CHAMPIONS_LEAGUE", label: "Champion's League" },
  { value: "PLAYOFF", label: "Playoff" },
  { value: "ALTRO", label: "Altro" }
];

export const COMPETITION_FORMATS = [
  { value: "CLASSIFICA", label: "A classifica" },
  { value: "GIRONI_KO", label: "A gironi + quarti/semifinali/finale" }
];

export const COMPETITION_STATUSES = [
  { value: "ATTIVA", label: "Attiva" },
  { value: "PROGRAMMATA", label: "Programmata" },
  { value: "CONCLUSA", label: "Conclusa" },
  { value: "NON_DISPUTATA", label: "Non disputata" }
];

export const DEFAULT_COMPETITIONS = [
  {
    idSuffix: "campionato",
    name: "Campionato",
    type: "CAMPIONATO",
    format: "CLASSIFICA",
    status: "PROGRAMMATA"
  },
  {
    idSuffix: "champions-league",
    name: "Champion's League",
    type: "CHAMPIONS_LEAGUE",
    format: "GIRONI_KO",
    status: "PROGRAMMATA"
  },
  {
    idSuffix: "coppa-italia",
    name: "Coppa Italia",
    type: "COPPA_ITALIA",
    format: "GIRONI_KO",
    status: "PROGRAMMATA"
  },
  {
    idSuffix: "playoff",
    name: "Playoff",
    type: "PLAYOFF",
    format: "GIRONI_KO",
    status: "PROGRAMMATA"
  }
];

export const MATCH_STATUSES = [
  { value: "DA_GIOCARE", label: "Da giocare" },
  { value: "GIOCATA", label: "Giocata" }
];

export const STANDARD_KNOCKOUT_MATCHDAYS = [
  "QF - Andata",
  "QF - Ritorno",
  "QF - Secca",
  "SF - Andata",
  "SF - Ritorno",
  "SF - Secca",
  "Finale - Andata",
  "Finale - Ritorno",
  "Finalissima"
];

export const STADIUM_LEVELS = [
  { value: 0, label: "Livello 0" },
  { value: 1, label: "Livello 1" },
  { value: 2, label: "Livello 2" },
  { value: 3, label: "Livello 3" },
  { value: 4, label: "Livello 4" }
];

export const ADMIN_PANEL_IDS = [
  "adminSeasonsPanel",
  "adminPresidentsPanel",
  "adminTeamsPanel",
  "adminSeasonTeamsPanel",
  "adminStadiumsPanel",
  "adminCompetitionsPanel",
  "adminCompetitionMatchesPanel",
  "adminCompetitionResultsPanel",
  "adminFifaRankingPanel",
  "adminListoneToolsPanel",
  "adminBackupPanel"
];

export const LISTONE_COLUMNS = [
  { key: "playerName", label: "Giocatore", numeric: false },
  { key: "classicRole", label: "R (RM)", numeric: false },
  { key: "realTeam", label: "Sq", numeric: false },
  { key: "fantasyRoster", label: "Rosa", numeric: false },
  { key: "quotationCurrent", label: "Qt.A", numeric: true },
  { key: "quotationInitial", label: "Qt.I", numeric: true },
  { key: "quotationDiff", label: "Diff.", numeric: true },
  { key: "quotationCurrentMantra", label: "Qt.A M", numeric: true },
  { key: "quotationInitialMantra", label: "Qt.I M", numeric: true },
  { key: "quotationDiffMantra", label: "Diff.M", numeric: true },
  { key: "fvm", label: "FVM", numeric: true },
  { key: "fvmMantra", label: "FVM M", numeric: true },
  { key: "rosterRole", label: "Ruolo rosa", numeric: false },
  { key: "rosterCost", label: "Costo rosa", numeric: true },
  { key: "status", label: "Stato", numeric: false },
  { key: "sourceSheet", label: "Origine", numeric: false }
];

export const DEFAULT_HIDDEN_LISTONE_COLUMNS = [
  "quotationInitialMantra",
  "quotationDiffMantra",
  "fvmMantra",
  "rosterRole",
  "rosterCost",
  "sourceSheet"
];
