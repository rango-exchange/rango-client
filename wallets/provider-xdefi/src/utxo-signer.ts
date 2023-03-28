import { GenericSigner, SignerError, Transfer } from 'rango-types';
import { xdefiTransfer } from './helpers';
import {
  Network,
  XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
  getNetworkInstance,
} from '@rango-dev/wallets-shared';

// TODO - replace with real type
// tslint:disable-next-line: no-any
type TransferExternalProvider = any;

export class CustomTransferSigner implements GenericSigner<Transfer> {
  private provider: TransferExternalProvider;
  constructor(provider: TransferExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<string> {
    const { blockchain } = tx.asset;

    // Everything except ETH
    if (!XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS.includes(blockchain as Network))
      throw new Error(
        `blockchain: ${blockchain} transfer not implemented yet.`
      );
    const transferProvider = getNetworkInstance(
      this.provider,
      blockchain as Network
    );

    const {
      method,
      memo,
      recipientAddress,
      decimals,
      amount,
      fromWalletAddress: from,
      asset,
    } = tx;

    return xdefiTransfer(
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
  }
}
