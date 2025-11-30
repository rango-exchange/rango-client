import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/utxo';
import type { GenericSigner, Transfer } from 'rango-types';

import { Networks } from '@rango-dev/wallets-shared';
import { SignerError } from 'rango-types';

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

    if (asset.blockchain !== Networks.BTC) {
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

    try {
      // 3. Sign (& auto-finalize)
      const signedPsbtHex = await this.provider.signPsbt(psbtHex, {
        autoFinalized: true,
        toSignInputs,
      });

      // 4. Push signed psbt
      const transactionHash = await this.provider.pushPsbt(signedPsbtHex);

      return { hash: transactionHash };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error?.message || 'Error during signing transaction');
    }
  }
}
