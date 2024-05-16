import { getEvmInstanceFor, Networks } from '@rango-dev/wallets-shared';

const getEvmInstance = getEvmInstanceFor('Cosmostation Wallet');

export async function cosmostation() {
  const { cosmostation } = window;
  const instances = new Map();

  if (!cosmostation || !cosmostation.providers) {
    return null;
  }

  const cosmosInstance = cosmostation.providers.keplr;
  if (cosmosInstance) {
    instances.set(Networks.COSMOS, cosmosInstance);
  }

  const evmInstance = await getEvmInstance();
  if (evmInstance) {
    instances.set(Networks.ETHEREUM, evmInstance);
  }

  if (instances.size === 0) {
    return null;
  }

  return instances;
}
