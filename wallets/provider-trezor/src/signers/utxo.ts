import type { GenericSigner, Transfer } from 'rango-types';

import { Networks } from '@rango-dev/wallets-shared';
import { SignerError } from 'rango-types';

import { getBitcoinDerivationPath } from '../state.js';
import { getTrezorModule } from '../utils.js';
import { BITCOIN_COIN_NAME } from '../utxo/config.js';
import { buildTrezorBitcoinTransaction } from '../utxo/psbt.js';

function getTrezorErrorMessage(payload: { error: string; code?: string }) {
  return new Error(
    payload.code ? `${payload.error} (${payload.code})` : payload.error
  );
}

export class BTCSigner implements GenericSigner<Transfer> {
  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const { blockchain } = tx.asset;
    if (blockchain !== Networks.BTC) {
      throw new Error(
        `Signing ${blockchain} transactions is not supported by Trezor.`
      );
    }

    const { psbt } = tx;
    if (!psbt) {
      throw new Error(
        'No PSBT found to sign. Ensure a valid PSBT is provided.'
      );
    }

    const path = getBitcoinDerivationPath();
    if (!path) {
      throw new Error(
        'No connected Bitcoin account found. Please connect the wallet first.'
      );
    }

    const TrezorConnect = await getTrezorModule();
    const { inputs, outputs, version, locktime } =
      buildTrezorBitcoinTransaction(psbt.unsignedPsbtBase64, path);

    // `push: true` signs and broadcasts via Trezor's Blockbook backend.
    const result = await TrezorConnect.signTransaction({
      coin: BITCOIN_COIN_NAME,
      inputs,
      outputs,
      version,
      locktime,
      push: true,
    });

    if (!result.success) {
      throw getTrezorErrorMessage(result.payload);
    }

    return { hash: await this.#resolveHash(result.payload) };
  }

  /**
   * `push: true` usually returns the txid directly. If it isn't present (older
   * firmware/connect), push the serialized transaction explicitly as a fallback.
   */
  async #resolveHash(payload: {
    txid?: string;
    serializedTx?: string;
  }): Promise<string> {
    if (payload.txid) {
      return payload.txid;
    }
    if (!payload.serializedTx) {
      throw new Error('Trezor did not return a transaction id.');
    }

    const TrezorConnect = await getTrezorModule();
    const pushResult = await TrezorConnect.pushTransaction({
      tx: payload.serializedTx,
      coin: BITCOIN_COIN_NAME,
    });
    if (!pushResult.success) {
      throw getTrezorErrorMessage(pushResult.payload);
    }
    return pushResult.payload.txid;
  }
}
