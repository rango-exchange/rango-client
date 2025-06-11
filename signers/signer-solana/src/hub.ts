import type { ProxiedNamespace } from '@rango-dev/wallets-core';
import type { SolanaActions } from '@rango-dev/wallets-core/namespaces/solana';
import type { SolanaTransaction } from 'rango-types/mainApi';

import { type GenericSigner, SignerError, SignerErrorCode } from 'rango-types';

import {
  generalSolanaTransactionExecutor,
  type SolanaWeb3Signer,
} from './index.js';

export class HubSolanaSigner implements GenericSigner<SolanaTransaction> {
  private namespace: ProxiedNamespace<SolanaActions>;

  constructor(namespace: ProxiedNamespace<SolanaActions>) {
    this.namespace = namespace;
  }
  async signMessage(msg: string): Promise<string> {
    return this.namespace.signMessage(msg);
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const DefaultSolanaSigner: SolanaWeb3Signer = async (
      solanaWeb3Transaction
    ) => {
      const solanaProvider = this.namespace.getInstance();

      if (!solanaProvider) {
        throw new SignerError(
          SignerErrorCode.SIGN_TX_ERROR,
          'Solana instance is not available.'
        );
      }

      if (!solanaProvider.publicKey) {
        throw new SignerError(
          SignerErrorCode.SIGN_TX_ERROR,
          'Please make sure the required account is connected properly.'
        );
      }

      if (tx.from !== solanaProvider.publicKey?.toString()) {
        throw new SignerError(
          SignerErrorCode.SIGN_TX_ERROR,
          `Your connected account doesn't match with the required account. Please ensure that you are connected with the correct account and try again.`
        );
      }

      try {
        const signedTransaction = await this.namespace.signTransaction(
          solanaWeb3Transaction
        );
        return signedTransaction.serialize();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const REJECTION_CODE = 4001;
        if (e && Object.hasOwn(e, 'code') && e.code === REJECTION_CODE) {
          throw new SignerError(SignerErrorCode.REJECTED_BY_USER, undefined, e);
        }
        throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, e);
      }
    };
    const hash = await generalSolanaTransactionExecutor(
      tx,
      DefaultSolanaSigner
    );
    return { hash };
  }
}
