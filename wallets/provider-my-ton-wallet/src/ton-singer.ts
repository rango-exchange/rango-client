import { GenericSigner, SignerError, TonTransaction } from 'rango-types';
import { connector } from '.';
import { CHAIN } from '@tonconnect/sdk';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TonExternalProvider = any;

export class TonSigner implements GenericSigner<TonTransaction> {
  private provider: TonExternalProvider;
  constructor(provider: TonExternalProvider) {
    this.provider = provider;
    console.log(this.provider);
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: TonTransaction): Promise<{ hash: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type, blockChain, ...txObjectForSign } = tx;

    const { boc: hash } = await connector.sendTransaction({
      ...txObjectForSign,
      network: tx.network as CHAIN | undefined,
    });
    return { hash };
  }
}
