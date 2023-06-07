import { Networks } from '@rango-dev/wallets-shared';

export function brave() {
  const { ethereum, braveSolana } = window;

  const instances = new Map();

  if (ethereum?.isBraveWallet) instances.set(Networks.ETHEREUM, ethereum);
  if (braveSolana) instances.set(Networks.SOLANA, braveSolana);

  if (instances.size === 0) return null;

  return instances;
}
