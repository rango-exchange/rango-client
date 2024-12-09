import type { CommonNamespaceKeys } from '@rango-dev/wallets-core';
import type { Namespace } from '@rango-dev/wallets-core/namespaces/common';

export function convertCommonNamespacesKeysToLegacyNamespace(
  namespaces: CommonNamespaceKeys[]
): Namespace[] {
  return namespaces.map((namespace) => {
    switch (namespace) {
      case 'evm':
        return 'EVM';
      case 'solana':
        return 'Solana';
      case 'cosmos':
        return 'Cosmos';
      default:
        throw new Error(
          'Can not convert this common namespace key to a proper legacy key.'
        );
    }
  });
}
