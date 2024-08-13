import type {
  TransactionRequest,
  TransactionResponse,
} from '@ethersproject/abstract-provider';
import type { GenericSigner } from 'rango-types';
import type { EvmTransaction } from 'rango-types/mainApi';

import { providers } from 'ethers';
import {
  RPCErrorCode as RangoRPCErrorCode,
  SignerError,
  SignerErrorCode,
} from 'rango-types';

import { cleanEvmError, getTenderlyError, waitMs } from './helper.js';
import { RPCErrorCode } from './types.js';

type ProviderType = ConstructorParameters<typeof providers.Web3Provider>[0];

const waitWithMempoolCheck = async (
  provider: providers.Web3Provider,
  tx: TransactionResponse,
  txHash: string,
  confirmations?: number
) => {
  const TIMEOUT = 3_000;
  let finished = false;
  return await Promise.race([
    (async () => {
      await tx.wait(confirmations);
      finished = true;
    })(),
    (async () => {
      while (!finished) {
        await waitMs(TIMEOUT);
        if (finished) {
          return null;
        }
        try {
          const mempoolTx = await provider.getTransaction(txHash);
          if (!mempoolTx) {
            return null;
          }
        } catch (error) {
          console.log({ error });
          return null;
        }
      }
      return null;
    })(),
  ]);
};

export class DefaultEvmSigner implements GenericSigner<EvmTransaction> {
  private signer: providers.JsonRpcSigner;
  private provider: providers.Web3Provider;

  constructor(provider: ProviderType) {
    this.provider = new providers.Web3Provider(provider);
    this.signer = this.provider.getSigner();
  }

  static buildTx(evmTx: EvmTransaction, disableV2 = false): TransactionRequest {
    const TO_STRING_BASE = 16;
    let tx: TransactionRequest = {};
    /*
     * it's better to pass 0x instead of undefined, otherwise some wallets could face issue
     * https://github.com/WalletConnect/web3modal/issues/1082#issuecomment-1637793242
     */
    tx = {
      data: evmTx.data || '0x',
    };
    if (evmTx.from) {
      tx = { ...tx, from: evmTx.from };
    }
    if (evmTx.to) {
      tx = { ...tx, to: evmTx.to };
    }
    if (evmTx.value) {
      tx = { ...tx, value: evmTx.value };
    }
    if (evmTx.nonce) {
      tx = { ...tx, nonce: evmTx.nonce };
    }
    if (evmTx.gasLimit) {
      tx = { ...tx, gasLimit: evmTx.gasLimit };
    }
    if (!disableV2 && evmTx.maxFeePerGas && evmTx.maxPriorityFeePerGas) {
      tx = {
        ...tx,
        maxFeePerGas: evmTx.maxFeePerGas,
        maxPriorityFeePerGas: evmTx.maxPriorityFeePerGas,
      };
    } else if (evmTx.gasPrice) {
      tx = {
        ...tx,
        gasPrice: '0x' + parseInt(evmTx.gasPrice).toString(TO_STRING_BASE),
      };
    }
    return tx;
  }

  async signMessage(msg: string): Promise<string> {
    try {
      return await this.signer.signMessage(msg);
    } catch (error) {
      throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, error);
    }
  }

  async signAndSendTx(
    tx: EvmTransaction,
    address: string,
    chainId: string | null
  ): Promise<{ hash: string; response: TransactionResponse }> {
    try {
      this.signer = this.provider.getSigner(tx.from ?? undefined);

      const transaction = DefaultEvmSigner.buildTx(tx);

      const signerChainId = await this.signer.getChainId();
      const signerAddress = await this.signer.getAddress();
      if (!!chainId && !!signerChainId && signerChainId !== parseInt(chainId)) {
        throw new SignerError(
          SignerErrorCode.UNEXPECTED_BEHAVIOUR,
          undefined,
          `Signer chainId: '${signerChainId}' doesn't match with required chainId: '${chainId}' for tx.`
        );
      }
      if (
        !!signerAddress &&
        !!address &&
        signerAddress.toLowerCase() !== address.toLowerCase()
      ) {
        throw new SignerError(
          SignerErrorCode.UNEXPECTED_BEHAVIOUR,
          undefined,
          `Signer address: '${signerAddress.toLowerCase()}' doesn't match with required address: '${address.toLowerCase()}' for tx.`
        );
      }
      try {
        const response = await this.signer.sendTransaction(transaction);
        return { hash: response.hash, response };
      } catch (error: any) {
        // retrying EIP-1559 without v2 related fields
        if (
          !!error?.message &&
          typeof error.message === 'string' &&
          error.message.indexOf('EIP-1559') !== -1
        ) {
          console.log('retrying EIP-1559 error without v2 fields ...');
          const transaction = DefaultEvmSigner.buildTx(tx, true);
          const response = await this.signer.sendTransaction(transaction);
          return { hash: response.hash, response };
        }
        throw error;
      }
    } catch (error) {
      throw cleanEvmError(error);
    }
  }

  async wait(
    txHash: string,
    chainId?: string,
    txResponse?: TransactionResponse,
    confirmations?: number
  ): Promise<{ hash: string; response?: TransactionResponse }> {
    try {
      /*
       * if we have transaction response, use that to wait
       * otherwise, try to get tx response from the wallet provider
       */
      if (txResponse) {
        // if we use waitWithMempoolCheck here, we can't detect replaced tx anymore
        await txResponse?.wait(confirmations);
        return { hash: txHash };
      }

      // ignore wait if wallet not connected yet
      if (!this.provider) {
        return { hash: txHash };
      }
      this.signer = this.provider.getSigner();

      /*
       * don't proceed if signer chain changed or chain id is not specified
       * because if user change the wallet network, we receive null on getTransaction
       */
      if (!chainId) {
        return { hash: txHash };
      }
      const signerChainId = await this.signer.getChainId();
      if (!signerChainId || parseInt(chainId) != signerChainId) {
        return { hash: txHash };
      }

      const tx = await this.provider.getTransaction(txHash);
      if (!tx) {
        throw Error(`Transaction hash '${txHash}' not found in blockchain.`);
      }

      await waitWithMempoolCheck(this.provider, tx, txHash, confirmations);
      return { hash: txHash };
    } catch (err) {
      const error = err as any; // TODO find a proper type
      if (
        error?.code === RPCErrorCode.TRANSACTION_REPLACED &&
        error?.replacement
      ) {
        return { hash: error?.replacement?.hash, response: error?.replacement };
      } else if (error?.code === RPCErrorCode.CALL_EXCEPTION) {
        const tError = await getTenderlyError(chainId, txHash);
        if (!!tError) {
          throw new SignerError(
            SignerErrorCode.TX_FAILED_IN_BLOCKCHAIN,
            'Trannsaction failed in blockchain',
            tError,
            RangoRPCErrorCode.CALL_EXCEPTION,
            error
          );
        } else {
          /**
           * In cases where the is no error returen from tenderly, we could ignore
           * the error and proceed with check status flow.
           */
          return { hash: txHash };
        }
      }
      /**
       * Ignore other errors in confirming transaction and proceed with check status flow,
       * Some times rpc gives internal error or other type of errors even if the transaction succeeded
       */
      return { hash: txHash };
    }
  }
}
