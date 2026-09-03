import type { GenericSigner, TronTransaction } from 'rango-types';

import { SignerError, SignerErrorCode } from 'rango-types';

/** A transaction as signed by TronWeb, carrying the id it was signed under. */
type SignedTronTransaction = { txID?: string };

/**
 * The broadcast response. Wallet-injected TronWeb instances differ in where
 * they expose the transaction id, so both known shapes are optional here.
 */
type BroadcastReceipt = {
  txid?: string;
  transaction?: { txID?: string };
};

/**
 * The TronWeb surface this signer calls. `tronweb` is not a dependency of this
 * package (the wallet injects its own instance), so only the methods used here
 * are typed rather than pulling in the package's declarations.
 */
type TronExternalProvider = {
  tronWeb: {
    trx: {
      signMessageV2: (message: string) => Promise<string>;
      sign: (transaction: object) => Promise<SignedTronTransaction>;
      sendRawTransaction: (
        signedTransaction: SignedTronTransaction
      ) => Promise<BroadcastReceipt>;
    };
  };
};

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
    let hash: string | undefined;

    try {
      const transaction = DefaultTronSigner.buildTx(tx);
      const signedTxn = await this.provider.tronWeb.trx.sign(transaction);
      const receipt = await this.provider.tronWeb.trx.sendRawTransaction(
        signedTxn
      );
      /*
       * Wallet-injected TronWeb instances are inconsistent about the broadcast
       * response: some return `{ result, txid }`, others nest the signed tx
       * under `transaction`. Falling back to the signed transaction's own
       * `txID` keeps the hash we poll for status in sync with what was actually
       * broadcast - an undefined hash leaves the transaction stuck on "waiting
       * for approval" forever, since no status lookup can ever resolve it.
       */
      hash = receipt?.txid ?? receipt?.transaction?.txID ?? signedTxn?.txID;
    } catch (error) {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }

    if (!hash) {
      throw new SignerError(
        SignerErrorCode.SEND_TX_ERROR,
        'Tron transaction was broadcast without a transaction hash.'
      );
    }

    return { hash };
  }
}
