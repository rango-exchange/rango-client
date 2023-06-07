import { GenericSigner, SignerError, SolanaTransaction } from 'rango-types';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import {
  SolanaWeb3Signer,
  generalSolanaTransactionExecutor,
} from '@rango-dev/signer-solana';

// TODO - replace with real type
// tslint:disable-next-line: no-any
type SolanaExternalProvider = any;

export class CustomSolanaSigner implements GenericSigner<SolanaTransaction> {
  private provider: SolanaExternalProvider;
  constructor(provider: SolanaExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
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
    const hash = await generalSolanaTransactionExecutor(
      tx,
      DefaultSolanaSigner
    );
    return { hash };
  }
}
