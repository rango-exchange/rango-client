import type { UtxoCaipChainId } from '../constants.js';
import type { Provider, UtxoProvider } from '../types.js';
import type { GenericSigner, Transfer } from 'rango-types';

import { UTXO_NAMESPACE } from '@hub3js/namespaces';
import { type ProviderAPI as UtxoProviderApi } from '@rango-dev/wallets-core/namespaces/utxo';
import {
  CAIP_CHAINS,
  convertBlockchainMetaToCaip,
} from '@rango-dev/wallets-shared';
import { SignerError, SignerErrorCode, TransactionType } from 'rango-types';

import { isUtxoCaipChainId } from '../constants.js';

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
 * Resolve the per-chain Ctrl instance for an already-narrowed CAIP-2 chain id.
 * `blockchain` is only used for the error message, since a Rango name is what a user
 * recognises.
 */
function getUtxoProvider(
  provider: Provider,
  blockchain: string,
  caipChainId: UtxoCaipChainId
): UtxoProviderApi {
  const utxoInstances = provider.get(UTXO_NAMESPACE) as
    | UtxoProvider
    | undefined;
  const instance = utxoInstances?.get(caipChainId);

  if (!instance) {
    throw new Error(
      `Ctrl UTXO provider for ${blockchain} is not available. Please check your wallet.`
    );
  }

  return instance;
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

    const caipChainId = convertBlockchainMetaToCaip({
      type: TransactionType.TRANSFER,
      chainId: null,
      name: blockchain,
    });

    if (!caipChainId) {
      throw new Error(
        `Invalid blockchain: ${blockchain}. Please check your wallet.`
      );
    }

    if (!isUtxoCaipChainId(caipChainId)) {
      throw new Error(
        `blockchain: ${blockchain} transfer not implemented yet.`
      );
    }

    if (caipChainId === CAIP_CHAINS.BITCOIN) {
      return this.#signPsbt(tx, caipChainId);
    }

    return this.#signTransferObject(tx, caipChainId);
  }

  // https://developers.ctrl.xyz/developers/extension-bitcoin#sign-psbt-partially-signed-bitcoin-transaction
  async #signPsbt(
    tx: Transfer,
    caipChainId: UtxoCaipChainId
  ): Promise<{ hash: string }> {
    const { psbt, asset } = tx;

    if (!psbt) {
      throw new Error(
        'No PSBT found to sign. Ensure a valid PSBT is provided.'
      );
    }

    const provider = getUtxoProvider(
      this.provider,
      asset.blockchain,
      caipChainId
    );

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

  async #signTransferObject(
    tx: Transfer,
    caipChainId: UtxoCaipChainId
  ): Promise<{ hash: string }> {
    const { blockchain } = tx.asset;

    const transferProvider = getUtxoProvider(
      this.provider,
      blockchain,
      caipChainId
    );

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
