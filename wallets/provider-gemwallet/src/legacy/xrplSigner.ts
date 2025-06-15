import type {
  XrplTransaction,
  XrplTransactionDataIssuedCurrencyAmount,
  XrplTransactionDataMPTAmount,
} from 'rango-types/mainApi';

import { sendPayment, setTrustline } from '@gemwallet/api';
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
export class XrplSigner implements GenericSigner<XrplTransaction> {
  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: XrplTransaction): Promise<{ hash: string }> {
    if (tx.data.TransactionType === 'TrustSet') {
      const transaction = {
        limitAmount: {
          currency: tx.data.LimitAmount.currency,
          value: tx.data.LimitAmount.value,
          issuer: tx.data.LimitAmount.issuer,
        },
        memo: (tx.data.Memos || []).map((memo) => {
          return {
            memo: {
              memoType: memo.Memo.MemoType,
              memoData: memo.Memo.MemoData,
              memoFormat: memo.Memo.MemoFormat,
            },
          };
        }),
        flags: tx.data.Flags,
      };
      const result = await setTrustline(transaction);

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
      if (isMPTokenAmount(tx.data.Amount)) {
        throw new Error(
          "Current implemented signer doesn't have support for MPT"
        );
      }

      const amount = isIssuedCurrencyAmount(tx.data.Amount)
        ? {
            currency: tx.data.Amount.currency,
            value: tx.data.Amount.value,
            issuer: tx.data.Amount.issuer,
          }
        : tx.data.Amount;

      const transaction = {
        amount,
        destination: tx.data.Destination,
        destinationTag: tx.data.DestinationTag,
        memo: (tx.data.Memos || []).map((memo) => {
          return {
            memo: {
              memoType: memo.Memo.MemoType,
              memoData: memo.Memo.MemoData,
              memoFormat: memo.Memo.MemoFormat,
            },
          };
        }),
        flags: tx.data.Flags,
      };
      const result = await sendPayment(transaction);

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
