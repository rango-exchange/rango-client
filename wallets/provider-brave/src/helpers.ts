import { getEvmInstanceFor, Networks } from '@rango-dev/wallets-shared';

const getEvmInstance = getEvmInstanceFor('Brave Wallet');

export async function brave() {
  const { braveSolana } = window;

  const instances = new Map();

  if (braveSolana) {
    instances.set(Networks.SOLANA, braveSolana);
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
