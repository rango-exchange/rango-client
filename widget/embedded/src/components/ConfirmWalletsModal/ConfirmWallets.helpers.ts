import type { BlockchainMeta } from 'rango-sdk';

export function isValidAddress(
  chain: BlockchainMeta,
  address: string
): boolean {
  const regex = chain.addressPatterns;
  const valid = regex.filter((r) => new RegExp(r).test(address)).length > 0;
  return valid;
}
