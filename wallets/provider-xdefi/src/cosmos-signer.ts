import { CosmosTransaction, GenericSigner, SignerError } from 'rango-types';
import { xdefiTransfer } from './helpers';

// TODO - replace with real type
// tslint:disable-next-line: no-any
type CosmosExternalProvider = any;

export class CustomCosmosSigner implements GenericSigner<CosmosTransaction> {
  private provider: CosmosExternalProvider;
  constructor(provider: CosmosExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<string> {
    if (tx.rawTransfer === null)
      throw SignerError.AssertionFailed('rawTransfer obj can not be null');

    const from = tx.fromWalletAddress;
    const { method, memo, recipient, decimals, amount, asset } = tx.rawTransfer;
    const blockchain = tx.blockChain;
    return xdefiTransfer(
      blockchain,
      asset.ticker,
      from,
      amount,
      decimals,
      recipient,
      this.provider,
      method,
      memo
    );
  }
}
