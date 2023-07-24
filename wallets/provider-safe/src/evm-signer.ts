import { GenericSigner } from 'rango-types';
import { EvmTransaction } from 'rango-types/lib/api/main';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { sdk, getTxHash } from './helpers';
import { OffChainSignMessageResponse } from '@safe-global/safe-apps-sdk';

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
    const result = await this.signer.signAndSendTx(tx, address, chainId);
    return {
      hash: result.hash,
      response: { ...result.response, hashRequiringUpdate: true },
    };
  }

  async wait(
    safeHash: string,
    chainId: string,
    response: TransactionResponse
  ): Promise<{
    hash: string;
    response: TransactionResponse & {
      hashWasUpdated: boolean;
      isMultiSig: true;
    };
    chainId: string;
  }> {
    const result = await getTxHash(safeHash);
    return {
      hash: result.txHash,
      response: {
        ...response,
        hashWasUpdated: result.hashWasUpdated,
        isMultiSig: true,
      },
      chainId,
    };
  }
}
