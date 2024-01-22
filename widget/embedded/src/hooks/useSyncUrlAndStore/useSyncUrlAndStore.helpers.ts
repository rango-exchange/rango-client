import type { BlockchainMeta, Token } from 'rango-sdk';

export function searchParamToToken(
  tokens: Token[],
  searchParam: string | null,
  chain: BlockchainMeta | null
): Token | null {
  if (!chain) {
    return null;
  }
  return (
    tokens.find((token) => {
      const symbolAndAddress = searchParam?.split('--');
      if (symbolAndAddress?.length === 1) {
        return (
          token.symbol === symbolAndAddress[0] &&
          token.address === null &&
          token.blockchain === chain.name
        );
      }
      return (
        token.symbol === symbolAndAddress?.[0] &&
        token.address === symbolAndAddress?.[1] &&
        token.blockchain === chain.name
      );
    }) || null
  );
}

export function tokenToSearchParam(token: Token | null): string | undefined {
  if (token) {
    return `${token.symbol}${token.address ? `--${token.address}` : ''}`;
  }
  return undefined;
}
