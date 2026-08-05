import { parseDecimalValue } from "../core/ui.js";

export function loadXlsxLibrary() {
  if (window.XLSX) return Promise.resolve(window.XLSX);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-xlsx-loader]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.XLSX));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
    script.async = true;
    script.dataset.xlsxLoader = "true";
    script.addEventListener("load", () => window.XLSX ? resolve(window.XLSX) : reject(new Error("SheetJS non disponibile.")));
    script.addEventListener("error", () => reject(new Error("Impossibile caricare la libreria Excel.")));
    document.head.appendChild(script);
  });
}

const REAL_TEAM_CANONICAL_CODES_V274 = Object.freeze({
  ata: "ATA", atalanta: "ATA",
  bol: "BOL", bologna: "BOL",
  cag: "CAG", cagliari: "CAG",
  com: "COM", como: "COM",
  cre: "CRE", cremonese: "CRE",
  emp: "EMP", empoli: "EMP",
  fio: "FIO", fiorentina: "FIO",
  fro: "FRO", frosinone: "FRO",
  gen: "GEN", genoa: "GEN",
  int: "INT", inter: "INT", internazionale: "INT",
  juv: "JUV", juventus: "JUV", juve: "JUV",
  laz: "LAZ", lazio: "LAZ",
  lec: "LEC", lecce: "LEC",
  mil: "MIL", milan: "MIL", acmilan: "MIL", ac: "MIL",
  mon: "MON", monza: "MON",
  nap: "NAP", napoli: "NAP",
  par: "PAR", parma: "PAR",
  pis: "PIS", pisa: "PIS",
  rom: "ROM", roma: "ROM",
  sas: "SAS", sassuolo: "SAS",
  tor: "TOR", torino: "TOR",
  udi: "UDI", udinese: "UDI",
  ven: "VEN", venezia: "VEN",
  ver: "VER", verona: "VER", hellasverona: "VER", hellas: "VER",
  sal: "SAL", salernitana: "SAL",
  sam: "SAM", sampdoria: "SAM",
  spe: "SPE", spezia: "SPE"
});

function normalizeRealTeamKeyV274(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function getCanonicalRealTeamCodeV274(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const normalized = normalizeRealTeamKeyV274(raw);
  const direct = REAL_TEAM_CANONICAL_CODES_V274[normalized];
  if (direct) return direct;
  const compact = raw.replace(/[^A-Za-z0-9]/g, "");
  if (/^[A-Za-z]{2,4}$/.test(compact)) return compact.slice(0, 3).toUpperCase();
  return raw.slice(0, 3).toUpperCase();
}

export function abbreviateRealTeam(value) {
  return getCanonicalRealTeamCodeV274(value);
}

function toNumberOrValue(value) {
  const parsed = parseDecimalValue(value);
  return parsed === null ? (value ?? "") : parsed;
}

function normalizeHeaderName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ")
    .replace(/\.+$/g, "")
    .replace(/\s*\/\s*/g, "/");
}

function buildHeaderLookup(headers) {
  const normalizedHeaders = headers.map(normalizeHeaderName);
  const find = (...aliases) => {
    const normalizedAliases = aliases.map(normalizeHeaderName);
    for (const alias of normalizedAliases) {
      const exact = normalizedHeaders.indexOf(alias);
      if (exact >= 0) return exact;
    }
    return -1;
  };
  return { normalizedHeaders, find };
}

function hasValue(row, index) {
  if (index < 0) return false;
  const value = row[index];
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function cell(row, index) {
  return index >= 0 ? row[index] : "";
}

function isOutOfListValue(value) {
  if (value === null || value === undefined) return false;
  const raw = String(value).trim();
  if (!raw) return false;
  const normalized = raw.toLowerCase();
  if (["0", "n", "no", "false", "falso", "-", "non", "no.", "no"].includes(normalized)) return false;
  return true;
}

function findHeaderIndex(rows) {
  return rows.findIndex((row) => row.some((cellValue) => normalizeHeaderName(cellValue) === "nome"));
}

export function parseListoneSheetRows(rows, sourceSheet, status, statusCode) {
  const headerIndex = findHeaderIndex(rows);
  if (headerIndex < 0) return [];
  const headers = rows[headerIndex].map((header) => String(header || "").trim());
  const { find } = buildHeaderLookup(headers);
  const idx = {
    id: find("id", "#"),
    role: find("r", "r.", "ruolo"),
    mantra: find("rm", "r.m", "r mantra", "r.mantra", "r.mantra."),
    name: find("nome", "calciatore", "giocatore"),
    team: find("squadra", "sq", "sq.", "team"),
    qta: find("qt.a", "qta", "quot", "quot.", "quotazione"),
    qti: find("qt.i", "qti"),
    diff: find("diff", "diff."),
    qtam: find("qt.a m", "qta m", "qt.a mantra", "qta mantra"),
    qtim: find("qt.i m", "qti m", "qt.i mantra", "qti mantra"),
    diffm: find("diff.m", "diff m", "diff mantra"),
    fvm: find("fvm", "fvm/1000"),
    fvmm: find("fvm m", "fvm mantra", "fvm m.")
  };

  if (idx.name < 0) return [];

  return rows.slice(headerIndex + 1)
    .filter((row) => hasValue(row, idx.name))
    .map((row) => ({
      fantacalcioId: String(cell(row, idx.id) || ""),
      classicRole: String(cell(row, idx.role) || ""),
      mantraRoles: String(cell(row, idx.mantra) || ""),
      playerName: String(cell(row, idx.name) || ""),
      realTeam: abbreviateRealTeam(cell(row, idx.team)),
      realTeamOriginal: String(cell(row, idx.team) || ""),
      quotationCurrent: toNumberOrValue(cell(row, idx.qta)),
      quotationInitial: toNumberOrValue(cell(row, idx.qti)),
      quotationDiff: toNumberOrValue(cell(row, idx.diff)),
      quotationCurrentMantra: toNumberOrValue(cell(row, idx.qtam)),
      quotationInitialMantra: toNumberOrValue(cell(row, idx.qtim)),
      quotationDiffMantra: toNumberOrValue(cell(row, idx.diffm)),
      fvm: toNumberOrValue(cell(row, idx.fvm)),
      fvmMantra: toNumberOrValue(cell(row, idx.fvmm)),
      fantasyRoster: "",
      rosterRole: "",
      rosterCost: "",
      status,
      statusCode,
      sourceSheet
    }));
}

function parseClassicSingleSheetRows(rows, sourceSheet) {
  const headerIndex = findHeaderIndex(rows);
  if (headerIndex < 0) return [];

  const headers = rows[headerIndex].map((header) => String(header || "").trim());
  const { find } = buildHeaderLookup(headers);
  const idx = {
    id: find("#", "id", "codice"),
    name: find("nome", "calciatore", "giocatore"),
    outOfList: find("fuori lista", "fuorilista", "asteriscato", "asterisco"),
    team: find("sq", "sq.", "squadra", "team"),
    role: find("r", "r.", "ruolo"),
    mantra: find("r.mantra", "r.mantra.", "r mantra", "rm", "r.m"),
    quotation: find("quot", "quot.", "quotazione", "qt.a", "qta"),
    fvm: find("fvm/1000", "fvm"),
    fantasyRoster: find("fantasquadra", "fanta squadra", "rosa"),
    rosterCost: find("costo", "costo rosa"),
    under: find("under"),
    played: find("pgv", "pg", "presenze"),
    average: find("mv"),
    fantasyAverage: find("fm")
  };

  if (idx.name < 0) return [];

  return rows.slice(headerIndex + 1)
    .filter((row) => hasValue(row, idx.name))
    .map((row) => {
      const isAsterisk = isOutOfListValue(cell(row, idx.outOfList));
      return {
        fantacalcioId: String(cell(row, idx.id) || ""),
        classicRole: String(cell(row, idx.role) || ""),
        mantraRoles: String(cell(row, idx.mantra) || ""),
        playerName: String(cell(row, idx.name) || ""),
        realTeam: abbreviateRealTeam(cell(row, idx.team)),
        realTeamOriginal: String(cell(row, idx.team) || ""),
        quotationCurrent: toNumberOrValue(cell(row, idx.quotation)),
        quotationInitial: "",
        quotationDiff: "",
        quotationCurrentMantra: "",
        quotationInitialMantra: "",
        quotationDiffMantra: "",
        fvm: toNumberOrValue(cell(row, idx.fvm)),
        fvmMantra: "",
        fantasyRoster: String(cell(row, idx.fantasyRoster) || ""),
        rosterRole: String(cell(row, idx.role) || ""),
        rosterCost: toNumberOrValue(cell(row, idx.rosterCost)),
        status: isAsterisk ? "asteriscato" : "In listone",
        statusCode: isAsterisk ? "ASTERISCATO" : "IN_LISTONE",
        sourceSheet,
        sourceFormat: "CLASSIC_SINGLE_SHEET",
        sourceExtra: {
          under: String(cell(row, idx.under) || ""),
          played: toNumberOrValue(cell(row, idx.played)),
          average: toNumberOrValue(cell(row, idx.average)),
          fantasyAverage: toNumberOrValue(cell(row, idx.fantasyAverage)),
          outOfList: String(cell(row, idx.outOfList) || "")
        }
      };
    });
}

function sheetRows(workbook, XLSX, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  return sheet ? XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) : [];
}

function findSheetName(workbook, expectedName) {
  const target = normalizeHeaderName(expectedName);
  return (workbook.SheetNames || []).find((name) => normalizeHeaderName(name) === target) || "";
}

export function parseListoneWorkbook(workbook, XLSX) {
  const warnings = [];
  const tuttiSheetName = findSheetName(workbook, "Tutti");
  const cedutiSheetName = findSheetName(workbook, "Ceduti");

  if (tuttiSheetName || cedutiSheetName) {
    const activePlayers = parseListoneSheetRows(sheetRows(workbook, XLSX, tuttiSheetName), tuttiSheetName || "Tutti", "In listone", "IN_LISTONE");
    const asteriskPlayers = parseListoneSheetRows(sheetRows(workbook, XLSX, cedutiSheetName), cedutiSheetName || "Ceduti", "asteriscato", "ASTERISCATO");
    const players = [...activePlayers, ...asteriskPlayers];
    if (players.length) {
      return {
        parserVersion: "V274",
        format: "LEGACY_TUTTI_CEDUTI",
        formatLabel: "Fantacalcio storico: fogli Tutti/Ceduti",
        sourceSheets: [tuttiSheetName, cedutiSheetName].filter(Boolean),
        activePlayers,
        asteriskPlayers,
        players,
        warnings
      };
    }
    warnings.push("Trovati fogli Tutti/Ceduti, ma nessun giocatore valido: provo il riconoscimento automatico a foglio singolo.");
  }

  let best = null;
  for (const sheetName of workbook.SheetNames || []) {
    const rows = sheetRows(workbook, XLSX, sheetName);
    const players = parseClassicSingleSheetRows(rows, sheetName);
    if (!best || players.length > best.players.length) {
      best = { sheetName, players };
    }
  }

  const classicPlayers = best?.players || [];
  const activePlayers = classicPlayers.filter((player) => player.statusCode !== "ASTERISCATO");
  const asteriskPlayers = classicPlayers.filter((player) => player.statusCode === "ASTERISCATO");

  if (!classicPlayers.length) {
    warnings.push("Nessun foglio riconosciuto. Sono supportati il formato Tutti/Ceduti e il formato Classic a foglio singolo con colonna Nome.");
  }

  return {
    parserVersion: "V274",
    format: "CLASSIC_SINGLE_SHEET",
    formatLabel: "Fantacalcio Classic a foglio singolo",
    sourceSheets: best?.sheetName ? [best.sheetName] : [],
    activePlayers,
    asteriskPlayers,
    players: classicPlayers,
    warnings
  };
}
