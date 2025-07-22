# @arlert-dev/signer-solana

## Summary

Signer for Rango Solana Transactions

Currecntly all Rango Solana transactions are Versioned (and serialized), only Solana Wrapper is already using the legacy format. (which is used only for SOL <-> WSol routes)

## Versioned Transaction Sign Flow Overview:

1. Get connection and recent blockhash

   ```ts
   const connection = new Connection(SOLANA_RPC_URL, {
     commitment: 'confirmed',
     disableRetryOnRateLimit: false,
   });
   const latestBlock = await connection.getLatestBlockhash('confirmed');
   ```

2. Prepare the transaction

   ```ts
   const transaction = VersionedTransaction.deserialize(
     new Uint8Array(tx.serializedMessage)
   );
   transaction.message.recentBlockhash = recentBlockhash;
   ```

3. Simulate the transaction

   ```ts
   const { value } = await connection.simulateTransaction(transaction, {
     replaceRecentBlockhash: true,
     commitment: 'processed',
   });
   ```

4. Sign the transaction

   ```ts
   const signedTransaction = await solanaProvider.signTransaction(
     solanaWeb3Transaction
   );
   const serializedTransaction = Buffer.from(signedTransaction.serialize());
   ```

5. Send and confirm the transaction (similar to [jupiter suggested code](https://github.com/jup-ag/jupiter-quote-api-node/blob/main/example/utils/transactionSender.ts))

   ```ts
   const { txId, txResponse } = await transactionSenderAndConfirmationWaiter({
     connection,
     serializedTransaction,
   });
   ```
