import UniversalProvider from '@walletconnect/universal-provider';

import { DEFAULT_APP_METADATA, RELAY_URL } from '../wcConstants.js';

export async function getOrCreateUniversalProvider(
  projectId: string,
  existing: UniversalProvider | null
): Promise<UniversalProvider> {
  if (existing) {
    return existing;
  }

  return UniversalProvider.init({
    relayUrl: RELAY_URL,
    projectId,
    metadata: DEFAULT_APP_METADATA,
  });
}
