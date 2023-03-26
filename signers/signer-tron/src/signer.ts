import {
  ISigner,
  SignerError,
  SignerErrorCode,
  TronTransaction,
} from 'rango-types';

export interface ITronSigner extends ISigner<TronTransaction> {}

// TODO - replace with real type
// tslint:disable-next-line: no-any
type TronExternalSigner = any;

export class TronSigner implements ITronSigner {
  private signer: TronExternalSigner;

  constructor(signer: TronExternalSigner) {
    this.signer = signer;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TronTransaction): Promise<string> {
    try {
      const transaction = TronSigner.buildTx(tx);
      const signedTxn = await this.signer.trx.sign(transaction);
      const receipt = await this.signer.trx.sendRawTransaction(signedTxn);
      return receipt?.transaction?.txID;
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
