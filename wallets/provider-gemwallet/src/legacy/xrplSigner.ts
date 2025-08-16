import type {
  XrplPaymentTransactionData,
  XrplTransaction,
  XrplTransactionDataIssuedCurrencyAmount,
  XrplTransactionDataMPTAmount,
  XrplTrustSetTransactionData,
} from 'rango-types/mainApi';

import {
  sendPayment,
  type SendPaymentRequest,
  setTrustline,
  type SetTrustlineRequest,
} from '@gemwallet/api';
import { type GenericSigner, SignerError } from 'rango-types';

/*
 * duplicated from queue
 */

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

function toGemWalletTrustlineRequest(
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

function toGemWalletPaymentRequest(
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

export class XrplSigner implements GenericSigner<XrplTransaction> {
  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: XrplTransaction): Promise<{ hash: string }> {
    if (tx.data.TransactionType === 'TrustSet') {
      const result = await setTrustline(toGemWalletTrustlineRequest(tx.data));

      if (result.type === 'reject') {
        throw new Error('The request has been rejected', {
          cause: result,
        });
      }

      if (!result.result) {
        throw new Error('This should be unreachable code. update later.');
      }

      return {
        hash: result.result.hash,
      };
    } else if (tx.data.TransactionType === 'Payment') {
      const result = await sendPayment(toGemWalletPaymentRequest(tx.data));

      if (result.type === 'reject') {
        throw new Error('The request has been rejected', {
          cause: result,
        });
      }

      if (!result.result) {
        throw new Error('This should be unreachable code. update later.');
      }

      return {
        hash: result.result.hash,
      };
    }

    throw new Error('Unsupported tranasction type');
  }
}
