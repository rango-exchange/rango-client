import { Network } from '@rangodev/wallets-shared';

export function cosmostation() {
  const { cosmostation } = window;
  const instances = new Map();

  if (!cosmostation || !cosmostation.providers) return null;

  const evmInstance = cosmostation.providers.metamask;
  if (!!evmInstance) instances.set(Network.ETHEREUM, evmInstance);

  const cosmosInstance = cosmostation.providers.keplr;
  if (!!cosmosInstance) instances.set(Network.COSMOS, cosmosInstance);

  if (instances.size === 0) return null;

  return instances;
}
