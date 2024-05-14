import type { SolanaWeb3Signer } from '@rango-dev/signer-solana';
import type { Transaction, VersionedTransaction } from '@solana/web3.js';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import { generalSolanaTransactionExecutor } from '@rango-dev/signer-solana';
import { PublicKey } from '@solana/web3.js';
import { SignerError } from 'rango-types';

import {
  getLedgerError,
  SOLANA_BIP32_PATH,
  transportConnect,
  transportDisconnect,
} from '../helpers';

export function isVersionedTransaction(
  transaction: Transaction | VersionedTransaction
): transaction is VersionedTransaction {
  return 'version' in transaction;
}

export class SolanaSigner implements GenericSigner<SolanaTransaction> {
  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    try {
      const DefaultSolanaSigner: SolanaWeb3Signer = async (
        solanaWeb3Transaction: Transaction | VersionedTransaction
      ) => {
        const transport = await transportConnect();
        const solana = new (await import('@ledgerhq/hw-app-solana')).default(
          transport
        );

        let signResult;
        if (isVersionedTransaction(solanaWeb3Transaction)) {
          signResult = await solana.signTransaction(
            SOLANA_BIP32_PATH,
            solanaWeb3Transaction.message.serialize() as Buffer
          );
        } else {
          signResult = await solana.signTransaction(
            SOLANA_BIP32_PATH,
            solanaWeb3Transaction.serialize()
          );
        }

        const addressResult = await solana.getAddress(SOLANA_BIP32_PATH);

        const publicKey = new PublicKey(addressResult.address);

        solanaWeb3Transaction.addSignature(
          publicKey,
          Buffer.from(signResult.signature)
        );

        const serializedTx = solanaWeb3Transaction.serialize();

        return serializedTx;
      };
      const hash = await generalSolanaTransactionExecutor(
        tx,
        DefaultSolanaSigner
      );
      return { hash };
    } catch (error) {
      throw getLedgerError(error);
    } finally {
      await transportDisconnect();
    }
  }
}
