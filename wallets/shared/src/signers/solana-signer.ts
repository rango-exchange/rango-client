import { Connection, PublicKey, Transaction, TransactionInstruction, VersionedTransaction,VersionedMessage } from '@solana/web3.js';
import * as Sentry from '@sentry/browser';
import { CaptureContext } from '@sentry/types';
import { SolanaTransaction, Network, IS_DEV } from '../rango';
import { getNetworkInstance } from '../providers';
import { WalletError, WalletErrorCode } from '../errors';

// Based on:
// https://docs.phantom.app/integrating/sending-a-transaction
// https://codesandbox.io/s/github/phantom-labs/sandbox
async function retryPromise<Type>(
  promise: Promise<Type>,
  count: number,
  timeoutMs: number,
  verifier: ((input: Type) => boolean) | null = null,
): Promise<Type> {
  let remained = count;
  while (remained > 0) {
    try {
      const result = (await Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs)),
      ])) as Type;
      if (remained > 1 && verifier != null && !verifier(result)) throw new Error('bad result');
      return result;
    } catch (er) {
      console.log(
        'cant get result. time=' + new Date().toLocaleTimeString() + ' i=' + remained + ' , err=',
        er,
      );
      remained--;
    }
  }
  throw new WalletError(WalletErrorCode.SEND_TX_ERROR, 'function reached max retry count');
}

function getFailedHash(tx: SolanaTransaction) {
  const random = Math.floor(Math.random() * 9000) + 1000;
  return 'failed::' + tx.identifier + '::' + random;
}

function getTxExtra(tx: SolanaTransaction, requestId: string): CaptureContext {
  return { tags: { from: tx.from, blockhash: tx.recentBlockhash, requestId: requestId } };
}

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
        const confirmResult = await getSolanaConnection().confirmTransaction(signature);
        if (!!confirmResult && !!confirmResult.value && confirmResult.value.err == null) {
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

export type SolanaSigner = (
  solanaWeb3Transaction: Transaction | VersionedTransaction | undefined,
) => Promise<number[] | Buffer | Uint8Array>;

export const generalSolanaTransactionExecutor = async (
  requestId: string,
  tx: SolanaTransaction,
  solanaSigner: SolanaSigner,
): Promise<string> => {
  const connection = getSolanaConnection();
  let versionedTransaction: VersionedTransaction | undefined = undefined 
  let transaction: Transaction | undefined = undefined;
  if (tx.serializedMessage != null) {
    if (tx.txType === 'VERSIONED') {
      const message = VersionedMessage.deserialize(new Uint8Array(tx.serializedMessage))
      message.recentBlockhash = tx.recentBlockhash
      versionedTransaction = new VersionedTransaction(message)
    } else if (tx.txType === 'LEGACY') {
      transaction = Transaction.from(Buffer.from(new Uint8Array(tx.serializedMessage)));
      transaction.feePayer = new PublicKey(tx.from);
      transaction.recentBlockhash = undefined;
    }
  } else {
    transaction = new Transaction();
    transaction.feePayer = new PublicKey(tx.from);
    transaction.recentBlockhash = tx.recentBlockhash;
    tx.instructions.forEach((instruction) => {
      transaction?.add(
        new TransactionInstruction({
          keys: instruction.keys.map((accountMeta) => ({
            pubkey: new PublicKey(accountMeta.pubkey),
            isSigner: accountMeta.isSigner,
            isWritable: accountMeta.isWritable,
          })),
          programId: new PublicKey(instruction.programId),
          data: Buffer.from(instruction.data),
        }),
      );
    });
    tx.signatures.forEach(function (signatureItem) {
      const signature = Buffer.from(new Uint8Array(signatureItem.signature));
      const publicKey = new PublicKey(signatureItem.publicKey);
      transaction?.addSignature(publicKey, signature);
    });
  }
  if (!transaction && !versionedTransaction) throw new Error('error creating transaction');
  try {
    if (!!transaction && !transaction.recentBlockhash)
      transaction.recentBlockhash = (
        await retryPromise(connection.getLatestBlockhash('confirmed'), 5, 10_000)
      ).blockhash;
    const raw = await solanaSigner(transaction || versionedTransaction);
    const signature = await retryPromise(connection.sendRawTransaction(raw), 2, 30000);
    if (!signature) throw new Error('tx cant send to blockchain. signature=' + signature);
    const confirmed = await confirmTx(signature);
    if (!confirmed) throw new Error('tx cant confirm on blockchain. signature=' + signature);
    try {
      Sentry.captureMessage('SolanaStat Success', getTxExtra(tx, requestId));
    } catch (ee) {
      console.log(ee);
    }
    return signature;
  } catch (e) {
    if (e && e instanceof WalletError && e.code === WalletErrorCode.REJECTED_BY_USER) throw e;
    // eslint-disable-next-line no-prototype-builtins, @typescript-eslint/no-explicit-any
    if (e && (e as any).hasOwnProperty('code') && (e as any).code === 4001)
      throw new WalletError(WalletErrorCode.REJECTED_BY_USER, undefined, e);
    try {
      Sentry.captureMessage('SolanaStat Fail', getTxExtra(tx, requestId));
      Sentry.captureException(e, getTxExtra(tx, requestId));
    } catch (ee) {
      console.log(ee);
    }
    return getFailedHash(tx);
  }
};

export async function executeSolanaTransaction(
  tx: SolanaTransaction,
  requestId: string,
  provider: any,
): Promise<string> {
  const solProvider = getNetworkInstance(provider, Network.SOLANA);
  const solanaSigner: SolanaSigner = async (solanaWeb3Transaction) => {
    try {
      const signedTransaction = await solProvider.signTransaction(solanaWeb3Transaction);
      return signedTransaction.serialize();
    } catch (e) {
      // if (e && (e as any).hasOwnProperty('code') && (e as any).code === 4001)
      // throw new WalletError(WalletErrorCode.REJECTED_BY_USER, undefined, e);

      throw new WalletError(WalletErrorCode.SIGN_TX_ERROR, undefined, e);
    }
  };
  return await generalSolanaTransactionExecutor(requestId, tx, solanaSigner);
}
