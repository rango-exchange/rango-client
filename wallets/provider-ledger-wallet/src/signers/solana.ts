import type { SolanaWeb3Signer } from '@rango-dev/signer-solana';
import type { GenericSigner, SolanaTransaction } from 'rango-types';

import { UserRejectedRequestError } from '@ledgerhq/ledger-wallet-provider-solana';
import { generalSolanaTransactionExecutor } from '@rango-dev/signer-solana';
import base58 from 'bs58';
import { SignerError, SignerErrorCode } from 'rango-types';

import { getSolanaWallet } from '../ledgerProvider.js';

/*
 * Keeps errors we raised ourselves, maps Ledger's rejection (thrown when the
 * user closes the modal) to `REJECTED_BY_USER`, and wraps anything else.
 */
function toSignerError(error: unknown): SignerError {
  if (error instanceof SignerError) {
    return error;
  }
  if (error instanceof UserRejectedRequestError) {
    return new SignerError(SignerErrorCode.REJECTED_BY_USER, undefined, error);
  }
  return new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
}

/*
 * Ledger only signs (`solana:signTransaction`); simulating, broadcasting and
 * confirming are left to the shared Solana executor, like other wallets.
 *
 * Ledger refreshes the blockhash after the user approves on the device (unless
 * the transaction is already partially signed), so the signed transaction it
 * returns must be broadcast as-is. The executor does that, and confirms by
 * signature status rather than by blockhash.
 */
async function executeSolanaTransaction(
  tx: SolanaTransaction
): Promise<string> {
  const ledgerSolanaSigner: SolanaWeb3Signer = async (
    solanaWeb3Transaction
  ) => {
    try {
      const wallet = getSolanaWallet();
      const [currentAccount] = wallet.accounts;

      if (!currentAccount) {
        throw new SignerError(
          SignerErrorCode.SIGN_TX_ERROR,
          'Please make sure the required account is connected properly.'
        );
      }

      if (tx.from !== currentAccount.address) {
        throw new SignerError(
          SignerErrorCode.SIGN_TX_ERROR,
          `Your connected account doesn't match with the required account. Please ensure that you are connected with the correct account and try again.`
        );
      }

      /*
       * The user's signature is still missing (the API may have attached
       * others), so skip the signature checks on legacy transactions.
       */
      const transaction =
        'version' in solanaWeb3Transaction
          ? solanaWeb3Transaction.serialize()
          : solanaWeb3Transaction.serialize({
              requireAllSignatures: false,
              verifySignatures: false,
            });

      const [signOutput] = await wallet.features[
        'solana:signTransaction'
      ].signTransaction({
        account: currentAccount,
        transaction,
      });

      return signOutput.signedTransaction;
    } catch (error) {
      throw toSignerError(error);
    }
  };

  return await generalSolanaTransactionExecutor(tx, ledgerSolanaSigner);
}

/*
 * The wallet is resolved lazily on each call, since the signer can be created
 * before Solana has registered itself (or when it isn't enabled for the dApp).
 */
export class CustomSolanaSigner implements GenericSigner<SolanaTransaction> {
  async signMessage(msg: string): Promise<string> {
    try {
      const wallet = getSolanaWallet();
      const [account] = wallet.accounts;
      const [signOutput] = await wallet.features[
        'solana:signMessage'
      ].signMessage({
        message: new TextEncoder().encode(msg),
        account,
      });
      return base58.encode(signOutput.signature);
    } catch (error) {
      throw toSignerError(error);
    }
  }

  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const hash = await executeSolanaTransaction(tx);
    return { hash };
  }
}
