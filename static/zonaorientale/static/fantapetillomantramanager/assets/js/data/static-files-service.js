import { state } from "../core/state.js";
import { getLeagueDataPathV446, joinLeagueDataPathV446, loadLeagueConfigV443 } from "../core/league-config-v443.js?v=457";

async function ensureLeagueDataPathsV446() {
  await loadLeagueConfigV443().catch(() => null);
}

export async function loadListoniData() {
  try {
    await ensureLeagueDataPathsV446();
    const manifestResponse = await fetch(getLeagueDataPathV446("listoniManifest", "./assets/listoni/manifest.json"), { cache: "no-store" });
    if (!manifestResponse.ok) {
      state.listoni = [];
      return;
    }

    const manifest = await manifestResponse.json();
    const entries = Array.isArray(manifest.listoni) ? manifest.listoni : [];

    const loadedListoni = await Promise.all(entries.map(async (entry) => {
      try {
        const response = await fetch(joinLeagueDataPathV446("listoniBase", entry.file, "./assets/listoni/"), { cache: "no-store" });
        if (!response.ok) throw new Error(`Listone non leggibile: ${entry.file}`);
        const payload = await response.json();
        return {
          ...entry,
          meta: payload.meta || {},
          players: Array.isArray(payload.players) ? payload.players : []
        };
      } catch (error) {
        console.warn(error);
        return { ...entry, meta: {}, players: [], loadError: true };
      }
    }));

    state.listoni = loadedListoni.sort((a, b) => String(b.loadedAt || b.id || "").localeCompare(String(a.loadedAt || a.id || ""), "it"));
  } catch (error) {
    console.warn("Listoni non caricati", error);
    state.listoni = [];
  }
}

export async function loadRostersData() {
  try {
    await ensureLeagueDataPathsV446();
    const manifestResponse = await fetch(getLeagueDataPathV446("rostersManifest", "./assets/rose/manifest.json"), { cache: "no-store" });
    if (!manifestResponse.ok) {
      state.rosters = [];
      return;
    }

    const manifest = await manifestResponse.json();
    const entries = Array.isArray(manifest.rosters) ? manifest.rosters : [];

    const loadedRosters = await Promise.all(entries.map(async (entry) => {
      try {
        const response = await fetch(joinLeagueDataPathV446("rostersBase", entry.file, "./assets/rose/"), { cache: "no-store" });
        if (!response.ok) throw new Error(`Rose non leggibili: ${entry.file}`);
        const payload = await response.json();
        return {
          ...entry,
          meta: payload.meta || {},
          rosters: Array.isArray(payload.rosters) ? payload.rosters : []
        };
      } catch (error) {
        console.warn(error);
        return { ...entry, meta: {}, rosters: [], loadError: true };
      }
    }));

    state.rosters = loadedRosters.sort((a, b) => String(b.loadedAt || b.id || "").localeCompare(String(a.loadedAt || a.id || ""), "it"));
  } catch (error) {
    console.warn("Rose non caricate", error);
    state.rosters = [];
  }
}


export async function loadCompetitionCalendarData() {
  try {
    await ensureLeagueDataPathsV446();
    const manifestResponse = await fetch(getLeagueDataPathV446("competitionsManifest", "./assets/competitions/manifest.json"), { cache: "no-store" });
    if (!manifestResponse.ok) {
      state.competitionCalendars = [];
      return;
    }

    const manifest = await manifestResponse.json();
    const entries = Array.isArray(manifest.competitions)
      ? manifest.competitions
      : Array.isArray(manifest.items)
        ? manifest.items
        : [];

    const loadedCalendars = await Promise.all(entries.map(async (entry) => {
      try {
        const response = await fetch(joinLeagueDataPathV446("competitionsBase", entry.file, "./assets/competitions/"), { cache: "no-store" });
        if (!response.ok) throw new Error(`Calendario competizione non leggibile: ${entry.file}`);
        const payload = await response.json();
        return {
          ...entry,
          meta: payload.meta || {},
          competition: payload.competition || null,
          matches: Array.isArray(payload.matches) ? payload.matches : [],
          results: Array.isArray(payload.results) ? payload.results : []
        };
      } catch (error) {
        console.warn(error);
        return { ...entry, meta: {}, competition: null, matches: [], results: [], loadError: true };
      }
    }));

    state.competitionCalendars = loadedCalendars.sort((a, b) => String(b.loadedAt || b.id || "").localeCompare(String(a.loadedAt || a.id || ""), "it"));
  } catch (error) {
    console.warn("Calendari competizioni statici non caricati", error);
    state.competitionCalendars = [];
  }
}
