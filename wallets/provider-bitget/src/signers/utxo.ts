import type { ProviderAPI } from '@hub3js/bip122';
import type { GenericSigner, Transfer } from 'rango-types';

import { isBitcoinBlockchain } from '@rango-dev/internal-blockchains';
import * as bitcoin from 'bitcoinjs-lib';
import { SignerError } from 'rango-types';

const BTC_RPC_URL = 'https://go.getblock.io/f37bad28a991436483c0a3679a3acbee';

export class BitgetUTXOSigner implements GenericSigner<Transfer> {
  private provider: ProviderAPI;
  constructor(provider: ProviderAPI) {
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

    if (!isBitcoinBlockchain(asset.blockchain)) {
      throw new Error(
        `Signing ${asset.blockchain} transaction is not implemented by the signer.`
      );
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
    let signedPsbtHex: string;
    try {
      signedPsbtHex = await this.provider.signPsbt(psbtHex, {
        autoFinalized: true,
        toSignInputs,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error?.message || 'Error during signing transaction');
    }

    // 4. Parse the PSBT hex and extract the raw transaction
    const psbtObject = bitcoin.Psbt.fromHex(signedPsbtHex);
    const finalPsbtBaseHex = psbtObject.extractTransaction().toHex();

    /*
     * 5. Broadcast the raw transaction to the rpc node.
     * Broadcasting through Bitget's `pushPsbt` fails, so we submit the raw
     * transaction ourselves, the same way the UniSat signer does.
     */
    const response = await fetch(BTC_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
