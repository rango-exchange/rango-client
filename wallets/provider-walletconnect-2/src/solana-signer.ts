import {
  SolanaWeb3Signer,
  generalSolanaTransactionExecutor,
} from '@rango-dev/signer-solana';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import base58 from 'bs58';
import {
  SolanaTransaction,
  GenericSigner,
  SignerError,
  SignerErrorCode,
} from 'rango-types';
// TODO - replace with real type
// tslint:disable-next-line: no-any
type SolanaExternalProvider = any;

export class CustomSolanaSigner implements GenericSigner<SolanaTransaction> {
  private provider: SolanaExternalProvider;
  constructor(provider: SolanaExternalProvider) {
    this.provider = provider;
  }

  async signMessage(msg: string, address: string): Promise<string> {
    console.log({ address });

    try {
      const message = base58.encode(new TextEncoder().encode(msg));
      const pubkey = new PublicKey(address);
      const { signature } = await this.provider.request({
        method: 'solana_signMessage',
        params: {
          message,
          pubkey,
        },
      });

      return signature;
    } catch (error) {
      console.log({ error });

      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const DefaultSolanaSigner: SolanaWeb3Signer = async (
      solanaWeb3Transaction: Transaction | VersionedTransaction
    ) => {
      const response: { signature: string } = await this.provider.request({
        method: 'solana_signTransaction',
        params: solanaWeb3Transaction,
      });

      const publicKey = new PublicKey(tx.from);
      const sign = base58.decode(response.signature);

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
