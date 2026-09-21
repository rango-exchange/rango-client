import UniversalProvider from '@walletconnect/universal-provider';

import {
  DEFAULT_APP_METADATA,
  RELAY_URL,
  WC_STORAGE_PREFIX,
} from '../wcConstants.js';

export async function createUniversalProvider(
  projectId: string
): Promise<UniversalProvider> {
  return UniversalProvider.init({
    relayUrl: RELAY_URL,
    projectId,
    metadata: DEFAULT_APP_METADATA,
    /*
     * WalletConnect keeps one Core per storage prefix on `globalThis`, and every
     * client created with that prefix reuses it - including the host app's own
     * clients (e.g. Privy's in app-v2). A shared Core means one relay connection
     * feeding every client's engine and one storage namespace, so:
     *  - the host's client receives our session events and, not knowing our
     *    topic, throws `No matching key. session topic doesn't exist`;
     *  - each client persists its whole session list under the same key,
     *    overwriting the other's;
     *  - `purgeOrphanedPairings` sees the host's pairings in the shared pairing
     *    store and disconnects them.
     * A prefix of our own gives us a separate Core, relay connection and storage.
     */
    customStoragePrefix: WC_STORAGE_PREFIX,
  });
}
