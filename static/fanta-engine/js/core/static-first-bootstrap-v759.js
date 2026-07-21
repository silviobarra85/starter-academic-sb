// V759 - FantaEngine static-first bootstrap coordinator.
// Public data is loaded and rendered before optional remote services such as Firebase.
// No timers, no watchdog overrides and no league-specific paths live in this module.

export const STATIC_FIRST_BOOTSTRAP_VERSION_V759 = 'V759';

function asErrorV759(value) {
  return value instanceof Error ? value : new Error(String(value || 'Errore sconosciuto'));
}

function nowIsoV759() {
  return new Date().toISOString();
}

function deferRemoteStartV759(callback) {
  const enqueue = typeof globalThis.queueMicrotask === 'function'
    ? globalThis.queueMicrotask.bind(globalThis)
    : (task) => Promise.resolve().then(task);

  if (typeof globalThis.requestAnimationFrame === 'function') {
    globalThis.requestAnimationFrame(() => enqueue(callback));
    return;
  }
  enqueue(callback);
}

export function createStaticFirstBootstrapV759(options = {}) {
  if (typeof options.loadPublicData !== 'function') {
    throw new TypeError('FantaEngine V759 richiede loadPublicData().');
  }

  const logger = options.logger || console;
  const diagnostics = {
    version: STATIC_FIRST_BOOTSTRAP_VERSION_V759,
    phase: 'created',
    createdAt: nowIsoV759(),
    publicStartedAt: '',
    publicReadyAt: '',
    authStartedAt: '',
    authReadyAt: '',
    publicError: '',
    authError: ''
  };

  let publicPromise = null;
  let authPromise = null;

  function publishV759() {
    const snapshot = Object.freeze({ ...diagnostics });
    if (typeof options.onDiagnostic === 'function') {
      try { options.onDiagnostic(snapshot); } catch (error) { logger.warn?.('[FantaEngine V759] diagnostica non pubblicata', error); }
    }
    return snapshot;
  }

  async function startPublicV759() {
    if (publicPromise) return publicPromise;
    diagnostics.phase = 'public-loading';
    diagnostics.publicStartedAt = nowIsoV759();
    publishV759();

    publicPromise = Promise.resolve()
      .then(() => options.loadPublicData())
      .then((result) => {
        if (typeof options.hasUsableData === 'function' && !options.hasUsableData()) {
          throw new Error('Il caricamento pubblico non ha prodotto dati utilizzabili.');
        }
        diagnostics.phase = 'public-ready';
        diagnostics.publicReadyAt = nowIsoV759();
        diagnostics.publicError = '';
        publishV759();
        options.onPublicReady?.(result);
        return result;
      })
      .catch((error) => {
        const normalized = asErrorV759(error);
        diagnostics.phase = 'public-error';
        diagnostics.publicError = normalized.message;
        publishV759();
        options.onPublicError?.(normalized);
        throw normalized;
      });

    return publicPromise;
  }

  function startAuthV759() {
    if (authPromise) return authPromise;
    if (typeof options.startAuth !== 'function') return Promise.resolve(null);

    diagnostics.authStartedAt = nowIsoV759();
    publishV759();
    authPromise = Promise.resolve()
      .then(() => options.startAuth())
      .then((result) => {
        diagnostics.authReadyAt = nowIsoV759();
        diagnostics.authError = '';
        if (diagnostics.phase === 'public-ready') diagnostics.phase = 'ready';
        publishV759();
        options.onAuthReady?.(result);
        return result;
      })
      .catch((error) => {
        const normalized = asErrorV759(error);
        diagnostics.authError = normalized.message;
        publishV759();
        logger.warn?.('[FantaEngine V759] Firebase/Auth non disponibile; il sito pubblico resta operativo.', normalized);
        options.onAuthError?.(normalized);
        return null;
      });
    return authPromise;
  }

  async function startV759() {
    let publicResult;
    try {
      publicResult = await startPublicV759();
    } finally {
      // Remote authentication starts only after the public UI has had a chance to render.
      deferRemoteStartV759(startAuthV759);
    }
    return publicResult;
  }

  return Object.freeze({
    version: STATIC_FIRST_BOOTSTRAP_VERSION_V759,
    start: startV759,
    startPublic: startPublicV759,
    startAuth: startAuthV759,
    diagnostics: () => Object.freeze({ ...diagnostics })
  });
}
