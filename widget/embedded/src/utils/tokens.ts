import BigNumber from 'bignumber.js';
import { Token } from 'rango-sdk';
import { getBalanceFromWallet, ZERO } from './balance';

const compareBalance = (tokenA: Token, tokenB: Token) => {
  if (!tokenA.usdPrice || !tokenB.usdPrice) return 0;

  const tokenAUsdValue = new BigNumber(
    getBalanceFromWallet(wallet, tokenA.blockchain, tokenA.symbol, tokenA.address)?.amount || ZERO,
  ).multipliedBy(tokenA.usdPrice);
  const tokenBUsdValue = new BigNumber(
    getBalanceFromWallet(wallet, tokenB.blockchain, tokenB.symbol, tokenB.address)?.amount || ZERO,
  ).multipliedBy(tokenB.usdPrice);
  if (tokenAUsdValue.gt(tokenBUsdValue)) return -1;
  return 1;
};

const compareTokenNamesAndSearchedTerm = (tokenA: Token, tokenB: Token, searchedText: string) => {
  const a = tokenB.symbol.toLowerCase();
  const b = tokenA.symbol.toLowerCase();
  const x = searchedText.toLowerCase();
  if (x === '') {
    if (!tokenB.address) return 1;
    if (!tokenA.address) return -1;
    return 0;
  }
  if (a === x) return 1;
  if (b === x) return -1;
  if (a.indexOf(x) !== -1 && b.indexOf(x) !== -1) {
    if (!tokenB.address) return 1;
    if (!tokenA.address) return -1;
    if (a.length < b.length) return 1;
    return -1;
  }
  if (a.indexOf(x) !== -1) return 1;
  if (b.indexOf(x) !== -1) return -1;
  if ((tokenB.name || '').toLowerCase().indexOf(x) !== -1) return 1;
  if ((tokenA.name || '').toLowerCase().indexOf(x) !== -1) return -1;
  return 0;
};

const sortedTokens = (
  tokens: Token[],
  walletSymbols: Set<string>,
  searchedText: string,
  position: 'source' | 'destination',
) => {
  if (!tokens) return [];
  let sortedList = [
    ...tokens.filter((t) => !t.address && walletSymbols.size && position === 'destination'),
    ...tokens
      .filter(
        (t) =>
          !(position === 'destination' && !t.address) &&
          walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`),
      )
      .sort((tokenA, tokenB) => compareBalance(tokenA, tokenB)),
    ...tokens
      .filter(
        (t) =>
          !walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`) &&
          !t.address &&
          (!walletSymbols.size || position === 'source'),
      )
      .sort((tokenA, tokenB) => compareTokenNamesAndSearchedTerm(tokenA, tokenB, searchedText)),
    ...tokens
      .filter(
        (t) =>
          !walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`) &&
          t.address &&
          (!t.isSecondaryCoin ||
            importedTokens.find(
              (i) =>
                i.blockchain === t.blockchain && i.address === t.address && i.symbol === t.symbol,
            )),
      )
      .sort((tokenA, tokenB) => compareTokenNamesAndSearchedTerm(tokenA, tokenB, searchedText)),
    ...tokens
      .filter(
        (t) =>
          !walletSymbols.has(`${t.blockchain}.${t.symbol}.${t.address}`) &&
          t.isSecondaryCoin &&
          !importedTokens.find(
            (i) =>
              i.blockchain === t.blockchain && i.address === t.address && i.symbol === t.symbol,
          ),
      )
      .sort((tokenA, tokenB) => compareTokenNamesAndSearchedTerm(tokenA, tokenB, searchedText)),
  ];

  if (searchedText !== '')
    sortedList = sortedList.filter(
      (a) =>
        a.symbol.toUpperCase().indexOf(searchedText.toUpperCase()) >= 0 ||
        (a.name || '').toUpperCase().indexOf(searchedText.toUpperCase()) >= 0 ||
        (a.address !== null && a.address?.toUpperCase().startsWith(searchedText.toUpperCase())),
    );

  return sortedList;
};
