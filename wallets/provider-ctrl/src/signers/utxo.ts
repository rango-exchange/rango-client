import type { Provider, ProviderObject } from '../types.js';
import type { ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';
import type { GenericSigner, Transfer } from 'rango-types';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { SignerError, SignerErrorCode } from 'rango-types';

import { SUPPORTED_UTXO_CHAINS } from '../constants.js';

interface CtrlTransferParams {
  asset: { chain: string; symbol: string; ticker: string };
  from: string;
  amount: { amount: string; decimals: number };
  memo?: string;
  recipient?: string;
}

/** Callback-style transfer for non-PSBT UTXO chains (LTC/DOGE/BCH). */
async function ctrlTransfer(
  blockchain: string,
  ticker: string,
  from: string,
  amount: string,
  decimals: number,
  recipientAddress: string | null,
  provider: UtxoProviderApi,
  method: string,
  memo?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const params: CtrlTransferParams = {
      asset: { chain: blockchain, symbol: ticker, ticker },
      from,
      amount: { amount, decimals },
      memo,
    };
    if (recipientAddress) {
      params.recipient = recipientAddress;
    }

    provider.request(
      { method, params: [params] },
      (error: unknown, result: unknown) => {
        if (error) {
          reject(
            new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error)
          );
        } else {
          resolve(result as string);
        }
      }
    );
  });
}

/**
 * One signer for all of Ctrl's UTXO chains. BTC is signed via PSBT (`sign_psbt`);
 * LTC/DOGE/BCH use the generic `transfer` request. It receives the whole provider
 * map and resolves the right per-chain instance per transaction.
 */
export class CustomTransferSigner implements GenericSigner<Transfer> {
  private provider: Provider;
  constructor(provider: Provider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const { blockchain } = tx.asset;

    if (!SUPPORTED_UTXO_CHAINS.includes(blockchain)) {
      throw new Error(
        `blockchain: ${blockchain} transfer not implemented yet.`
      );
    }

    if (blockchain === LegacyNetworks.BTC) {
      return this.#signPsbt(tx);
    }

    return this.#signTransferObject(tx);
  }

  // https://developers.ctrl.xyz/developers/extension-bitcoin#sign-psbt-partially-signed-bitcoin-transaction
  async #signPsbt(tx: Transfer): Promise<{ hash: string }> {
    const { asset, psbt } = tx;

    if (!psbt) {
      throw new Error(
        'No PSBT found to sign. Ensure a valid PSBT is provided.'
      );
    }

    const provider = this.provider.get(
      asset.blockchain as keyof ProviderObject
    ) as UtxoProviderApi;

    const signInputs: { [key: string]: number[] } = {};
    psbt.inputsToSign.forEach((input) => {
      signInputs[input.address] = input.signingIndexes;
    });

    const response = await provider
      .request({
        method: 'sign_psbt',
        /*
         * Ctrl expects `params` as an array (same as its other RPCs); passing a bare
         * object makes the extension read `psbt` off `undefined`. The docs showing a
         * plain object are wrong.
         */
        params: [
          {
            psbt: psbt.unsignedPsbtBase64,
            signInputs,
            allowedSignHash: 1,
            broadcast: true,
          },
        ],
      })
      .catch((error: unknown) => {
        throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
      });

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

    const transferProvider = this.provider.get(
      blockchain as keyof ProviderObject
    ) as UtxoProviderApi;

    const {
      method,
      memo,
      recipientAddress,
      decimals,
      amount,
      fromWalletAddress: from,
      asset,
    } = tx;

    const hash = await ctrlTransfer(
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
