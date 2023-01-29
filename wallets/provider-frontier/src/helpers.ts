import { Network } from '@rangodev/wallets-shared';

export function frontier() {
  const { frontier } : any = window;

  const instances = new Map();

  if (frontier?.ethereum) instances.set(Network.ETHEREUM, frontier?.ethereum);
  if (!!frontier?.solana) instances.set(Network.SOLANA, frontier?.solana);

  if (instances.size === 0) return null;

  return instances;
}