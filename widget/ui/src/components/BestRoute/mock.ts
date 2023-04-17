import { RoutingResultType } from 'rango-sdk';
import { BestRouteType } from '../../types/swaps';

// TODO: I used `internalSwaps: []` to fix ts error. fix it by using real data.

export const bestRoute: BestRouteType = {
  from: { blockchain: 'BSC', symbol: 'BNB', address: null },
  to: { blockchain: 'AVAX_CCHAIN', symbol: 'AVAX', address: null },
  requestAmount: '0.3',
  requestId: '228529e3-27d7-4fa9-ab84-bb2b90eade6f',
  result: {
    resultType: RoutingResultType.OK,
    outputAmount: '5.685715974132648891',
    swaps: [
      {
        // TODO: fix this and use real data
        internalSwaps: [],
        swapperId: 'AnySwap Aggregator',
        swapperType: 'AGGREGATOR',
        swapperLogo: 'https://api.rango.exchange/swappers/multichain.png',
        maxRequiredSign: 1,
        warnings: [],
        from: {
          symbol: 'BNB',
          logo: 'https://api.rango.exchange/i/Y3v1KW',
          blockchainLogo: 'https://api.rango.exchange/blockchains/binance.svg',

          address: null,
          blockchain: 'BSC',
          decimals: 18,
          usdPrice: 279.2738558274085,
        },
        to: {
          symbol: 'WETH.E',
          logo: 'https://api.rango.exchange/i/j9xgdC',
          blockchainLogo:
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
            asset: {
              blockchain: 'BSC',
              symbol: 'BNB',
              address: null,
            },
            expenseType: 'FROM_SOURCE_WALLET',
            amount: '0.001388002000000000',
            name: 'Network Fee',
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
        internalSwaps: [],
        swapperId: 'PangolinSwap',
        swapperLogo: 'https://api.rango.exchange/swappers/pangolin.png',
        swapperType: 'DEX',
        maxRequiredSign: 1,
        warnings: [],
        from: {
          symbol: 'WETH.E',
          logo: 'https://api.rango.exchange/i/j9xgdC',
          address: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
          blockchain: 'AVAX_CCHAIN',
          decimals: 18,
          usdPrice: 1329.24,
          blockchainLogo:
            'https://api.rango.exchange/blockchains/avax_cchain.svg',
        },
        to: {
          symbol: 'AVAX',
          logo: 'https://api.rango.exchange/i/kX4edQ',
          address: null,
          blockchain: 'AVAX_CCHAIN',
          decimals: 18,
          usdPrice: 12.5,
          blockchainLogo:
            'https://api.rango.exchange/blockchains/avax_cchain.svg',
        },
        fromAmount: '0.062064305934309070',
        fromAmountPrecision: null,
        fromAmountMinValue: null,
        fromAmountMaxValue: null,
        fromAmountRestrictionType: 'EXCLUSIVE',
        toAmount: '5.685715974132648891',
        fee: [
          {
            asset: {
              blockchain: 'AVAX_CCHAIN',
              symbol: 'WETH.E',
              address: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
            },
            expenseType: 'DECREASE_FROM_OUTPUT',
            name: 'Network Fee',
            amount:
              '0.00018619291780292721387591870688029381530892436558133340440690517425537109375',
          },
          {
            asset: { blockchain: 'AVAX_CCHAIN', symbol: 'AVAX', address: null },
            expenseType: 'FROM_SOURCE_WALLET',
            name: 'Network Fee',
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
  processingLimitReached: false,
  walletNotSupportingFromBlockchain: false,
};
export const bestRouteExample2: BestRouteType = {
  from: {
    blockchain: 'BSC',
    symbol: 'USDC',
    address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
  },
  to: { blockchain: 'AKASH', symbol: 'AKT', address: null },
  requestAmount: '10',
  requestId: '56a3f944-02ec-4011-b3c6-6c76c3ad049b',
  result: {
    resultType: RoutingResultType.OK,
    outputAmount: '30.983906',
    swaps: [
      {
        internalSwaps: [],
        maxRequiredSign: 1,
        warnings: [],
        swapperId: 'ParaSwap Bsc',
        swapperType: 'DEX',
        swapperLogo: 'https://api.rango.exchange/swappers/para-swap.png',

        from: {
          symbol: 'USDC',
          blockchainLogo: 'https://api.rango.exchange/blockchains/binance.svg',

          logo: 'https://api.rango.exchange/i/toXKGV',
          address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
          blockchain: 'BSC',
          decimals: 18,
          usdPrice: 1.0,
        },
        to: {
          symbol: 'AXLUSDC',
          blockchainLogo: 'https://api.rango.exchange/blockchains/binance.svg',
          logo: 'https://api.rango.exchange/tokens/COSMOS/AXLUSDC.png',
          address: '0x4268b8f0b87b6eae5d897996e6b845ddbd99adf3',
          blockchain: 'BSC',
          decimals: 6,
          usdPrice: 1.0,
        },
        fromAmount: '10.000000000000000000',
        fromAmountPrecision: null,
        fromAmountMinValue: null,
        fromAmountMaxValue: null,
        fromAmountRestrictionType: 'EXCLUSIVE',
        toAmount: '9.957577',
        fee: [
          {
            asset: { blockchain: 'BSC', symbol: 'BNB', address: null },
            expenseType: 'FROM_SOURCE_WALLET',
            amount: '0.002179644500000000',
            name: 'Network Fee',
          },
          {
            asset: {
              blockchain: 'BSC',
              symbol: 'AXLUSDC',
              address: '0x4268b8f0b87b6eae5d897996e6b845ddbd99adf3',
            },
            expenseType: 'DECREASE_FROM_OUTPUT',
            amount: '0.004978',
            name: 'Network Fee',
          },
        ],
        estimatedTimeInSeconds: 60,
        swapChainType: 'INTER_CHAIN',
        routes: [
          {
            nodes: [
              {
                nodes: [
                  {
                    marketName: 'PancakeSwap',
                    marketId: 'PancakeSwap',
                    percent: 1.0,
                  },
                ],
                from: 'USDC',
                fromLogo:
                  'https://tokens.pancakeswap.finance/images/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d.png',
                fromAddress: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
                fromBlockchain: 'BSC',
                to: 'BUSD',
                toLogo:
                  'https://tokens.pancakeswap.finance/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png',
                toAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
                toBlockchain: 'BSC',
              },
              {
                nodes: [
                  {
                    marketName: 'Ellipsis',
                    marketId: 'Ellipsis',
                    percent: 1.0,
                  },
                ],
                from: 'BUSD',
                fromLogo:
                  'https://tokens.pancakeswap.finance/images/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png',
                fromAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
                fromBlockchain: 'BSC',
                to: 'axlUSDC',
                toLogo: 'https://api.rango.exchange/tokens/COSMOS/AXLUSDC.png',
                toAddress: '0x4268b8f0b87b6eae5d897996e6b845ddbd99adf3',
                toBlockchain: 'BSC',
              },
            ],
          },
        ],
        recommendedSlippage: null,
        timeStat: { min: 6, avg: 52, max: 183 },
        includesDestinationTx: false,
      },
      {
        internalSwaps: [],
        maxRequiredSign: 1,
        warnings: [],
        swapperId: 'Satellite',
        swapperType: 'BRIDGE',
        swapperLogo: 'https://api.rango.exchange/swappers/satellite.png',
        from: {
          symbol: 'AXLUSDC',
          blockchainLogo: 'https://api.rango.exchange/blockchains/binance.svg',
          logo: 'https://api.rango.exchange/tokens/COSMOS/AXLUSDC.png',
          address: '0x4268b8f0b87b6eae5d897996e6b845ddbd99adf3',
          blockchain: 'BSC',
          decimals: 6,
          usdPrice: 1.0,
        },
        to: {
          symbol: 'USDC',
          blockchainLogo: 'https://api.rango.exchange/swappers/osmosis.png',
          logo: 'https://api.rango.exchange/tokens/COSMOS/USDC.png',
          address:
            'ibc/d189335c6e4a68b513c10ab227bf1c1d38c746766278ba3eeb4fb14124f1d858',
          blockchain: 'OSMOSIS',
          decimals: 6,
          usdPrice: 1.0000000008037055,
        },
        fromAmount: '9.957577',
        fromAmountPrecision: null,
        fromAmountMinValue: null,
        fromAmountMaxValue: null,
        fromAmountRestrictionType: 'EXCLUSIVE',
        toAmount: '8.357577',
        fee: [
          {
            asset: { blockchain: 'BSC', symbol: 'BNB', address: null },
            expenseType: 'FROM_SOURCE_WALLET',
            amount:
              '0.0003850000000000000239784127112452447212753714467226018314249813556671142578125000000000000',
            name: 'Network Fee',
          },
        ],
        estimatedTimeInSeconds: 360,
        swapChainType: 'INTER_CHAIN',
        routes: null,
        recommendedSlippage: null,
        timeStat: { min: 9, avg: 339, max: 1138 },
        includesDestinationTx: false,
      },
      {
        internalSwaps: [],
        maxRequiredSign: 1,
        warnings: [],
        swapperId: 'Osmosis',
        swapperType: 'DEX',
        swapperLogo: 'https://api.rango.exchange/swappers/osmosis.png',
        from: {
          symbol: 'USDC',
          logo: 'https://api.rango.exchange/tokens/COSMOS/USDC.png',
          blockchainLogo: 'https://api.rango.exchange/swappers/osmosis.png',
          address:
            'ibc/d189335c6e4a68b513c10ab227bf1c1d38c746766278ba3eeb4fb14124f1d858',
          blockchain: 'OSMOSIS',
          decimals: 6,
          usdPrice: 1.0000000008037055,
        },
        to: {
          symbol: 'AKT',
          logo: 'https://api.rango.exchange/tokens/COSMOS/AKT.png',
          blockchainLogo: 'https://api.rango.exchange/swappers/osmosis.png',
          address:
            'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
          blockchain: 'OSMOSIS',
          decimals: 6,
          usdPrice: 0.2688829083335616,
        },
        fromAmount: '8.357577',
        fromAmountPrecision: null,
        fromAmountMinValue: null,
        fromAmountMaxValue: null,
        fromAmountRestrictionType: 'EXCLUSIVE',
        toAmount: '30.983906',
        fee: [
          {
            asset: { blockchain: 'OSMOSIS', symbol: 'OSMO', address: null },
            expenseType: 'FROM_SOURCE_WALLET',
            amount: '0',
            name: 'Network Fee',
          },
        ],
        estimatedTimeInSeconds: 45,
        swapChainType: 'INTRA_CHAIN',
        routes: [
          {
            nodes: [
              {
                nodes: [
                  { marketName: 'pool#875', marketId: null, percent: 1.0 },
                ],
                from: 'USDC',
                fromLogo: 'https://api.rango.exchange/tokens/COSMOS/USDC.png',
                fromAddress:
                  'ibc/d189335c6e4a68b513c10ab227bf1c1d38c746766278ba3eeb4fb14124f1d858',
                fromBlockchain: 'OSMOSIS',
                to: 'ACRE',
                toLogo: 'https://api.rango.exchange/tokens/COSMOS/ACRE.png',
                toAddress:
                  'ibc/bb936517f7e5d77a63e0adb05217a6608b0c4cf8fba7ea2f4bae4107a7238f06',
                toBlockchain: 'OSMOSIS',
              },
              {
                nodes: [
                  { marketName: 'pool#858', marketId: null, percent: 1.0 },
                ],
                from: 'ACRE',
                fromLogo: 'https://api.rango.exchange/tokens/COSMOS/ACRE.png',
                fromAddress:
                  'ibc/bb936517f7e5d77a63e0adb05217a6608b0c4cf8fba7ea2f4bae4107a7238f06',
                fromBlockchain: 'OSMOSIS',
                to: 'OSMO',
                toLogo: 'https://api.rango.exchange/tokens/COSMOS/OSMO.png',
                toAddress: null,
                toBlockchain: 'OSMOSIS',
              },
              {
                nodes: [{ marketName: 'pool#3', marketId: null, percent: 1.0 }],
                from: 'OSMO',
                fromLogo: 'https://api.rango.exchange/tokens/COSMOS/OSMO.png',
                fromAddress: null,
                fromBlockchain: 'OSMOSIS',
                to: 'AKT',
                toLogo: 'https://api.rango.exchange/tokens/COSMOS/AKT.png',
                toAddress:
                  'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
                toBlockchain: 'OSMOSIS',
              },
            ],
          },
        ],
        recommendedSlippage: null,
        timeStat: { min: 7, avg: 38, max: 187 },
        includesDestinationTx: false,
      },
      {
        internalSwaps: [],
        maxRequiredSign: 1,
        warnings: [],
        swapperId: 'Osmosis',
        swapperType: 'BRIDGE',
        swapperLogo: 'https://api.rango.exchange/swappers/osmosis.png',
        from: {
          symbol: 'AKT',
          logo: 'https://api.rango.exchange/tokens/COSMOS/AKT.png',
          blockchainLogo: 'https://api.rango.exchange/swappers/osmosis.png',
          address:
            'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
          blockchain: 'OSMOSIS',
          decimals: 6,
          usdPrice: 0.2688829083335616,
        },
        to: {
          symbol: 'AKT',
          logo: 'https://api.rango.exchange/i/3MAS1e',
          blockchainLogo: 'https://api.rango.exchange/swappers/osmosis.png',
          address: null,
          blockchain: 'AKASH',
          decimals: 6,
          usdPrice: 0.2672300245136459,
        },
        fromAmount: '30.983906',
        fromAmountPrecision: null,
        fromAmountMinValue: null,
        fromAmountMaxValue: null,
        fromAmountRestrictionType: 'EXCLUSIVE',
        toAmount: '30.983906',
        fee: [
          {
            asset: { blockchain: 'OSMOSIS', symbol: 'OSMO', address: null },
            expenseType: 'FROM_SOURCE_WALLET',
            amount: '0.005000',
            name: 'Network Fee',
          },
        ],
        estimatedTimeInSeconds: 45,
        swapChainType: 'INTRA_CHAIN',
        routes: [
          {
            nodes: [
              {
                nodes: [
                  { marketName: 'Osmosis', marketId: null, percent: 1.0 },
                ],
                from: 'AKT',
                fromLogo: 'https://api.rango.exchange/tokens/COSMOS/AKT.png',
                fromAddress:
                  'ibc/1480b8fd20ad5fcae81ea87584d269547dd4d436843c1d20f15e00eb64743ef4',
                fromBlockchain: 'OSMOSIS',
                to: 'AKT',
                toLogo: 'https://api.rango.exchange/tokens/COSMOS/AKT.png',
                toAddress: null,
                toBlockchain: 'AKASH',
              },
            ],
          },
        ],
        recommendedSlippage: null,
        timeStat: { min: 7, avg: 38, max: 187 },
        includesDestinationTx: false,
      },
    ],
  },
  validationStatus: null,
  missingBlockchains: [],
  diagnosisMessages: [],
  processingLimitReached: false,
  walletNotSupportingFromBlockchain: false,
};

export const bestRouteExample3: BestRouteType = {
  from: { blockchain: 'BSC', symbol: 'BNB', address: null },
  to: { blockchain: 'AVAX_CCHAIN', symbol: 'AVAX', address: null },
  requestAmount: '0.3',
  requestId: '228529e3-27d7-4fa9-ab84-bb2b90eade6f',
  result: {
    resultType: RoutingResultType.OK,
    outputAmount: '5.685715974132648891',
    swaps: [
      {
        internalSwaps: [],
        maxRequiredSign: 1,
        warnings: [],
        swapperId: 'AnySwap Aggregator',
        swapperType: 'AGGREGATOR',
        swapperLogo: 'https://api.rango.exchange/swappers/multichain.png',

        from: {
          symbol: 'BNB',
          logo: 'https://api.rango.exchange/i/Y3v1KW',
          blockchainLogo: 'https://api.rango.exchange/blockchains/binance.svg',

          address: null,
          blockchain: 'BSC',
          decimals: 18,
          usdPrice: 279.2738558274085,
        },
        to: {
          symbol: 'WETH.E',
          logo: 'https://api.rango.exchange/i/j9xgdC',
          blockchainLogo:
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
            name: 'Network Fee',
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
  processingLimitReached: false,
  walletNotSupportingFromBlockchain: false,
};
