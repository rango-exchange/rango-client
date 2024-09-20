import type { CommonNamespaceKeys } from '@rango-dev/wallets-core';

import { Namespace } from '@rango-dev/wallets-shared';

export function convertCommonNamespacesKeysToLegacyNamespace(
  namespaces: CommonNamespaceKeys[]
): Namespace[] {
  return namespaces.map((namespace) => {
    switch (namespace) {
      case 'evm':
        return Namespace.Evm;
      case 'solana':
        return Namespace.Solana;
      case 'cosmos':
        return Namespace.Cosmos;
    }

    throw new Error(
      'Can not convert this common namespace key to a proper legacy key.'
    );
  });
}
