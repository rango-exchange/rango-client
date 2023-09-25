import type { Networks } from '@rango-dev/wallets-shared';
import type { GenericSigner, Transfer } from 'rango-types';

import { getNetworkInstance } from '@rango-dev/wallets-shared';
import { SignerError } from 'rango-types';

import { SUPPORTED_NATIVE_CHAINS } from './constants';
import { xdefiTransfer } from './helpers';

/*
 * TODO - replace with real type
 * tslint:disable-next-line: no-any
 */
type TransferExternalProvider = any;

export class CustomTransferSigner implements GenericSigner<Transfer> {
  private provider: TransferExternalProvider;
  constructor(provider: TransferExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const { blockchain } = tx.asset;

    // Everything except ETH
    if (!SUPPORTED_NATIVE_CHAINS.includes(blockchain as Networks)) {
      throw new Error(
        `blockchain: ${blockchain} transfer not implemented yet.`
      );
    }
    const transferProvider = getNetworkInstance(this.provider, blockchain);

    const {
      method,
      memo,
      recipientAddress,
      decimals,
      amount,
      fromWalletAddress: from,
      asset,
    } = tx;

    const hash = await xdefiTransfer(
      blockchain,
      asset.ticker,
      from,
      amount,
      decimals,
      recipientAddress,
      transferProvider,
      method,
      memo
    );
    return { hash };
  }
}
