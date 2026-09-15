import UniversalProvider from '@walletconnect/universal-provider';

import { DEFAULT_APP_METADATA, RELAY_URL } from '../wcConstants.js';

export async function createUniversalProvider(
  projectId: string
): Promise<UniversalProvider> {
  return UniversalProvider.init({
    relayUrl: RELAY_URL,
    projectId,
    metadata: DEFAULT_APP_METADATA,
  });
}
