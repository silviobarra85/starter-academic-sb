import { COLLECTIONS } from "../core/constants.js";
import { state } from "../core/state.js";
import { loadCollection as defaultLoadCollection } from "./firestore-service.js";
import {
  loadListoniData as defaultLoadListoniData,
  loadRostersData as defaultLoadRostersData,
  loadCompetitionCalendarData as defaultLoadCompetitionCalendarData
} from "./static-files-service.js";

function noopLogger() {
  return {
    warn: () => {},
    error: () => {},
    info: () => {}
  };
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function createZonaDataRepositoryV222(options = {}) {
  const logger = options.logger || console || noopLogger();
  const collectionNames = ensureArray(options.collectionNames).length ? options.collectionNames : COLLECTIONS;
  const loadCollection = options.loadCollection || defaultLoadCollection;
  const loadListoniData = options.loadListoniData || defaultLoadListoniData;
  const loadRostersData = options.loadRostersData || defaultLoadRostersData;
  const loadCompetitionCalendarData = options.loadCompetitionCalendarData || defaultLoadCompetitionCalendarData;
  const loadStaticCompetitionCalendars = options.loadStaticCompetitionCalendars || loadCompetitionCalendarData;

  async function loadCollections(names = collectionNames) {
    const safeNames = ensureArray(names);
    const entries = await Promise.all(
      safeNames.map(async (name) => [name, await loadCollection(name)])
    );
    return Object.fromEntries(entries);
  }

  async function loadLeagueConfigFromFirebase() {
    const [leagueSettings, seasons] = await Promise.all([
      loadCollection("leagueSettings"),
      loadCollection("seasons")
    ]);
    return { leagueSettings, seasons };
  }

  async function loadStaticAssets() {
    await Promise.all([
      loadListoniData(),
      loadRostersData(),
      loadStaticCompetitionCalendars()
    ]);
    return {
      listoni: state.listoni,
      rosters: state.rosters,
      competitionCalendars: state.competitionCalendars
    };
  }

  async function loadPublicConfig(loadStaticPublicConfig, getDefaultSeasonIdFromRaw) {
    if (typeof loadStaticPublicConfig === "function") {
      const staticConfig = await loadStaticPublicConfig();
      if (staticConfig) return { ...staticConfig, source: staticConfig.source || "static" };
    }

    const firebaseConfig = await loadLeagueConfigFromFirebase();
    return {
      ...firebaseConfig,
      currentSeasonId: typeof getDefaultSeasonIdFromRaw === "function"
        ? getDefaultSeasonIdFromRaw(firebaseConfig)
        : "",
      source: "firebase"
    };
  }

  return {
    version: "222",
    loadCollection,
    loadCollections,
    loadLeagueConfigFromFirebase,
    loadStaticAssets,
    loadPublicConfig,
    getStaticStateSnapshot() {
      return {
        listoni: state.listoni,
        rosters: state.rosters,
        competitionCalendars: state.competitionCalendars
      };
    },
    diagnose() {
      const snapshot = this.getStaticStateSnapshot();
      logger.info("[FantaPetillo] Data repository V222", {
        collections: collectionNames.length,
        listoni: snapshot.listoni.length,
        rosters: snapshot.rosters.length,
        competitionCalendars: snapshot.competitionCalendars.length
      });
      return snapshot;
    }
  };
}
