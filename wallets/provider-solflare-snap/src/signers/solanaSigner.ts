import type SolflareMetaMask from '@solflare-wallet/metamask-sdk';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import {
  getSolanaConnection,
  prepareTransaction,
  simulateTransaction,
} from '@rango-dev/signer-solana';
import { SignerError, SignerErrorCode } from 'rango-types';

const REJECTION_CODE = 4001;

export class SolflareSnapSolanaSigner
  implements GenericSigner<SolanaTransaction>
{
  private provider: SolflareMetaMask;

  constructor(provider: SolflareMetaMask) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    try {
      const connection = getSolanaConnection();
      const latestBlock = await connection.getLatestBlockhash('confirmed');

      const finalTx = prepareTransaction(tx, latestBlock.blockhash);

      await simulateTransaction(finalTx, tx.txType);

      const hash = await this.provider.signAndSendTransaction(finalTx);

      return { hash };
    } catch (error: any) {
      if (error instanceof SignerError) {
        throw error;
      }
      if (
        error &&
        Object.hasOwn(error, 'code') &&
        error.code === REJECTION_CODE
      ) {
        throw new SignerError(
          SignerErrorCode.REJECTED_BY_USER,
          undefined,
          error
        );
      }
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }
}
