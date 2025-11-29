import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/solana';

export function canEagerConnect(instance: () => ProviderAPI) {
  return () => {
    const solanaInstance = instance();

    if (!solanaInstance) {
      throw new Error(
        'Trying to eagerly connect to your Solana wallet, but seems its instance is not available.'
      );
    }
    return solanaInstance.isConnected;
  };
}
export const solanaActions = { canEagerConnect };
