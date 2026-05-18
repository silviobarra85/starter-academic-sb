import { ADMIN_PANEL_IDS, COLLECTIONS, DEFAULT_HIDDEN_LISTONE_COLUMNS } from "./constants.js";

export const state = {
  raw: Object.fromEntries(COLLECTIONS.map((name) => [name, []])),
  user: null,
  isAdmin: false,
  currentPage: "dashboard",
  selectedSeasonId: "",
  selectedResultCompetitionId: "",
  selectedMatchCompetitionId: "",
  selectedAdminSeasonTeamSeasonId: "",
  selectedAdminStadiumSeasonId: "",
  selectedAdminCompetitionSeasonId: "",
  selectedAdminMatchSeasonId: "",
  selectedAdminMatchdayFilter: "",
  selectedAdminResultsSeasonId: "",
  selectedListoneId: "",
  selectedClubRosterFilter: "all",
  listoni: [],
  rosters: [],
  listoneSort: { key: "playerName", direction: "asc" },
  freeAgentsSort: { key: "playerName", direction: "asc" },
  rosterSort: { key: "role", direction: "asc" },
  selectedAdminMovementSeasonTeamId: "",
  hiddenListoneColumns: new Set(DEFAULT_HIDDEN_LISTONE_COLUMNS),
  collapsedAdminPanels: new Set(ADMIN_PANEL_IDS),
  collapsedContentPanels: new Set()
};
