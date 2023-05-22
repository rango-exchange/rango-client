import {
  GenericSigner,
  SignerError,
  SignerErrorCode,
  TronTransaction,
} from 'rango-types';

// TODO - replace with real type
// tslint:disable-next-line: no-any
type TronExternalProvider = any;

export class DefaultTronSigner implements GenericSigner<TronTransaction> {
  private provider: TronExternalProvider;

  constructor(provider: TronExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TronTransaction): Promise<{ hash: string }> {
    try {
      const transaction = DefaultTronSigner.buildTx(tx);
      const signedTxn = await this.provider.tronWeb.trx.sign(transaction);
      const receipt = await this.provider.tronWeb.trx.sendRawTransaction(
        signedTxn
      );
      const hash = receipt?.transaction?.txID;
      return { hash };
    } catch (error) {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }

  static buildTx(tronTx: TronTransaction) {
    let tx = {};
    if (!!tronTx.txID) tx = { ...tx, txID: tronTx.txID };
    if (tronTx.visible !== undefined) tx = { ...tx, visible: tronTx.visible };
    if (!!tronTx.__payload__) tx = { ...tx, __payload__: tronTx.__payload__ };
    if (!!tronTx.raw_data) tx = { ...tx, raw_data: tronTx.raw_data };
    if (!!tronTx.raw_data_hex)
      tx = { ...tx, raw_data_hex: tronTx.raw_data_hex };
    return tx;
  }
}
