import type { SolanaTransaction } from 'rango-types';

import {
  PublicKey,
  Transaction,
  TransactionInstruction,
  VersionedTransaction,
} from '@solana/web3.js';

export const prepareTransaction = (
  tx: SolanaTransaction,
  recentBlockhash: string
): Transaction | VersionedTransaction => {
  if (tx.txType === 'VERSIONED') {
    return prepareVersionedTransaction(tx, recentBlockhash);
  }

  return prepareLegacyTransaction(tx, recentBlockhash);
};

export function prepareVersionedTransaction(
  tx: SolanaTransaction,
  recentBlockhash: string
): VersionedTransaction {
  const versionedTransaction = VersionedTransaction.deserialize(
    new Uint8Array(tx.serializedMessage || [])
  );
  /*
   * We shouldn't override the recent blockhash provided by the API
   * Otherwise, the transaction will become invalid if partially signed by the API
   */
  versionedTransaction.message.recentBlockhash =
    tx.recentBlockhash || recentBlockhash;

  tx.signatures.forEach(({ publicKey, signature }) => {
    versionedTransaction.addSignature(
      new PublicKey(publicKey),
      new Uint8Array(signature)
    );
  });

  return versionedTransaction;
}

export function prepareLegacyTransaction(
  tx: SolanaTransaction,
  recentBlockhash: string
): Transaction {
  const transaction = new Transaction({
    feePayer: new PublicKey(tx.from),
    recentBlockhash: tx.recentBlockhash || recentBlockhash,
  });

  tx.instructions.forEach(({ keys, programId, data }) => {
    const instruction = new TransactionInstruction({
      keys: keys.map(({ pubkey, isSigner, isWritable }) => ({
        pubkey: new PublicKey(pubkey),
        isSigner,
        isWritable,
      })),
      programId: new PublicKey(programId),
      data: Buffer.from(data),
    });
    transaction.add(instruction);
  });

  tx.signatures.forEach(({ publicKey, signature }) => {
    transaction.addSignature(
      new PublicKey(publicKey),
      Buffer.from(new Uint8Array(signature))
    );
  });

  return transaction;
}
