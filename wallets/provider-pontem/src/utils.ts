import type { ProviderAPI as SolanaProviderApi } from '@rango-dev/wallets-core/namespaces/solana';

type Provider = Map<string, unknown>;

export function pontem(): Provider | null {
  const { solanaPontem, pontem } = window;

  if (!pontem) {
    return null;
  }

  const instances: Provider = new Map();

  if (solanaPontem) {
    instances.set('Solana', solanaPontem);
  }

  return instances;
}

export function solanaInstance(): SolanaProviderApi {
  const instance = pontem();
  const solanaInstance = instance?.get('Solana');

  if (!solanaInstance) {
    throw new Error(
      'Pontem not injected or Solana not enabled. Please check your wallet.'
    );
  }

  return solanaInstance;
}
