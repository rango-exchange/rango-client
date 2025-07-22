import type { GenericSigner, Transfer } from 'rango-types';

import { parseErrorAndThrowStandardizeError } from '@arlert-dev/wallets-core/namespaces/common';
import { Networks } from '@arlert-dev/wallets-shared';
import * as bitcoin from 'bitcoinjs-lib';
import { SignerError } from 'rango-types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransferExternalProvider = any;

const BTC_RPC_URL = 'https://go.getblock.io/f37bad28a991436483c0a3679a3acbee';

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

    /*
     * TODO this logic should be added to queue manager rango preset, for safety we are rejecting signing process to avoid asset loss.
     * https://docs.unisat.io/dev/open-api-documentation/unisat-wallet/supported-chains
     */
    const currentChain = await this.provider.getChain();
    if (currentChain?.enum !== 'BITCOIN_MAINNET') {
      throw new Error(`Switch your network to Bitcoin to proceed swap.`);
    }

    // 1. Decode Base64 to hex
    const psbtHex = Buffer.from(psbt.unsignedPsbtBase64, 'base64').toString(
      'hex'
    );

    // 2. Build UniSat inputs
    const toSignInputs = psbt.inputsToSign.flatMap(
      ({ address, signingIndexes }) =>
        signingIndexes.map((index) => ({ index, address }))
    );

    // 3. Sign (& auto-finalize)
    const signedPsbtHex = await this.provider
      .signPsbt(psbtHex, {
        autoFinalized: true,
        toSignInputs,
      })
      .catch((e: unknown) => {
        parseErrorAndThrowStandardizeError(e);
      });

    // 4. Parse the PSBT hex and extract the raw transaction
    const psbtObject = bitcoin.Psbt.fromHex(signedPsbtHex);
    const finalPsbtBaseHex = psbtObject.extractTransaction().toHex();

    // 5. Broadcast PSBT to rpc node
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
