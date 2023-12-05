import type { TransactionResponse } from '@ethersproject/abstract-provider';
import type { OffChainSignMessageResponse } from '@safe-global/safe-apps-sdk';
import type { GenericSigner } from 'rango-types';
import type { EvmTransaction } from 'rango-types/lib/api/main';

import { DefaultEvmSigner } from '@rango-dev/signer-evm';

import { getTxHash, sdk } from './helpers';

export class CustomEvmSigner implements GenericSigner<EvmTransaction> {
  private signer;

  constructor(provider: any) {
    this.signer = new DefaultEvmSigner(provider);
  }

  async signMessage(msg: string): Promise<string> {
    const { signature } = (await sdk.txs.signMessage(
      msg
    )) as OffChainSignMessageResponse & { signature: string };

    return signature;
  }

  async signAndSendTx(
    tx: EvmTransaction,
    address: string,
    chainId: string | null
  ): Promise<{
    hash: string;
    response: TransactionResponse & { hashRequiringUpdate: boolean };
  }> {
    const { hash, response } = await this.signer.signAndSendTx(
      tx,
      address,
      chainId
    );
    return {
      hash,
      response: { ...response, hashRequiringUpdate: true },
    };
  }

  async wait(
    safeHash: string,
    chainId: string,
    response: TransactionResponse
  ): Promise<{
    hash: string;
    response: TransactionResponse;
    chainId: string;
  }> {
    const { txHash: hash } = await getTxHash(safeHash);
    return {
      hash,
      response,
      chainId,
    };
  }
}
