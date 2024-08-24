import type { Transaction, VersionedTransaction } from '@solana/web3.js';
import type { SolanaTransaction } from 'rango-types';

export const prepareTransaction = async (
  tx: SolanaTransaction,
  recentBlockhash: string
): Promise<Transaction | VersionedTransaction> => {
  const { VersionedTransaction } = await import('@solana/web3.js');

  let versionedTransaction: VersionedTransaction | undefined = undefined;
  let legacyTransaction: Transaction | undefined = undefined;

  if (tx.txType === 'VERSIONED' && !!tx.serializedMessage) {
    versionedTransaction = VersionedTransaction.deserialize(
      new Uint8Array(tx.serializedMessage)
    );
    versionedTransaction.message.recentBlockhash = recentBlockhash;
  } else {
    legacyTransaction = await prepareLegacyTransaction(tx, recentBlockhash);
  }
  const finalTx = versionedTransaction || legacyTransaction;

  if (!finalTx) {
    throw new Error('Error building transaction');
  }
  return finalTx;
};

export async function prepareLegacyTransaction(
  tx: SolanaTransaction,
  recentBlockhash: string
): Promise<Transaction> {
  const { Transaction, TransactionInstruction, PublicKey } = await import(
    '@solana/web3.js'
  );

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
