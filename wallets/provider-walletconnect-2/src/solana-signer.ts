import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import base58 from 'bs58';
import {
  SolanaTransaction,
  GenericSigner,
  SignerError,
  SignerErrorCode,
} from 'rango-types';
const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const SOLANA_RPC_URL = !IS_DEV
  ? 'https://icy-crimson-wind.solana-mainnet.quiknode.pro/c83f94ebeb39a6d6a9d2ab03d4cba2c2af83c5c0/'
  : 'https://fluent-still-scion.solana-mainnet.discover.quiknode.pro/fc8be9b8ac7aea382ec591359628e16d8c52ef6a/';

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
      console.log({ message });
      const pubkey = new PublicKey(address);
      console.log({ pubkey });

      const { signature } = await this.provider.request({
        method: 'solana_signMessage',
        params: {
          message,
          pubkey,
        },
      });

      console.log({ signature });

      return signature;
    } catch (error) {
      console.log({ error });

      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const connection = new Connection(SOLANA_RPC_URL, {
      commitment: 'confirmed',
      disableRetryOnRateLimit: false,
    });
    // Using deprecated `getRecentBlockhash` over `getLatestBlockhash` here, since `mainnet-beta`
    // cluster only seems to support `connection.getRecentBlockhash` currently.
    const { blockhash } = await connection.getRecentBlockhash();
    const senderPublicKey = new PublicKey(tx.from);
    const transaction = new Transaction({
      feePayer: senderPublicKey,
      recentBlockhash: blockhash,
    }).add(
      SystemProgram.transfer({
        fromPubkey: senderPublicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1,
      })
    );
    const signatures = tx.signatures.map((signatureItem) => {
      const signature = Buffer.from(new Uint8Array(signatureItem.signature));
      const pubkey = new PublicKey(signatureItem.publicKey);
      console.log({ pubkey, signature });

      return {
        pubkey,
        signature,
      };
    });
    console.log('s', transaction.feePayer?.toBase58(), transaction);

    const result = await this.provider.request({
      method: 'solana_signTransaction',
      params: {
        feePayer: transaction.feePayer?.toBase58(),
        recentBlockhash: transaction.recentBlockhash,
        instructions: transaction.instructions.map((i) => ({
          programId: i.programId.toBase58(),
          data: Array.from(i.data),
          keys: i.keys.map((k) => ({
            isSigner: k.isSigner,
            isWritable: k.isWritable,
            pubkey: k.pubkey.toBase58(),
          })),
        })),
        signatures,
      },
    });

    const signature = await retryPromise(
      connection.sendRawTransaction(result),
      2,
      30_000
    );
    if (!signature)
      throw new Error('tx cant send to blockchain. signature=' + signature);

    return { hash: signature };
  }
}

async function retryPromise<Type>(
  promise: Promise<Type>,
  count: number,
  timeoutMs: number,
  verifier: ((input: Type) => boolean) | null = null
): Promise<Type> {
  let remained = count;
  while (remained > 0) {
    try {
      const result = (await Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), timeoutMs)
        ),
      ])) as Type;
      if (remained > 1 && verifier != null && !verifier(result))
        throw new Error('bad result');
      return result;
    } catch (er) {
      console.log(
        'cant get result. time=' +
          new Date().toLocaleTimeString() +
          ' i=' +
          remained +
          ' , err=',
        er
      );
      remained--;
    }
  }
  throw new SignerError(
    SignerErrorCode.SEND_TX_ERROR,
    'function reached max retry count'
  );
}
