import type { Transaction, VersionedTransaction } from '@solana/web3.js';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import {
  type SolanaExternalProvider,
  type SolanaWeb3Signer,
} from '@rango-dev/signer-solana';
import { generalSolanaTransactionExecutor } from '@rango-dev/signer-solana';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { SignerError, SignerErrorCode } from 'rango-types';

export class Coin98SolanaSigner implements GenericSigner<SolanaTransaction> {
  private provider: SolanaExternalProvider;
  constructor(provider: SolanaExternalProvider) {
    this.provider = provider;
  }

  async signMessage(msg: string): Promise<string> {
    try {
      const result = await this.provider.signMessage(msg);
      return result.signature as unknown as string;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const DefaultSolanaSigner: SolanaWeb3Signer = async (
      solanaWeb3Transaction: Transaction | VersionedTransaction
    ) => {
      const response: { publicKey: string; signature: string } =
        await this.provider.request({
          method: 'sol_sign',
          params: [solanaWeb3Transaction],
        });
      const publicKey = new PublicKey(response.publicKey);
      const sign = bs58.decode(response.signature);

      solanaWeb3Transaction.addSignature(publicKey, Buffer.from(sign));
      const raw = solanaWeb3Transaction.serialize();
      return raw;
    };
    try {
      const hash = await generalSolanaTransactionExecutor(
        tx,
        DefaultSolanaSigner
      );
      return { hash };
    } catch (e: unknown) {
      const REJECTION_CODE = 4001;
      if (
        e &&
        typeof e === 'object' &&
        'code' in e &&
        e.code === REJECTION_CODE
      ) {
        throw new SignerError(SignerErrorCode.REJECTED_BY_USER, undefined, e);
      }
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, e);
    }
  }
}
