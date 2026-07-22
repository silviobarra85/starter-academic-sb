// V760 - Canonical FantaEngine static-first bootstrap contract.
// League apps may keep a local safety facade, but must preserve this lifecycle:
// public core -> first render -> optional assets -> optional remote auth.

export const STATIC_FIRST_BOOTSTRAP_VERSION_V760 = 'V760';

function normalizeErrorV760(value) {
  return value instanceof Error ? value : new Error(String(value || 'Errore sconosciuto'));
}

function deferRemoteStartV760(callback) {
  const enqueue = typeof globalThis.queueMicrotask === 'function'
    ? globalThis.queueMicrotask.bind(globalThis)
    : (task) => Promise.resolve().then(task);
  if (typeof globalThis.requestAnimationFrame === 'function') {
    globalThis.requestAnimationFrame(() => enqueue(callback));
    return;
  }
  enqueue(callback);
}

export function createStaticFirstBootstrapV760(options = {}) {
  if (typeof options.loadPublicData !== 'function') {
    throw new TypeError('FantaEngine V760 richiede loadPublicData().');
  }

  const logger = options.logger || console;
  const diagnostics = {
    version: STATIC_FIRST_BOOTSTRAP_VERSION_V760,
    phase: 'created',
    createdAt: new Date().toISOString(),
    publicStartedAt: '',
    publicReadyAt: '',
    authStartedAt: '',
    authReadyAt: '',
    publicError: '',
    authError: '',
    staticAssetsPhase: 'pending'
  };
  let publicPromise = null;
  let authPromise = null;

  function publishV760() {
    const snapshot = Object.freeze({ ...diagnostics });
    try { options.onDiagnostic?.(snapshot); }
    catch (error) { logger.warn?.('[FantaEngine V760] diagnostica non pubblicata', error); }
    return snapshot;
  }

  function startAuthV760() {
    if (authPromise) return authPromise;
    if (typeof options.startAuth !== 'function') return Promise.resolve(null);
    diagnostics.authStartedAt = new Date().toISOString();
    publishV760();
    authPromise = Promise.resolve()
      .then(() => options.startAuth())
      .then((result) => {
        diagnostics.authReadyAt = new Date().toISOString();
        diagnostics.authError = '';
        if (diagnostics.phase === 'public-ready') diagnostics.phase = 'ready';
        publishV760();
        return result;
      })
      .catch((error) => {
        const normalized = normalizeErrorV760(error);
        diagnostics.authError = normalized.message;
        publishV760();
        logger.warn?.('[FantaEngine V760] Firebase/Auth non disponibile; il sito pubblico resta operativo.', normalized);
        return null;
      });
    return authPromise;
  }

  function startPublicV760() {
    if (publicPromise) return publicPromise;
    diagnostics.phase = 'public-loading';
    diagnostics.publicStartedAt = new Date().toISOString();
    publishV760();
    publicPromise = Promise.resolve()
      .then(() => options.loadPublicData())
      .then((result) => {
        if (typeof options.hasUsableData === 'function' && !options.hasUsableData()) {
          throw new Error('Il caricamento statico non ha prodotto dati utilizzabili.');
        }
        diagnostics.phase = 'public-ready';
        diagnostics.publicReadyAt = new Date().toISOString();
        diagnostics.publicError = '';
        diagnostics.staticAssetsPhase = result?.staticAssetsPending ? 'background' : 'ready';
        publishV760();
        options.onPublicReady?.(result);
        return result;
      })
      .catch((error) => {
        const normalized = normalizeErrorV760(error);
        diagnostics.phase = 'public-error';
        diagnostics.publicError = normalized.message;
        publishV760();
        options.onPublicError?.(normalized);
        throw normalized;
      });
    return publicPromise;
  }

  return Object.freeze({
    version: STATIC_FIRST_BOOTSTRAP_VERSION_V760,
    async start() {
      let result;
      try { result = await startPublicV760(); }
      finally { deferRemoteStartV760(startAuthV760); }
      return result;
    },
    startPublic: startPublicV760,
    startAuth: startAuthV760,
    diagnostics: () => Object.freeze({ ...diagnostics })
  });
}
