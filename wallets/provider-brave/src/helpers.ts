import { Network } from '@rangodev/wallets-shared';

export function brave() {
  const { ethereum, braveSolana } = window;

  const instances = new Map();

  if (ethereum?.isBraveWallet) instances.set(Network.ETHEREUM, ethereum);
  if (!!braveSolana) instances.set(Network.SOLANA, braveSolana);

  if (instances.size === 0) return null;

  return instances;
}
