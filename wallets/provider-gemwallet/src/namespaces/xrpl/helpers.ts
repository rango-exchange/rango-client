import type {
  Memo,
  SendPaymentRequest,
  SetTrustlineRequest,
} from '@gemwallet/api';
import type {
  XrplPaymentTransactionData,
  XrplTransactionDataIssuedCurrencyAmount,
  XrplTransactionDataMPTAmount,
  XrplTrustSetTransactionData,
} from 'rango-types/mainApi';

function isIssuedCurrencyAmount(
  amount: XrplPaymentTransactionData['Amount']
): amount is XrplTransactionDataIssuedCurrencyAmount {
  return (
    typeof amount === 'object' &&
    // @ts-expect-error it never throw an runtime error, since we are checking it should be an object first
    typeof amount.currency === 'string' &&
    // @ts-expect-error it never throw an runtime error, since we are checking it should be an object first
    typeof amount.issuer === 'string' &&
    typeof amount.value === 'string'
  );
}

function isMPTokenAmount(
  amount: XrplPaymentTransactionData['Amount']
): amount is XrplTransactionDataMPTAmount {
  return (
    typeof amount === 'object' &&
    // @ts-expect-error it never throw an runtime error, since we are checking it should be an object first
    typeof amount.mpt_issuance_id === 'string' &&
    typeof amount.value === 'string'
  );
}

function fromPaymentTransactionMemoToGemWalletMemo(
  memos: XrplPaymentTransactionData['Memos']
): Memo[] {
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

export function fromTrustSetTransactionDataToGemWalletRequest(
  data: XrplTrustSetTransactionData
): SetTrustlineRequest {
  return {
    limitAmount: {
      currency: data.LimitAmount.currency,
      value: data.LimitAmount.value,
      issuer: data.LimitAmount.issuer,
    },
    memos: fromPaymentTransactionMemoToGemWalletMemo(data.Memos),
    flags: data.Flags,
  };
}

export function fromPaymentTransactionDataToGemWalletRequest(
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
    memos: fromPaymentTransactionMemoToGemWalletMemo(data.Memos),
    flags: data.Flags,
  };
}
