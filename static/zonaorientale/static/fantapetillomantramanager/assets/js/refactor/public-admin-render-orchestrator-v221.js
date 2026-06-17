/* V221 - Public/Admin render orchestrator.
   Refactor tecnico a basso rischio: separa il ciclo di rendering in gruppi
   pubblici, admin e post-render senza cambiare il comportamento visibile. */

function normalizeRenderers(renderers) {
  if (!Array.isArray(renderers)) return [];
  return renderers.filter(Boolean);
}

function callRenderer(renderer, context) {
  if (typeof renderer === "function") return renderer(context);
  if (renderer && typeof renderer.render === "function") return renderer.render(context);
  return undefined;
}

function runGroup(renderers, context) {
  let lastResult;
  for (const renderer of normalizeRenderers(renderers)) {
    lastResult = callRenderer(renderer, context);
  }
  return lastResult;
}

export function createPublicAdminRenderOrchestratorV221() {
  return {
    renderPublic(renderers, context = {}) {
      return runGroup(renderers, { ...context, renderGroup: "public" });
    },

    renderAdmin(renderers, context = {}) {
      return runGroup(renderers, { ...context, renderGroup: "admin" });
    },

    renderAfter(renderers, context = {}) {
      return runGroup(renderers, { ...context, renderGroup: "after" });
    },

    renderAll({ publicRenderers = [], adminRenderers = [], afterRenderers = [] } = {}, context = {}) {
      const sharedContext = { ...context, version: "V221" };
      this.renderPublic(publicRenderers, sharedContext);
      this.renderAdmin(adminRenderers, sharedContext);
      return this.renderAfter(afterRenderers, sharedContext);
    }
  };
}
