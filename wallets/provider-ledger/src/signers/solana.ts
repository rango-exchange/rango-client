import type { SolanaWeb3Signer } from '@arlert-dev/signer-solana';
import type { Transaction, VersionedTransaction } from '@solana/web3.js';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import Solana from '@ledgerhq/hw-app-solana';
import { generalSolanaTransactionExecutor } from '@arlert-dev/signer-solana';
import { PublicKey } from '@solana/web3.js';
import { SignerError, SignerErrorCode } from 'rango-types';

import {
  getLedgerError,
  transportConnect,
  transportDisconnect,
} from '../helpers.js';
import { getDerivationPath } from '../state.js';

export function isVersionedTransaction(
  transaction: Transaction | VersionedTransaction
): transaction is VersionedTransaction {
  return 'version' in transaction;
}

export class SolanaSigner implements GenericSigner<SolanaTransaction> {
  async signMessage(msg: string): Promise<string> {
    try {
      const transport = await transportConnect();

      const solana = new Solana(transport);

      const result = await solana.signOffchainMessage(
        getDerivationPath(),
        Buffer.from(msg)
      );
      return result.signature.toString();
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    try {
      const DefaultSolanaSigner: SolanaWeb3Signer = async (
        solanaWeb3Transaction: Transaction | VersionedTransaction
      ) => {
        const transport = await transportConnect();
        const solana = new Solana(transport);

        let signResult;
        if (isVersionedTransaction(solanaWeb3Transaction)) {
          signResult = await solana.signTransaction(
            getDerivationPath(),
            solanaWeb3Transaction.message.serialize() as Buffer
          );
        } else {
          signResult = await solana.signTransaction(
            getDerivationPath(),
            solanaWeb3Transaction.serialize()
          );
        }

        const addressResult = await solana.getAddress(getDerivationPath());

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
