import type {
  ConfirmedRoute,
  SelectedQuote,
  SelectedWallet,
} from '../../src/confirmation/types';
import type {
  Asset,
  BlockchainValidationStatus,
  SwapFee,
  SwapResult,
  SwapResultAsset,
} from 'rango-sdk';

/** A step asset on `blockchain`; `usdPrice` is `null` when the API has no price for it. */
export function asset(
  blockchain: string,
  usdPrice: number | null = 1
): SwapResultAsset {
  return {
    blockchain,
    symbol: blockchain,
    address: null,
    decimals: 18,
    usdPrice,
  } as SwapResultAsset;
}

/** Only the fields the confirmation reads; the cast covers the rest. */
export function swap(
  from: SwapResultAsset,
  to: SwapResultAsset,
  fields: Partial<SwapResult> = {}
): SwapResult {
  return {
    swapperId: 'swapper',
    from,
    to,
    fromAmount: '1',
    toAmount: '1',
    fromAmountMinValue: null,
    fromAmountMaxValue: null,
    fromAmountRestrictionType: 'INCLUSIVE',
    fee: [],
    recommendedSlippage: null,
    internalSwaps: null,
    ...fields,
  } as SwapResult;
}

export function fee(
  amount: string,
  price: number | null,
  expenseType: SwapFee['expenseType'] = 'FROM_SOURCE_WALLET',
  feeAsset: Asset = { blockchain: 'ETH', symbol: 'ETH', address: null }
): SwapFee {
  return {
    name: 'Network Fee',
    expenseType,
    asset: feeAsset,
    amount,
    price,
    meta: null,
  };
}

/** A confirmed route over `swaps`; no swaps means the API found no route. */
export function route(
  swaps: SwapResult[],
  fields: {
    requestAmount?: string;
    outputAmount?: string;
    validationStatus?: BlockchainValidationStatus[];
    diagnosisMessages?: string[];
  } = {}
): ConfirmedRoute {
  return {
    requestId: 'req-1',
    requestAmount: fields.requestAmount ?? '1',
    from: { blockchain: 'ETH', symbol: 'ETH', address: null },
    to: { blockchain: 'BSC', symbol: 'BNB', address: null },
    result: swaps.length
      ? { outputAmount: fields.outputAmount ?? '1', resultType: 'OK', swaps }
      : null,
    validationStatus: fields.validationStatus ?? [],
    diagnosisMessages: fields.diagnosisMessages ?? [],
    missingBlockchains: [],
    walletNotSupportingFromBlockchain: false,
  } as ConfirmedRoute;
}

export function quote(swaps: SwapResult[], outputAmount = '1'): SelectedQuote {
  return { requestId: 'req-1', outputAmount, swaps };
}

export function wallet(chain: string): SelectedWallet {
  return {
    chain,
    address: `${chain.toLowerCase()}-address`,
    walletType: 'metamask',
  };
}
