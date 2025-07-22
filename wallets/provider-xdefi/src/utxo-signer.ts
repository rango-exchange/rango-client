import type { GenericSigner, Transfer } from 'rango-types';

import {
  getNetworkInstance,
  Networks,
  XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
} from '@arlert-dev/wallets-shared';
import { SignerError, SignerErrorCode } from 'rango-types';

import { xdefiTransfer } from './helpers.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransferExternalProvider = any;

export class CustomTransferSigner implements GenericSigner<Transfer> {
  private provider: TransferExternalProvider;
  constructor(provider: TransferExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const { blockchain } = tx.asset;

    // Everything except ETH
    if (
      !XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS.includes(blockchain as Networks)
    ) {
      throw new Error(
        `blockchain: ${blockchain} transfer not implemented yet.`
      );
    }

    if (blockchain === Networks.BTC) {
      return await this.#signPsbt(tx);
    }

    return await this.#signTransferObject(tx);
  }

  // Interface for PSBT: https://developers.ctrl.xyz/developers/extension-bitcoin#sign-psbt-partially-signed-bitcoin-transaction
  async #signPsbt(tx: Transfer): Promise<{ hash: string }> {
    const { asset, psbt } = tx;

    if (!psbt) {
      throw new Error(
        'No PSBT found to sign. Ensure a valid PSBT is provided.'
      );
    }

    const provider = getNetworkInstance(this.provider, asset.blockchain);

    const signInputs: { [key: string]: number[] } = {};
    psbt.inputsToSign.forEach((input) => {
      signInputs[input.address] = input.signingIndexes;
    });

    const response = await provider
      .request({
        method: 'sign_psbt',
        params: {
          psbt: psbt.unsignedPsbtBase64,
          signInputs,
          allowedSignHash: 1,
          broadcast: true,
        },
      })
      .catch((error: unknown) => {
        throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
      });

    /*
     * `status` is useful for callback style (e.g. `(err, res) => void`) form of `xfi.request`.
     * here we are using the promise interface, so it should be always `success` when reach here.
     *
     * just for ensuring unexpected behaviors will be handled, we can keep this.
     *
     * @see https://docs.xverse.app/sats-connect/wallet-methods/request-methods#response-format-and-error-handling
     */
    if (response.status === 'success') {
      return { hash: response.result.txId };
    }

    throw new Error(
      'The operation (sign and broadcast) failed on your wallet.',
      { cause: response }
    );
  }

  async #signTransferObject(tx: Transfer): Promise<{ hash: string }> {
    const { blockchain } = tx.asset;

    const transferProvider = getNetworkInstance(this.provider, blockchain);

    const {
      method,
      memo,
      recipientAddress,
      decimals,
      amount,
      fromWalletAddress: from,
      asset,
    } = tx;

    const hash = await xdefiTransfer(
      blockchain,
      asset.ticker,
      from,
      amount,
      decimals,
      recipientAddress,
      transferProvider,
      method,
      memo ?? undefined
    );
    return { hash };
  }
}
