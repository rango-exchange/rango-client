import type { Asset, BlockchainMeta, Token } from 'rango-sdk';

export function convertTokenSearchParamToAsset(
  searchParam: string,
  chain: BlockchainMeta
): Asset {
  const symbolAndAddress = searchParam.split('--');

  return {
    blockchain: chain.name,
    address: symbolAndAddress?.[1] || null,
    symbol: symbolAndAddress[0],
  };
}

export function tokenToSearchParam(token: Token | null): string | undefined {
  if (token) {
    return `${token.symbol}${token.address ? `--${token.address}` : ''}`;
  }
  return undefined;
}
