import {
  ISigner,
  SignerError,
  Transfer as TransferTransaction,
} from 'rango-types';
import { xdefiTransfer } from './helpers';
import {
  Network,
  XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
  getNetworkInstance,
} from '@rango-dev/wallets-shared';

export interface ITransferSigner extends ISigner<TransferTransaction> {}

// TODO - replace with real type
// tslint:disable-next-line: no-any
type TransferExternalSigner = any;

export class CustomTransferSigner implements ITransferSigner {
  private signer: TransferExternalSigner;
  constructor(signer: TransferExternalSigner) {
    this.signer = signer;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TransferTransaction): Promise<string> {
    const { blockchain } = tx.asset;

    // Everything except ETH
    if (!XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS.includes(blockchain as Network))
      throw new Error(
        `blockchain: ${blockchain} transfer not implemented yet.`
      );
    const transferProvider = getNetworkInstance(
      this.signer,
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
