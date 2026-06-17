/* V225 - Refactor stability checks.
   Controlli leggeri post-refactor: non cambiano UI, dati o Firebase.
   Espongono solo un report runtime utile per debug dopo gli overlay V220-V224. */

function hasFunction(target, name) {
  return Boolean(target && typeof target[name] === "function");
}

function buildCheck(name, ok, details = "") {
  return {
    name,
    ok: Boolean(ok),
    details
  };
}

export function runRefactorStabilityChecksV225(options = {}) {
  const logger = options.logger || console;
  const checks = [
    buildCheck(
      "data-repository",
      hasFunction(options.dataRepository, "loadCollections")
        && hasFunction(options.dataRepository, "loadStaticAssets")
        && hasFunction(options.dataRepository, "loadPublicConfig"),
      "V222 repository facade"
    ),
    buildCheck(
      "render-orchestrator",
      hasFunction(options.renderOrchestrator, "renderAll")
        && hasFunction(options.renderOrchestrator, "renderPublic")
        && hasFunction(options.renderOrchestrator, "renderAdmin"),
      "V221 public/admin render orchestrator"
    ),
    buildCheck(
      "mobile-chrome",
      hasFunction(options.mobileChrome, "setupGlobalScrollTopButton")
        && hasFunction(options.mobileChrome, "enforceSmartphoneChrome"),
      "V220 mobile chrome controller"
    ),
    buildCheck(
      "historical-stats",
      hasFunction(options.historicalStats, "renderAllSurfaces")
        && hasFunction(options.historicalStats, "ensureHistoricalStaticSnapshotsLoadedV224")
        && hasFunction(options.historicalStats, "buildHistoricalStats"),
      "V224 historical stats hardening"
    ),
    buildCheck(
      "season-archive",
      hasFunction(options.archiveApi, "render")
        && hasFunction(options.archiveApi, "build")
        && hasFunction(options.archiveApi, "getSortedSeasons"),
      "V215/V218/V219 archive helpers"
    )
  ];

  const report = {
    version: options.version || "V225",
    generatedAt: new Date().toISOString(),
    ok: checks.every((check) => check.ok),
    checks
  };

  window.FantaPetilloRefactorStatus = report;

  if (!report.ok) {
    const failed = checks.filter((check) => !check.ok).map((check) => check.name).join(", ");
    logger.warn?.(`[FantaPetillo] Stabilita refactor incompleta: ${failed}`, report);
  }

  return report;
}
