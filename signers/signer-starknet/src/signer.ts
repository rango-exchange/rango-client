import {
  GenericSigner,
  SignerError,
  SignerErrorCode,
  StarknetTransaction,
} from 'rango-types';

export interface StarknetSigner extends GenericSigner<StarknetTransaction> {}

// TODO - replace with real type
// tslint:disable-next-line: no-any
type StarknetExternalProvider = any;

export class DefaultStarknetSigner implements StarknetSigner {
  private provider: StarknetExternalProvider;

  constructor(provider: StarknetExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: StarknetTransaction): Promise<string> {
    try {
      const { transaction_hash } = await this.provider.account.execute(
        tx.calls
      );
      return transaction_hash;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }
}
