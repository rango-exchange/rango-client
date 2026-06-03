import type { BlockchainMeta } from 'rango-types';

export function generateExplorerLink(
  address: string | null,
  blockchain: BlockchainMeta
): string {
  const explorerLinkPattern = blockchain.info?.addressUrl;

  if (!explorerLinkPattern || !address) {
    return '';
  }

  return explorerLinkPattern.replace('{wallet}', address);
}
