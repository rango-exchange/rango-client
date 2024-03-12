import type { GenericSigner, Transfer } from 'rango-types';

import { SignerError } from 'rango-types';

type TransferExternalProvider = any;

export class PhantomTransferSigner implements GenericSigner<Transfer> {
  private provider: TransferExternalProvider;
  constructor(provider: TransferExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: Transfer): Promise<{ hash: string }> {
    console.log(tx);

    const hash = '';
    return { hash };
  }
}
