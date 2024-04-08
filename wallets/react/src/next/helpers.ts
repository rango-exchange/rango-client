import type {
  CAIP,
  type V1,
  type Versions,
  type VLegacy,
} from '@rango-dev/wallets-core';

import { pickVersion } from '@rango-dev/wallets-core';

export function splitProviders(
  providers: Versions[],
  options?: { isExperimentalEnabled?: boolean }
): [VLegacy[], V1[]] {
  const { isExperimentalEnabled = false } = options || {};
  if (isExperimentalEnabled) {
    const legacy: VLegacy[] = [];
    const experimental: V1[] = [];
    providers.forEach((provider) => {
      try {
        const target = pickVersion(provider, '1.0.0');
        experimental.push(target[1]);
      } catch {
        const target = pickVersion(provider, '0.0.0');
        legacy.push(target[1]);
      }
    });

    return [legacy, experimental];
  }

  const legacy = providers.map(
    (provider) => pickVersion(provider, '0.0.0')[1]
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  );
  return [legacy, []];
}

export function findProviderByType(
  providers: V1[],
  type: string
): V1 | undefined {
  return providers.find((provider) => provider.id === type);
}

export function mapCaipNamespaceToNetwork(
  chainId: CAIP.ChainIdParams | string
): string {
  if (typeof chainId === 'string') {
    return chainId;
  }
  const useNamespaceAsNetworkFor = ['solana'];

  if (useNamespaceAsNetworkFor.includes(chainId.namespace.toLowerCase())) {
    return chainId.namespace.toUpperCase();
  }

  return chainId.reference;
}
