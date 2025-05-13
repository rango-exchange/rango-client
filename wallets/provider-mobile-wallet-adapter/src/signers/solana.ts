import type { SolanaWeb3Signer } from '@rango-dev/signer-solana';
import type { Transaction, VersionedTransaction } from '@solana/web3.js';
import type { SolanaMobileWalletAdapter } from '@solana-mobile/wallet-adapter-mobile';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import { generalSolanaTransactionExecutor } from '@rango-dev/signer-solana';
import { SignerError, SignerErrorCode } from 'rango-types';

class SOLANASigner implements GenericSigner<SolanaTransaction> {
  private adapter: SolanaMobileWalletAdapter;

  constructor(adapter: SolanaMobileWalletAdapter) {
    this.adapter = adapter;
  }

  public async signMessage(msg: string): Promise<string> {
    try {
      const messageBuffer = new Uint8Array(
        msg.split('').map((c) => c.charCodeAt(0))
      );
      const signature = await this.adapter.signMessage(messageBuffer);
      return this.uint8ArrayToString(signature);
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const DefaultSolanaSigner: SolanaWeb3Signer = async (
      solanaWeb3Transaction: Transaction | VersionedTransaction
    ) => {
      const signedTransaction = await this.adapter.signTransaction(
        solanaWeb3Transaction
      );
      return signedTransaction.serialize();
    };

    const hash = await generalSolanaTransactionExecutor(
      tx,
      DefaultSolanaSigner
    );
    return { hash };
  }
  private uint8ArrayToString(uint8Array: Uint8Array, encoding = 'utf-8') {
    const decoder = new TextDecoder(encoding);
    return decoder.decode(uint8Array);
  }
}

export default SOLANASigner;
