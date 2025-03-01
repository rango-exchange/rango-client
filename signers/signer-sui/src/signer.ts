import type { GenericSigner } from 'rango-types';
import type { MoveTransaction } from 'rango-types/mainApi';

import { Transaction } from '@mysten/sui/transactions';
import {
  SUI_MAINNET_CHAIN,
  type SuiFeatures,
  type WalletWithFeatures,
} from '@mysten/wallet-standard';
import { SignerError } from 'rango-types';

export type SuiWalletStandard = WalletWithFeatures<SuiFeatures>;

export class DefaultSuiSigner implements GenericSigner<MoveTransaction> {
  private provider: SuiWalletStandard;

  constructor(provider: SuiWalletStandard) {
    this.provider = provider;
  }

  public async signMessage(): Promise<string> {
    /*
     * TODO: Can be implemented by sui:signPersonalMessage feature.
     * @see https://docs.sui.io/standards/wallet-standard#implementing-features
     */
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: MoveTransaction): Promise<{ hash: string }> {
    const transaction = Transaction.from(tx.transactionData);

    // TODO: Double check with team to ensure this assumption is correct
    const senderAddress = transaction.getData().sender;
    if (!senderAddress) {
      throw new Error('Your transaction should includes a Sender.');
    }

    const account = this.provider.accounts.find(
      (account) => account.address === senderAddress
    );

    if (!account) {
      throw new Error(
        'Your current address on wallet is not matched with what has been set in transaction.'
      );
    }

    const signed = await this.provider.features[
      'sui:signAndExecuteTransaction'
    ].signAndExecuteTransaction({
      account,
      transaction,
      chain: SUI_MAINNET_CHAIN,
    });

    return {
      hash: signed.digest,
    };
  }
}
