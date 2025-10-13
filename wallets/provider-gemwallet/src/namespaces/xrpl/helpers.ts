import type { SendPaymentRequest, SetTrustlineRequest } from '@gemwallet/api';
import type {
  XrplPaymentTransactionData,
  XrplTransactionDataIssuedCurrencyAmount,
  XrplTransactionDataMPTAmount,
  XrplTrustSetTransactionData,
} from 'rango-types/mainApi';

import {
  CAIP_NAMESPACE,
  CAIP_XRPL_CHAIN_ID,
} from '@rango-dev/wallets-core/namespaces/xrpl';
import { CAIP } from '@rango-dev/wallets-core/utils';

export function formatAddressToCAIP(address: string): string {
  return CAIP.AccountId.format({
    address,
    chainId: {
      namespace: CAIP_NAMESPACE,
      reference: CAIP_XRPL_CHAIN_ID,
    },
  });
}

function isIssuedCurrencyAmount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  amount: any
): amount is XrplTransactionDataIssuedCurrencyAmount {
  return (
    typeof amount === 'object' &&
    typeof amount.currency === 'string' &&
    typeof amount.issuer === 'string' &&
    typeof amount.value === 'string'
  );
}

function isMPTokenAmount(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  amount: any
): amount is XrplTransactionDataMPTAmount {
  return (
    typeof amount === 'object' &&
    typeof amount.mpt_issuance_id === 'string' &&
    typeof amount.value === 'string'
  );
}

function toGemWalletMemo(memos: XrplPaymentTransactionData['Memos']) {
  if (!memos) {
    return [];
  }

  return memos.map((memo) => {
    return {
      memo: {
        memoType: memo.Memo.MemoType,
        memoData: memo.Memo.MemoData,
        memoFormat: memo.Memo.MemoFormat,
      },
    };
  });
}

export function toGemWalletTrustlineRequest(
  data: XrplTrustSetTransactionData
): SetTrustlineRequest {
  return {
    limitAmount: {
      currency: data.LimitAmount.currency,
      value: data.LimitAmount.value,
      issuer: data.LimitAmount.issuer,
    },
    memos: toGemWalletMemo(data.Memos),
    flags: data.Flags,
  };
}

export function toGemWalletPaymentRequest(
  data: XrplPaymentTransactionData
): SendPaymentRequest {
  if (isMPTokenAmount(data.Amount)) {
    throw new Error("Current implemented signer doesn't have support for MPT");
  }

  const amount = isIssuedCurrencyAmount(data.Amount)
    ? {
        currency: data.Amount.currency,
        value: data.Amount.value,
        issuer: data.Amount.issuer,
      }
    : data.Amount;

  return {
    amount,
    destination: data.Destination,
    destinationTag: data.DestinationTag,
    memos: toGemWalletMemo(data.Memos),
    flags: data.Flags,
  };
}
