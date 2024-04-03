import type { Network } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';

type Provider = Map<Network, any>;

export function phantom(): Provider | null {
  const { phantom } = window;

  if (!phantom) {
    return null;
  }

  const { solana, ethereum } = phantom;

  const instances: Provider = new Map();

  if (ethereum && ethereum.isPhantom) {
    instances.set(Networks.ETHEREUM, ethereum);
  }

  if (solana && solana.isPhantom) {
    instances.set(Networks.SOLANA, solana);
  }

  return instances;
}
