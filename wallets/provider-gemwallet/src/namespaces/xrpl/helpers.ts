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
    limitAmount: data.LimitAmount,
    memos: fromPaymentTransactionMemoToGemWalletMemo(data.Memos),
    flags: data.Flags,
  };
}

export function fromPaymentTransactionDataToGemWalletRequest(
  data: XrplPaymentTransactionData
): SendPaymentRequest {
  let amount: SendPaymentRequest['amount'];
  if (isMPTokenAmount(data.Amount)) {
    throw new Error("Current implemented signer doesn't have support for MPT");
  } else if (isIssuedCurrencyAmount(data.Amount)) {
    amount = data.Amount;
  } else if (typeof data.Amount === 'string') {
    amount = data.Amount;
  } else {
    throw new Error(
      "There is an unexpected type for Amount. current signer doesn't have support for that."
    );
  }

  return {
    amount,
    destination: data.Destination,
    destinationTag: data.DestinationTag,
    memos: fromPaymentTransactionMemoToGemWalletMemo(data.Memos),
    flags: data.Flags,
  };
}
