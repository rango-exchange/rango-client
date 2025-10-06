import type { WalletStandardSolanaInstance } from '../types.js';

import {
  generalSolanaTransactionExecutor,
  type SolanaWeb3Signer,
} from '@rango-dev/signer-solana';
import base58 from 'bs58';
import {
  type GenericSigner,
  SignerError,
  SignerErrorCode,
  type SolanaTransaction,
} from 'rango-types';

async function executeSolanaTransaction(
  tx: SolanaTransaction,
  solanaProvider: WalletStandardSolanaInstance
): Promise<string> {
  const DefaultSolanaSigner: SolanaWeb3Signer = async (
    solanaWeb3Transaction
  ) => {
    const [currentAccount] = solanaProvider.accounts;
    if (!currentAccount.publicKey) {
      throw new SignerError(
        SignerErrorCode.SIGN_TX_ERROR,
        'Please make sure the required account is connected properly.'
      );
    }

    if (tx.from !== currentAccount.address) {
      throw new SignerError(
        SignerErrorCode.SIGN_TX_ERROR,
        `Your connected account doesn't match with the required account. Please ensure that you are connected with the correct account and try again.`
      );
    }

    try {
      const [signOutput] = await solanaProvider.features[
        'solana:signTransaction'
      ].signTransaction({
        account: currentAccount,
        transaction: solanaWeb3Transaction.serialize(),
      });
      return signOutput.signedTransaction;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      const REJECTION_CODE = 4001;
      if (e && Object.hasOwn(e, 'code') && e.code === REJECTION_CODE) {
        throw new SignerError(SignerErrorCode.REJECTED_BY_USER, undefined, e);
      }
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, e);
    }
  };
  return await generalSolanaTransactionExecutor(tx, DefaultSolanaSigner);
}

export class MetamaskSolanaSigner implements GenericSigner<SolanaTransaction> {
  private _provider: WalletStandardSolanaInstance;

  constructor(provider: WalletStandardSolanaInstance) {
    this._provider = provider;
  }

  get provider(): WalletStandardSolanaInstance {
    return this._provider;
  }

  async signMessage(msg: string): Promise<string> {
    try {
      const encodedMessage = new TextEncoder().encode(msg);
      const [account] = this.provider.accounts;
      const [signOutput] = await this._provider.features[
        'solana:signMessage'
      ].signMessage({
        message: encodedMessage,
        account,
      });
      return base58.encode(signOutput.signature);
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const hash = await executeSolanaTransaction(tx, this._provider);
    return { hash };
  }
}
