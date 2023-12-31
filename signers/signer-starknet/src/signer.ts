import type { GenericSigner, StarknetTransaction } from 'rango-types';

import { SignerError, SignerErrorCode } from 'rango-types';

/*
 * TODO - replace with real type
 * tslint:disable-next-line: no-any
 */
type StarknetExternalProvider = any;

export class DefaultStarknetSigner
  implements GenericSigner<StarknetTransaction>
{
  private provider: StarknetExternalProvider;

  constructor(provider: StarknetExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: StarknetTransaction): Promise<{ hash: string }> {
    try {
      await this.provider.enable();
      const { transaction_hash } = await this.provider.account.execute(
        tx.calls
      );
      return { hash: transaction_hash };
    } catch (error) {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error);
    }
  }
}
