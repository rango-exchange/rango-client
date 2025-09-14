import type { SolanaWeb3Signer } from '@rango-dev/signer-solana';
import type { Transaction, VersionedTransaction } from '@solana/web3.js';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import { generalSolanaTransactionExecutor } from '@rango-dev/signer-solana';
import { dynamicImportWithRefinedError } from '@rango-dev/wallets-shared';
import { PublicKey } from '@solana/web3.js';
import { SignerError, SignerErrorCode } from 'rango-types';

import { getDerivationPath } from '../state.js';
import {
  getLedgerError,
  transportConnect,
  transportDisconnect,
} from '../utils.js';

export function isVersionedTransaction(
  transaction: Transaction | VersionedTransaction
): transaction is VersionedTransaction {
  return 'version' in transaction;
}

export class SolanaSigner implements GenericSigner<SolanaTransaction> {
  async signMessage(msg: string): Promise<string> {
    try {
      const transport = await transportConnect();
      const LedgerAppSolana = (
        await dynamicImportWithRefinedError(
          async () => await import('@ledgerhq/hw-app-solana')
        )
      ).default;
      const solana = new LedgerAppSolana(transport);

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
        const LedgerAppSolana = (
          await dynamicImportWithRefinedError(
            async () => await import('@ledgerhq/hw-app-solana')
          )
        ).default;
        const solana = new LedgerAppSolana(transport);

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
