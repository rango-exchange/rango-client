import type { BlockchainMeta } from 'rango-types';

export function generateExplorerLink(
  address: string | null,
  blockchain: BlockchainMeta
): string {
  // We don't have Cosmos explorer url in API.
  if (blockchain.type === 'COSMOS') {
    return '';
  }

  const explorerLinkPattern = blockchain.info?.addressUrl;

  if (!explorerLinkPattern || !address) {
    return '';
  }

  return explorerLinkPattern.replace('{wallet}', address);
}
