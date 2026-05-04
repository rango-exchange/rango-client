import type { SendTransactionArgs } from '../../types.js';
import type { Transfer } from 'rango-types/mainApi';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { type GenericSigner, SignerError, SignerErrorCode } from 'rango-types';

import { vultisigZcash } from '../../utils.js';

import { getZcashAccounts } from './helpers.js';

export class Signer implements GenericSigner<Transfer> {
  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const { memo, fromWalletAddress, recipientAddress, amount, asset } = tx;

    // TODO: check should be performed on the blockchain field of transaction instead of asset, but currently it is not available in the transaction object
    if (asset.blockchain !== LegacyNetworks.ZCASH) {
      throw new Error(`You can not sign ${tx.blockChain} using ZCash signer.`);
    }

    const accounts = await getZcashAccounts();

    if (fromWalletAddress !== accounts[0]) {
      throw new Error(
        'fromWalletAddress is not matched with the connected account'
      );
    }

    try {
      const transactionRequest: SendTransactionArgs = {
        method: 'send_transaction',
        params: [
          {
            from: fromWalletAddress,
            to: recipientAddress,
            value: amount,
            memo,
          },
        ],
      };

      const response = await vultisigZcash().request(transactionRequest);
      return { hash: response };
    } catch (error) {
      if (typeof error === 'string') {
        throw new SignerError(
          SignerErrorCode.UNEXPECTED_BEHAVIOUR,
          error,
          undefined
        );
      }
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }
}
