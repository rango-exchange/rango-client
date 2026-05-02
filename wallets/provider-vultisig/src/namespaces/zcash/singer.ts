import type { Transfer } from 'rango-types/mainApi';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { type GenericSigner, SignerError } from 'rango-types';

import { vultisigZcash } from '../../utils.js';

import { getZcashAccounts } from './helpers.js';

export class Signer implements GenericSigner<Transfer> {
  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const { memo, fromWalletAddress, recipientAddress, amount, blockChain } =
      tx;

    if (blockChain !== LegacyNetworks.ZCASH) {
      throw new Error('Blockchain is not supported');
    }

    const accounts = (await getZcashAccounts()) as string[];

    if (fromWalletAddress !== accounts[0]) {
      throw new Error(
        'fromWalletAddress is not matched with the connected account'
      );
    }

    const response = await vultisigZcash().request({
      method: 'send_transaction',
      params: [
        {
          from: fromWalletAddress,
          to: recipientAddress,
          amount,
          memo,
        },
      ],
    });

    if (!response || typeof response !== 'string') {
      throw new Error('Invalid response');
    } else {
      return { hash: response };
    }
  }
}
