import { BestRouteType } from "../types";

export const bestRoute: BestRouteType = {
  from: { blockchain: 'BSC', symbol: 'BNB', address: null },
  to: { blockchain: 'AVAX_CCHAIN', symbol: 'AVAX', address: null },
  requestAmount: '0.3',
  requestId: '228529e3-27d7-4fa9-ab84-bb2b90eade6f',
  result: {
    outputAmount: '5.685715974132648891',
    swaps: [
      {
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
          blockchainlogo:
            'https://api.rango.exchange/blockchains/avax_cchain.svg',

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
      {
        swapperId: 'PangolinSwap',
        swapperLogo: "https://api.rango.exchange/swappers/pangolin.png",
        swapperType: 'DEX',
        from: {
          symbol: 'WETH.E',
          logo: 'https://api.rango.exchange/i/j9xgdC',
          address: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
          blockchain: 'AVAX_CCHAIN',
          decimals: 18,
          usdPrice: 1329.24,
          blockchainlogo:
            'https://api.rango.exchange/blockchains/avax_cchain.svg',
        },
        to: {
          symbol: 'AVAX',
          logo: 'https://api.rango.exchange/i/kX4edQ',
          address: null,
          blockchain: 'AVAX_CCHAIN',
          decimals: 18,
          usdPrice: 12.5,
          blockchainlogo:
            'https://api.rango.exchange/blockchains/avax_cchain.svg',
        },
        fromAmount: '0.062064305934309070',
        fromAmountPrecision: null,
        fromAmountMinValue: null,
        fromAmountMaxValue: null,
        fromAmountRestrictionType: null,
        toAmount: '5.685715974132648891',
        fee: [
          {
            asset: {
              blockchain: 'AVAX_CCHAIN',
              symbol: 'WETH.E',
              address: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
            },
            expenseType: 'DECREASE_FROM_OUTPUT',
            amount:
              '0.00018619291780292721387591870688029381530892436558133340440690517425537109375',
          },
          {
            asset: { blockchain: 'AVAX_CCHAIN', symbol: 'AVAX', address: null },
            expenseType: 'FROM_SOURCE_WALLET',
            amount: '0.005370022532678750',
          },
        ],
        estimatedTimeInSeconds: 45,
        swapChainType: 'INTER_CHAIN',
        routes: [
          {
            nodes: [
              {
                nodes: [
                  {
                    marketName: 'PangolinSwap',
                    marketId: 'PangolinSwap',
                    percent: 1.0,
                  },
                ],
                from: 'WETH.e',
                fromLogo: '',
                fromAddress: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
                fromBlockchain: 'AVAX_CCHAIN',
                to: 'WAVAX',
                toLogo: '',
                toAddress: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
                toBlockchain: 'AVAX_CCHAIN',
              },
            ],
          },
        ],
        recommendedSlippage: null,
        timeStat: { min: 6, avg: 39, max: 317 },
        includesDestinationTx: false,
      },
    ],
  },
  validationStatus: null,
  missingBlockchains: [],
  diagnosisMessages: [],
};
