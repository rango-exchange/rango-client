import type { GenericSigner, TronTransaction } from 'rango-types';

import { SignerError, SignerErrorCode } from 'rango-types';

/** A transaction as signed by TronWeb, carrying the id it was signed under. */
type SignedTronTransaction = { txID?: string };

/**
 * The broadcast response. Wallet-injected TronWeb instances differ in where
 * they expose the transaction id, so both known shapes are optional here.
 *
 * A node that rejects the broadcast answers with `result: false` plus a `code`
 * and a hex-encoded `message` - `sendRawTransaction` resolves in that case
 * rather than throwing.
 */
type BroadcastReceipt = {
  result?: boolean;
  code?: string;
  message?: string;
  /**
   * A node-side failure, reported separately from `code` and capitalised as the
   * node sends it, e.g. `"class java.lang.NullPointerException : null"`.
   */
  Error?: string;
  txid?: string;
  transaction?: { txID?: string };
};

/** Tron hex-encodes the rejection reason; returned as-is when it is not hex. */
function decodeBroadcastMessage(message?: string): string | undefined {
  if (!message) {
    return undefined;
  }

  const hex = message.startsWith('0x') ? message.slice(2) : message;
  if (hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) {
    return message;
  }

  const bytes = hex.match(/.{2}/g)?.map((byte) => parseInt(byte, 16)) ?? [];

  return new TextDecoder().decode(new Uint8Array(bytes));
}

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
    let receipt: BroadcastReceipt | undefined;
    let signedTxn: SignedTronTransaction | undefined;

    try {
      const transaction = DefaultTronSigner.buildTx(tx);
      signedTxn = await this.provider.tronWeb.trx.sign(transaction);
      receipt = await this.provider.tronWeb.trx.sendRawTransaction(signedTxn);
    } catch (error) {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }

    /*
     * A refused broadcast resolves instead of throwing, and still carries a
     * `txid` - the id is derived from the transaction's own bytes, so it exists
     * whether or not the network accepted it. Taking that id at face value is
     * what left approvals polling a transaction no node ever had, reporting
     * "waiting for approval" until the user gave up.
     *
     * Refusals arrive in more than one shape and never set `result` to `false`
     * - it is simply absent - so success cannot be inferred from it. What they
     * do have in common is that one of the failure fields is populated:
     * `code` with a hex `message` (`TRANSACTION_EXPIRATION_ERROR`), or a
     * capitalised `Error` carrying a node-side exception.
     */
    const failure =
      receipt?.Error ??
      (receipt?.code
        ? decodeBroadcastMessage(receipt.message) ??
          `The Tron node refused the transaction (${receipt.code}).`
        : undefined);

    if (failure) {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, failure);
    }

    /*
     * Instances differ in where they put the id, and it is derived from the
     * transaction itself, so the signed transaction's own `txID` is a valid
     * last resort now that the broadcast is known to have been accepted.
     */
    const hash = receipt?.txid ?? receipt?.transaction?.txID ?? signedTxn?.txID;

    if (!hash) {
      throw new SignerError(
        SignerErrorCode.SEND_TX_ERROR,
        'Tron transaction was broadcast without a transaction hash.'
      );
    }

    return { hash };
  }
}
