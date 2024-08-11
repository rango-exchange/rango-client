import type { GenericSigner, TronTransaction } from 'rango-types';

import { SignerError, SignerErrorCode } from 'rango-types';

/*
 * TODO - replace with real type
 * tslint:disable-next-line: no-any
 */
type TronExternalProvider = any;

export class DefaultTronSigner implements GenericSigner<TronTransaction> {
  private provider: TronExternalProvider;

  constructor(provider: TronExternalProvider) {
    this.provider = provider;
  }

  static buildTx(tronTx: TronTransaction) {
    let tx = {};
    if (!!tronTx.txID) {
      tx = { ...tx, txID: tronTx.txID };
    }
    if (tronTx.visible !== undefined) {
      tx = { ...tx, visible: tronTx.visible };
    }
    if (!!tronTx.__payload__) {
      tx = { ...tx, __payload__: tronTx.__payload__ };
    }
    if (!!tronTx.raw_data) {
      tx = { ...tx, raw_data: tronTx.raw_data };
    }
    if (!!tronTx.raw_data_hex) {
      tx = { ...tx, raw_data_hex: tronTx.raw_data_hex };
    }
    return tx;
  }
  async signMessage(msg: string): Promise<string> {
    try {
      return await this.provider.tronWeb.trx.signMessageV2(msg);
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
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
}
