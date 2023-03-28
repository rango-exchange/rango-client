import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { SignerError, SignerErrorCode, SolanaTransaction } from 'rango-types';

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
function getFailedHash(tx: SolanaTransaction) {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return 'failed::' + tx.identifier + '::' + random;
}

const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const SOLANA_RPC_URL = !IS_DEV
  ? 'https://icy-crimson-wind.solana-mainnet.quiknode.pro/c83f94ebeb39a6d6a9d2ab03d4cba2c2af83c5c0/'
  : 'https://api.metaplex.solana.com/';

function getSolanaConnection(): Connection {
  return new Connection(SOLANA_RPC_URL, {
    commitment: 'confirmed',
    disableRetryOnRateLimit: false,
  });
}

function confirmTx(signature: string): Promise<boolean> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve, reject) {
    let confirmRetry = 3;
    let successfulConfirm = false;
    while (confirmRetry > 0) {
      try {
        const confirmResult = await getSolanaConnection().confirmTransaction(
          signature
        );
        if (
          !!confirmResult &&
          !!confirmResult.value &&
          confirmResult.value.err == null
        ) {
          successfulConfirm = true;
          break;
        } else if (
          confirmRetry === 1 &&
          !!confirmResult &&
          !!confirmResult.value &&
          !!confirmResult.value.err
        )
          reject(confirmResult.value.err);
      } catch (e) {
        if (confirmRetry === 1) reject(e);
      }

      confirmRetry -= 1;
    }
    resolve(successfulConfirm);
  });
}

// https://docs.phantom.app/integrating/sending-a-transaction
// https://codesandbox.io/s/github/phantom-labs/sandbox
export type SolanaWeb3Signer = (
  solanaWeb3Transaction: Transaction
) => Promise<number[] | Buffer | Uint8Array>;

export const generalSolanaTransactionExecutor = async (
  tx: SolanaTransaction,
  DefaultSolanaSigner: SolanaWeb3Signer
): Promise<string> => {
  const connection = getSolanaConnection();
  let transaction: Transaction;
  if (tx.serializedMessage != null) {
    transaction = Transaction.from(
      Buffer.from(new Uint8Array(tx.serializedMessage))
    );
    transaction.feePayer = new PublicKey(tx.from);
    transaction.recentBlockhash = undefined;
  } else {
    transaction = new Transaction();
    transaction.feePayer = new PublicKey(tx.from);
    transaction.recentBlockhash = tx.recentBlockhash || undefined;
    tx.instructions.forEach((instruction) => {
      transaction.add(
        new TransactionInstruction({
          keys: instruction.keys.map((accountMeta) => ({
            pubkey: new PublicKey(accountMeta.pubkey),
            isSigner: accountMeta.isSigner,
            isWritable: accountMeta.isWritable,
          })),
          programId: new PublicKey(instruction.programId),
          data: Buffer.from(instruction.data),
        })
      );
    });
    tx.signatures.forEach(function (signatureItem) {
      const signature = Buffer.from(new Uint8Array(signatureItem.signature));
      const publicKey = new PublicKey(signatureItem.publicKey);
      transaction.addSignature(publicKey, signature);
    });
  }
  if (!transaction) throw new Error('error creating transaction');
  try {
    if (!transaction.recentBlockhash)
      transaction.recentBlockhash = (
        await retryPromise(connection.getLatestBlockhash('confirmed'), 5, 10000)
      ).blockhash;
    const raw = await DefaultSolanaSigner(transaction);
    const signature = await retryPromise(
      connection.sendRawTransaction(raw),
      2,
      30000
    );
    if (!signature)
      throw new Error('tx cant send to blockchain. signature=' + signature);
    const confirmed = await confirmTx(signature);
    if (!confirmed)
      throw new Error('tx cant confirm on blockchain. signature=' + signature);

    return signature;
  } catch (e) {
    if (
      e &&
      e instanceof SignerError &&
      e.code === SignerErrorCode.REJECTED_BY_USER
    )
      throw e;
    if (e && (e as any).hasOwnProperty('code') && (e as any).code === 4001)
      throw new SignerError(SignerErrorCode.REJECTED_BY_USER, undefined, e);

    return getFailedHash(tx);
  }
};

export async function executeSolanaTransaction(
  tx: SolanaTransaction,
  solanaProvider: any
): Promise<string> {
  const DefaultSolanaSigner: SolanaWeb3Signer = async (
    solanaWeb3Transaction
  ) => {
    try {
      const signedTransaction = await solanaProvider.signTransaction(
        solanaWeb3Transaction
      );
      return signedTransaction.serialize();
    } catch (e) {
      // if (e && (e as any).hasOwnProperty('code') && (e as any).code === 4001)
      // throw new SignerError(SignerErrorCode  .REJECTED_BY_USER, undefined, e);
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, e);
    }
  };
  return await generalSolanaTransactionExecutor(tx, DefaultSolanaSigner);
}
