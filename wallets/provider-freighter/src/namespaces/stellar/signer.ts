import { signMessage, signTransaction } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';
import {
  type GenericSigner,
  SignerError,
  SignerErrorCode,
  type StellarTransaction,
} from 'rango-types';

import { HORIZON_URL, NETWORK_PASSPHRASE } from '../../constants.js';

export class Signer implements GenericSigner<StellarTransaction> {
  async signMessage(msg: string): Promise<string> {
    const signature = await signMessage(msg);

    if (!signature.signedMessage) {
      throw new Error(signature.error);
    }

    if (typeof signature.signedMessage === 'string') {
      return signature.signedMessage;
    }

    return signature.signedMessage.toString('hex');
  }

  async signAndSendTx(tx: StellarTransaction): Promise<{ hash: string }> {
    const { xdrBase64 } = tx;
    const server = new StellarSdk.Horizon.Server(HORIZON_URL);

    const signature = await signTransaction(xdrBase64);

    if (signature.error) {
      throw new SignerError(
        SignerErrorCode.SIGN_TX_ERROR,
        undefined,
        signature.error
      );
    }

    const signedTransaction = new StellarSdk.Transaction(
      signature.signedTxXdr,
      NETWORK_PASSPHRASE
    );

    const result = await server.submitTransaction(signedTransaction);

    if (!result.successful) {
      throw new SignerError(
        SignerErrorCode.SIGN_TX_ERROR,
        'Error submitting transaction',
        undefined
      );
    }

    return { hash: result.hash };
  }
}
