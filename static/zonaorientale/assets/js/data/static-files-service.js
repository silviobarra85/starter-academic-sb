import { state } from "../core/state.js";

export async function loadListoniData() {
  try {
    const manifestResponse = await fetch("./assets/listoni/manifest.json", { cache: "no-store" });
    if (!manifestResponse.ok) {
      state.listoni = [];
      return;
    }

    const manifest = await manifestResponse.json();
    const entries = Array.isArray(manifest.listoni) ? manifest.listoni : [];

    const loadedListoni = await Promise.all(entries.map(async (entry) => {
      try {
        const response = await fetch(`./assets/listoni/${entry.file}`, { cache: "no-store" });
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
    const manifestResponse = await fetch("./assets/rose/manifest.json", { cache: "no-store" });
    if (!manifestResponse.ok) {
      state.rosters = [];
      return;
    }

    const manifest = await manifestResponse.json();
    const entries = Array.isArray(manifest.rosters) ? manifest.rosters : [];

    const loadedRosters = await Promise.all(entries.map(async (entry) => {
      try {
        const response = await fetch(`./assets/rose/${entry.file}`, { cache: "no-store" });
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
