import { Token, BlockchainMeta } from 'rango-sdk';

export const tokenToUrl = (t: Token) =>
  `${t?.blockchain}.${t?.symbol}${t?.address ? '--' + encodeURIComponent(t?.address) : ''}`;

export const urlToToken = (
  blockchains: BlockchainMeta[],
  tokens: Token[],
  url: string | null,
): { blockchain: BlockchainMeta | null; token: Token | null } => {
  if (!url) return { blockchain: null, token: null };

  const ps1 = url.split('--');
  const ps2 = ps1[0].split('.');
  const symbol = ps2.slice(1).join('.');
  const blockchain = ps2[0];
  const address = ps1.length === 2 ? decodeURIComponent(ps1[1]) : null;
  let parsedToken: Token | null = null;
  const parsedBlockchain = blockchains.find((b) => b.name === blockchain) || null;

  if (!!parsedBlockchain) {
    parsedToken =
      tokens.find(
        (token) =>
          token.blockchain === blockchain && token.symbol === symbol && token.address === address,
      ) || null;
  }

  return { blockchain: parsedBlockchain, token: parsedToken };
};
