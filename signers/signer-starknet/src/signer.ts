import {
  ISigner,
  SignerError,
  SignerErrorCode,
  StarknetTransaction,
} from 'rango-types';

export interface IStarknetSigner extends ISigner<StarknetTransaction> {}

// TODO - replace with real type
// tslint:disable-next-line: no-any
type StarknetExternalSigner = any;

export class StarknetSigner implements IStarknetSigner {
  private signer: StarknetExternalSigner;

  constructor(signer: StarknetExternalSigner) {
    this.signer = signer;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: StarknetTransaction): Promise<string> {
    try {
      const { transaction_hash } = await this.signer.account.execute(tx.calls);
      return transaction_hash;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }
}
