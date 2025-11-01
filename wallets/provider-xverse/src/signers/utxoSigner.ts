import type { ProviderAPI } from '@rango-dev/wallets-core/namespaces/utxo';
import type { GenericSigner, Transfer } from 'rango-types';

import { Networks } from '@rango-dev/wallets-shared';
import { SignerError } from 'rango-types';

export class BTCSigner implements GenericSigner<Transfer> {
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

    // 2. Build sign inputs
    const signInputs: Record<string, number[]> = {};

    psbt.inputsToSign.forEach(({ address, signingIndexes }) => {
      signInputs[address] = signingIndexes;
    });

    // 3. Sign (& broadcast)
    const signPsbtResult = await this.provider.request('signPsbt', {
      psbt: psbt.unsignedPsbtBase64,
      signInputs,
      broadcast: true,
    });

    if (signPsbtResult?.error) {
      throw new Error(
        signPsbtResult.error.message || 'Error during transaction sign'
      );
    }
    if (!signPsbtResult?.result?.txid) {
      throw new Error('Transaction not found!');
    }

    return { hash: signPsbtResult.result.txid };
  }
}
