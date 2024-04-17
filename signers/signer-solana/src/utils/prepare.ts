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
  let versionedTransaction: VersionedTransaction | undefined = undefined;
  let legacyTransaction: Transaction | undefined = undefined;

  if (tx.txType === 'VERSIONED' && !!tx.serializedMessage) {
    versionedTransaction = VersionedTransaction.deserialize(
      new Uint8Array(tx.serializedMessage)
    );
    versionedTransaction.message.recentBlockhash = recentBlockhash;
  } else {
    legacyTransaction = prepareLegacyTransaction(tx, recentBlockhash);
  }
  const finalTx = versionedTransaction || legacyTransaction;

  if (!finalTx) {
    throw new Error('Error building transaction');
  }
  return finalTx;
};

export function prepareLegacyTransaction(
  tx: SolanaTransaction,
  recentBlockhash: string
): Transaction {
  const transaction = new Transaction();
  transaction.feePayer = new PublicKey(tx.from);
  transaction.recentBlockhash =
    tx.recentBlockhash || recentBlockhash || undefined;
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
      })
    );
  });
  tx.signatures.forEach(function (signatureItem) {
    const signature = Buffer.from(new Uint8Array(signatureItem.signature));
    const publicKey = new PublicKey(signatureItem.publicKey);
    transaction?.addSignature(publicKey, signature);
  });

  return transaction;
}
