import { BestRoute, Button, styled, SwapContainer, VerticalSwapIcon } from '@rangodev/ui';
import { BestRouteType } from '@rangodev/ui/dist/types/swaps';
import React from 'react';
import { Header } from '../components/swap/Header';
import { TokenInfo } from '../components/swap/TokenInfo';
import { useBestRouteStore } from '../store/bestRoute';

const Container = styled('div', {
  padding: '$32 $16',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const bestRouteExample3: BestRouteType = {
  from: { blockchain: 'BSC', symbol: 'BNB', address: null },
  to: { blockchain: 'AVAX_CCHAIN', symbol: 'AVAX', address: null },
  requestAmount: '0.3',
  requestId: '228529e3-27d7-4fa9-ab84-bb2b90eade6f',
  result: {
    outputAmount: '5.685715974132648891',
    swaps: [
      {
        result: null,

        swapperId: 'AnySwap Aggregator',
        swapperType: 'AGGREGATOR',
        swapperLogo: 'https://api.rango.exchange/swappers/multichain.png',

        from: {
          symbol: 'BNB',
          logo: 'https://api.rango.exchange/i/Y3v1KW',
          blockchainlogo: 'https://api.rango.exchange/blockchains/binance.svg',

          address: null,
          blockchain: 'BSC',
          decimals: 18,
          usdPrice: 279.2738558274085,
        },
        to: {
          symbol: 'WETH.E',
          logo: 'https://api.rango.exchange/i/j9xgdC',
          blockchainlogo: 'https://api.rango.exchange/blockchains/avax_cchain.svg',

          address: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
          blockchain: 'AVAX_CCHAIN',
          decimals: 18,
          usdPrice: 1329.24,
        },
        fromAmount: '0.300000000000000000',
        fromAmountPrecision: null,
        fromAmountMinValue: '0.047579322466294684272760',
        fromAmountMaxValue: '79302.26195302606417382090',
        fromAmountRestrictionType: 'INCLUSIVE',
        toAmount: '0.062064305934309070',
        fee: [
          {
            asset: { blockchain: 'BSC', symbol: 'BNB', address: null },
            expenseType: 'FROM_SOURCE_WALLET',
            amount: '0.001388002000000000',
          },
        ],
        estimatedTimeInSeconds: 300,
        swapChainType: 'INTRA_CHAIN',
        routes: null,
        recommendedSlippage: null,
        timeStat: { min: 162, avg: 260, max: 467 },
        includesDestinationTx: false,
      },
    ],
  },
  validationStatus: null,
  missingBlockchains: [],
  diagnosisMessages: [],
};

export function Home() {
  const { fromChain, fromToken, toChain, toToken } = useBestRouteStore();

  return (
    <Container>
      <Header />
      <TokenInfo type="From" chain={fromChain} token={fromToken} />
      <VerticalSwapIcon size={36} style={{ cursor: 'pointer' }} />
      <TokenInfo type="To" chain={toChain} token={toToken} />
      <Button type="primary" align="grow" size="large">
        Connect Wallet
      </Button>
    </Container>
  );
}
