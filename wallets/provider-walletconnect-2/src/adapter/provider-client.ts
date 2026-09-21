import { debug } from '@rango-dev/logging-core';
import UniversalProvider from '@walletconnect/universal-provider';

import { DEFAULT_APP_METADATA, RELAY_URL } from '../wcConstants.js';

type EmitValidator = (params: unknown) => Promise<void>;

export async function createUniversalProvider(
  projectId: string
): Promise<UniversalProvider> {
  const provider = await UniversalProvider.init({
    relayUrl: RELAY_URL,
    projectId,
    metadata: DEFAULT_APP_METADATA,
  });

  handleSessionEventValidation(provider.client);

  return provider;
}

/**
 * Keeps sign-client's `session_event` validation from surfacing as an unhandled
 * rejection.
 *
 * `onSessionEventRequest` calls the async `isValidEmit` without awaiting it, so
 * its `try/catch` never sees the failure. Wallets commonly emit `chainChanged` /
 * `accountsChanged` right after approving, and when that event is processed
 * before `wc_sessionSettle` stores the session, validation rejects with
 * `No matching key. session topic doesn't exist` - logged by the browser as
 * `Uncaught (in promise)`. Nothing breaks: the event is emitted regardless and
 * our subscribers drop it, since the session isn't cached until connect resolves.
 *
 * This has to live in our code rather than in a `patch-package` patch: host apps
 * install the SDK themselves and never get this repo's patches.
 *
 * The wrapper only attaches a handler and returns the original promise, so the
 * SDK's awaiting caller (`emit()`) still receives the rejection. `isValidEmit` is
 * private SDK API, hence the guard. Still unawaited as of sign-client 2.25.0;
 * drop this once upstream awaits it.
 */
function handleSessionEventValidation(client: UniversalProvider['client']) {
  const engine = client.engine as unknown as { isValidEmit?: EmitValidator };
  const isValidEmit = engine.isValidEmit;
  if (typeof isValidEmit !== 'function') {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/promise-function-async -- must return the SDK's own promise; an async wrapper would re-wrap it and leave that promise unhandled
  engine.isValidEmit = (params) => {
    const validation = isValidEmit.call(engine, params);
    void Promise.resolve(validation).catch((error: unknown) =>
      debug(error instanceof Error ? error : new Error(String(error)))
    );
    return validation;
  };
}
