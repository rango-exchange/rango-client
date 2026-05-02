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

    if (asset.blockchain !== LegacyNetworks.ZCASH) {
      // TODO: check should be performed on the blockchain field of transaction instead of asset, but currently it is not available in the transaction object
      throw new Error('Blockchain is not supported');
    }

    const accounts = (await getZcashAccounts()) as string[];

    if (fromWalletAddress !== accounts[0]) {
      throw new Error(
        'fromWalletAddress is not matched with the connected account'
      );
    }

    try {
      const transactionRequest = {
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

      const response = (await vultisigZcash().request(
        transactionRequest
      )) as string;
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
