import type { GenericSigner, Transfer } from 'rango-types';

import * as secp256k1 from '@bitcoinerlab/secp256k1';
import { Networks } from '@rango-dev/wallets-shared';
import * as bitcoin from 'bitcoinjs-lib';
import { SignerError } from 'rango-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransferExternalProvider = any;

const BTC_RPC_URL = 'https://go.getblock.io/f37bad28a991436483c0a3679a3acbee';

// TODO: use Uint8Array.fromBase64() static method and use this function as a polyfill after updating TypeScript DOM lib
function base64ToUint8Array(base64String: string) {
  const binaryString = atob(base64String);
  const length = binaryString.length;
  const uint8Array = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return uint8Array;
}

export class BTCSigner implements GenericSigner<Transfer> {
  private provider: TransferExternalProvider;
  constructor(provider: TransferExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    const { asset, psbt } = tx;

    if (!psbt) {
      throw new Error(
        'No PSBT found to sign. Ensure a valid PSBT is provided.'
      );
    }

    if (asset.blockchain !== Networks.BTC) {
      throw new Error(
        `Signing ${asset.blockchain} transaction is not implemented by the signer.`
      );
    }
    // Initialize ECC library
    bitcoin.initEccLib(secp256k1);

    const signedPSBTBytes = await this.provider.signPSBT(
      base64ToUint8Array(psbt.unsignedPsbtBase64),
      {
        inputsToSign: psbt.inputsToSign,
      }
    );

    // Finalize PSBT
    const finalPsbt = bitcoin.Psbt.fromBuffer(Buffer.from(signedPSBTBytes));
    finalPsbt.finalizeAllInputs();

    const finalPsbtBaseHex = finalPsbt.extractTransaction().toHex();

    // Broadcast PSBT to rpc node
    const response = await fetch(BTC_RPC_URL, {
      method: 'POST',
      body: JSON.stringify({
        method: 'sendrawtransaction',
        params: [finalPsbtBaseHex],
      }),
    });

    if (!response.ok) {
      // Handle network and fetch errors
      const errorText = await response.text();
      throw new Error(`Error broadcasting transaction: ${errorText}`);
    }

    const data = await response.json();

    if (!data.result) {
      // Handle Bitcoin specific errors
      throw new Error(
        `Error broadcasting transaction. Error Code ${data.error.code}: ${data.error.message}`
      );
    }

    return { hash: data.result };
  }
}
