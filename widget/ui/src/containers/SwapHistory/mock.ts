/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { PendingSwap } from 'rango-types';

import { RoutingResultType, TransactionType } from 'rango-sdk';
import { MessageSeverity } from 'rango-types';

export const pendingSwap: PendingSwap = {
  creationTime: '1673164511955',
  finishTime: '1673164550137',
  requestId: '51e211d9-d61c-45d2-a4d4-1f9f7f90ee85',
  inputAmount: '1',
  wallets: {
    OSMOSIS: {
      walletType: 'keplr',
      address: 'osmo1unf2rcytjxfpz8x8ar63h4qeftadptg5t0nqcl',
    },
  },
  status: 'running',
  isPaused: false,
  extraMessage: null,
  extraMessageSeverity: MessageSeverity.info,
  extraMessageDetail: '',
  extraMessageErrorCode: null,
  networkStatusExtraMessage: null,
  networkStatusExtraMessageDetail: null,
  lastNotificationTime: null,
  settings: {
    slippage: '1.0',
    disabledSwappersIds: [],
    disabledSwappersGroups: [],
  },
  simulationResult: {
    resultType: RoutingResultType.OK,
    outputAmount: '1.540670',
    swaps: [
      {
        swapperId: 'Osmosis',
        swapperType: 'DEX',
        swapperLogo: '',
        from: {
          symbol: 'JUNO',
          logo: 'https://api.rango.exchange/tokens/COSMOS/JUNO.png',
          address:
            'ibc/46b44899322f3cd854d2d46deef881958467cdd4b3b10086da49296bbed94bed',
          blockchain: 'OSMOSIS',
          blockchainLogo: 'https://api.rango.exchange/swappers/osmosis.png',
          decimals: 6,
          usdPrice: 1.1091996179668873,
        },
        to: {
          symbol: 'OSMO',
          logo: 'https://api.rango.exchange/i/mJQPS2',
          address: null,
          blockchain: 'OSMOSIS',
          decimals: 6,
          blockchainLogo: 'https://api.rango.exchange/swappers/osmosis.png',
          usdPrice: 0.7192435454440882,
        },
        fromAmount: '1.000000',
        fromAmountPrecision: null,
        fromAmountMinValue: null,
        fromAmountMaxValue: null,
        fromAmountRestrictionType: 'EXCLUSIVE',
        toAmount: '1.540670',
        fee: [
          {
            asset: {
              blockchain: 'OSMOSIS',
              symbol: 'OSMO',
              address: null,
            },
            expenseType: 'FROM_SOURCE_WALLET',
            name: 'Network Fee',
            amount: '0',
            price: null,
          },
        ],
        estimatedTimeInSeconds: 45,
        swapChainType: 'INTRA_CHAIN',
        routes: [
          {
            nodes: [
              {
                nodes: [
                  {
                    marketName: 'pool#498',
                    marketId: null,
                    percent: 1,
                  },
                ],
                from: 'JUNO',
                fromLogo: 'https://api.rango.exchange/tokens/COSMOS/JUNO.png',
                fromAddress:
                  'ibc/46b44899322f3cd854d2d46deef881958467cdd4b3b10086da49296bbed94bed',
                fromBlockchain: 'OSMOSIS',
                to: 'ATOM',
                toLogo: 'https://api.rango.exchange/tokens/COSMOS/ATOM.png',
                toAddress:
                  'ibc/27394fb092d2eccd56123c74f36e4c1f926001ceada9ca97ea622b25f41e5eb2',
                toBlockchain: 'OSMOSIS',
              },
              {
                nodes: [
                  {
                    marketName: 'pool#8',
                    marketId: null,
                    percent: 1,
                  },
                ],
                from: 'ATOM',
                fromLogo: 'https://api.rango.exchange/tokens/COSMOS/ATOM.png',
                fromAddress:
                  'ibc/27394fb092d2eccd56123c74f36e4c1f926001ceada9ca97ea622b25f41e5eb2',
                fromBlockchain: 'OSMOSIS',
                to: 'IRIS',
                toLogo: 'https://api.rango.exchange/tokens/COSMOS/IRIS.png',
                toAddress:
                  'ibc/7c4d60aa95e5a7558b0a364860979ca34b7ff8aaf255b87af9e879374470cec0',
                toBlockchain: 'OSMOSIS',
              },
              {
                nodes: [
                  {
                    marketName: 'pool#7',
                    marketId: null,
                    percent: 1,
                  },
                ],
                from: 'IRIS',
                fromLogo: 'https://api.rango.exchange/tokens/COSMOS/IRIS.png',
                fromAddress:
                  'ibc/7c4d60aa95e5a7558b0a364860979ca34b7ff8aaf255b87af9e879374470cec0',
                fromBlockchain: 'OSMOSIS',
                to: 'OSMO',
                toLogo: 'https://api.rango.exchange/tokens/COSMOS/OSMO.png',
                toAddress: null,
                toBlockchain: 'OSMOSIS',
              },
            ],
          },
        ],
        recommendedSlippage: null,
        timeStat: {
          min: 6,
          avg: 40,
          max: 241,
        },
        includesDestinationTx: false,
        maxRequiredSign: 1,
        warnings: [],
        internalSwaps: null,
      },
    ],
  },
  validateBalanceOrFee: true,
  steps: [
    {
      id: 1,
      fromBlockchain: 'OSMOSIS',
      fromSymbol: 'JUNO',
      swapperType: 'test',
      fromSymbolAddress:
        'ibc/46b44899322f3cd854d2d46deef881958467cdd4b3b10086da49296bbed94bed',
      fromDecimals: 6,
      fromAmountPrecision: null,
      fromAmountRestrictionType: 'EXCLUSIVE',
      estimatedTimeInSeconds: 5,
      fromAmountMinValue: null,
      fromAmountMaxValue: null,
      fromUsdPrice: null,
      toBlockchainLogo: 'https://api.rango.exchange/swappers/osmosis.png',
      fromBlockchainLogo: 'https://api.rango.exchange/swappers/osmosis.png',
      toBlockchain: 'OSMOSIS',
      fromLogo: 'https://api.rango.exchange/tokens/COSMOS/JUNO.png',
      toSymbol: 'OSMO',
      toSymbolAddress: null,
      toDecimals: 6,
      toLogo: 'https://api.rango.exchange/i/mJQPS2',
      toUsdPrice: null,
      startTransactionTime: 1673164519916,
      swapperId: 'Osmosis',
      swapperLogo: 'https://api.rango.exchange/swappers/osmosis.png',
      expectedOutputAmountHumanReadable: '1.540670',
      outputAmount: '1.540658',
      status: 'running',
      networkStatus: null,
      executedTransactionId:
        '0f8f17eecc863c2d6be65ef52cfe3128ff3cd7baeddf133160bea8ccdfbf876b',
      explorerUrl: [
        {
          url: 'https://www.mintscan.io/osmosis/txs/0f8f17eecc863c2d6be65ef52cfe3128ff3cd7baeddf133160bea8ccdfbf876b',
          description: null,
        },
      ],
      starknetApprovalTransaction: null,
      starknetTransaction: null,
      tronApprovalTransaction: null,
      tonTransaction: null,
      tronTransaction: null,
      feeInUsd: null,
      executedTransactionTime: null,
      cosmosTransaction: {
        type: TransactionType.COSMOS,
        fromWalletAddress: 'osmo1unf2rcytjxfpz8x8ar63h4qeftadptg5t0nqcl',
        blockChain: 'OSMOSIS',
        data: {
          chainId: 'osmosis-1',
          account_number: 102721,
          sequence: '308',
          msgs: [
            {
              __type: 'OsmosisSwapMessage',
              type: 'osmosis/gamm/swap-exact-amount-in',
              value: {
                sender: 'osmo1unf2rcytjxfpz8x8ar63h4qeftadptg5t0nqcl',
                routes: [
                  {
                    pool_id: '498',
                    token_out_denom:
                      'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
                  },
                  {
                    pool_id: '8',
                    token_out_denom:
                      'ibc/7C4D60AA95E5A7558B0A364860979CA34B7FF8AAF255B87AF9E879374470CEC0',
                  },
                  {
                    pool_id: '7',
                    token_out_denom: 'uosmo',
                  },
                ],
                token_in: {
                  denom:
                    'ibc/46B44899322F3CD854D2D46DEEF881958467CDD4B3B10086DA49296BBED94BED',
                  amount: '1000000',
                },
                token_out_min_amount: '1525264',
              },
            },
          ],
          protoMsgs: [
            {
              type_url: '/osmosis.gamm.v1beta1.MsgSwapExactAmountIn',
              value: [
                10, 43, 111, 115, 109, 111, 49, 117, 110, 102, 50, 114, 99, 121,
                116, 106, 120, 102, 112, 122, 56, 120, 56, 97, 114, 54, 51, 104,
                52, 113, 101, 102, 116, 97, 100, 112, 116, 103, 53, 116, 48,
                110, 113, 99, 108, 18, 73, 8, -14, 3, 18, 68, 105, 98, 99, 47,
                50, 55, 51, 57, 52, 70, 66, 48, 57, 50, 68, 50, 69, 67, 67, 68,
                53, 54, 49, 50, 51, 67, 55, 52, 70, 51, 54, 69, 52, 67, 49, 70,
                57, 50, 54, 48, 48, 49, 67, 69, 65, 68, 65, 57, 67, 65, 57, 55,
                69, 65, 54, 50, 50, 66, 50, 53, 70, 52, 49, 69, 53, 69, 66, 50,
                18, 72, 8, 8, 18, 68, 105, 98, 99, 47, 55, 67, 52, 68, 54, 48,
                65, 65, 57, 53, 69, 53, 65, 55, 53, 53, 56, 66, 48, 65, 51, 54,
                52, 56, 54, 48, 57, 55, 57, 67, 65, 51, 52, 66, 55, 70, 70, 56,
                65, 65, 70, 50, 53, 53, 66, 56, 55, 65, 70, 57, 69, 56, 55, 57,
                51, 55, 52, 52, 55, 48, 67, 69, 67, 48, 18, 9, 8, 7, 18, 5, 117,
                111, 115, 109, 111, 26, 79, 10, 68, 105, 98, 99, 47, 52, 54, 66,
                52, 52, 56, 57, 57, 51, 50, 50, 70, 51, 67, 68, 56, 53, 52, 68,
                50, 68, 52, 54, 68, 69, 69, 70, 56, 56, 49, 57, 53, 56, 52, 54,
                55, 67, 68, 68, 52, 66, 51, 66, 49, 48, 48, 56, 54, 68, 65, 52,
                57, 50, 57, 54, 66, 66, 69, 68, 57, 52, 66, 69, 68, 18, 7, 49,
                48, 48, 48, 48, 48, 48, 34, 7, 49, 53, 50, 53, 50, 54, 52,
              ],
            },
          ],
          memo: '',
          source: null,
          fee: {
            gas: '900000',
            amount: [
              {
                denom: 'uosmo',
                amount: '0',
              },
            ],
          },
          signType: 'AMINO',
          rpcUrl: 'sample_rpc',
        },
        rawTransfer: null,
      },
      solanaTransaction: null,
      evmTransaction: null,
      evmApprovalTransaction: null,
      transferTransaction: null,
      diagnosisUrl: null,
      internalSteps: null,
      internalSwaps: null,
    },
  ],
};
