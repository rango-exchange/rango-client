import type { Network } from '@rango-dev/wallets-shared';

import { Networks } from '@rango-dev/wallets-shared';

type Provider = Map<Network, any>;

export function tronLinkInstances(): Provider | null {
  const { tronLink, TronLinkEVM } = window;

  if (!tronLink) {
    return tronLink;
  }

  const instances: Provider = new Map();

  if (TronLinkEVM && TronLinkEVM.isTronLink) {
    instances.set(Networks.ETHEREUM, TronLinkEVM);
  }

  if (tronLink) {
    instances.set(Networks.TRON, tronLink);
  }
  return instances;
}
