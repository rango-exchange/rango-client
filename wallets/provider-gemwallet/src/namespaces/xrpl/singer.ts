import type { XrplTransaction } from 'rango-types/mainApi';

import { sendPayment, setTrustline } from '@gemwallet/api';
import { type GenericSigner, SignerError } from 'rango-types';

import {
  fromPaymentTransactionDataToGemWalletRequest,
  fromTrustSetTransactionDataToGemWalletRequest,
} from './helpers.js';

export class Signer implements GenericSigner<XrplTransaction> {
  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: XrplTransaction): Promise<{ hash: string }> {
    if (tx.data.TransactionType === 'TrustSet') {
      const result = await setTrustline(
        fromTrustSetTransactionDataToGemWalletRequest(tx.data)
      );

      if (result.type === 'reject') {
        throw new Error('The request has been rejected', {
          cause: result,
        });
      }

      if (!result.result) {
        throw new Error(
          'Unexpected error where the result is not returned. (type: UnreachableCode)'
        );
      }

      return {
        hash: result.result.hash,
      };
    } else if (tx.data.TransactionType === 'Payment') {
      const result = await sendPayment(
        fromPaymentTransactionDataToGemWalletRequest(tx.data)
      );

      if (result.type === 'reject') {
        throw new Error('The request has been rejected', {
          cause: result,
        });
      }

      if (!result.result) {
        throw new Error(
          'Unexpected error where the result is not returned. (type: UnreachableCode)'
        );
      }

      return {
        hash: result.result.hash,
      };
    }

    throw new Error('Unsupported transaction type');
  }
}
