import { TransactionRequest } from '@ethersproject/abstract-provider';
import { ISigner, SignerError, SignerErrorCode } from 'rango-types';
import { EvmTransaction } from 'rango-types/lib/api/main';
import { providers } from 'ethers';

export interface IEvmSigner extends ISigner<EvmTransaction> {}

export class EvmSigner implements IEvmSigner {
  private signer: providers.JsonRpcSigner;

  constructor(provider: providers.ExternalProvider) {
    this.signer = new providers.Web3Provider(provider).getSigner();
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
  ): Promise<string> {
    try {
      const transaction = EvmSigner.buildTx(tx);
      const signerChainId = await this.signer.getChainId();
      const signerAddress = await this.signer.getAddress();
      if (
        !!chainId &&
        !!signerChainId &&
        signerChainId.toString().toLowerCase() !== chainId?.toLowerCase()
      ) {
        throw new SignerError(
          SignerErrorCode.UNEXPECTED_BEHAVIOUR,
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
          `Signer address: '${signerAddress.toLowerCase()}' doesn't match with required address: '${address.toLowerCase()}' for tx.`
        );
      }
      return (await this.signer.sendTransaction(transaction)).hash;
    } catch (error) {
      let message = undefined;
      if (
        error &&
        error.hasOwnProperty('message') &&
        error.hasOwnProperty('code') &&
        error.hasOwnProperty('reason')
      ) {
        message = `Error sending the tx (code: ${(error as any).code})`;
      } else if (
        error &&
        error.hasOwnProperty('code') &&
        error.hasOwnProperty('message') &&
        (error as any)?.code === -32603
      ) {
        throw new SignerError(
          SignerErrorCode.SEND_TX_ERROR,
          undefined,
          (error as any).message
        );
      }
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, message, error);
    }
  }

  static buildTx(evmTx: EvmTransaction): TransactionRequest {
    let tx: TransactionRequest = {};
    if (!!evmTx.from) tx = { ...tx, from: evmTx.from };
    if (!!evmTx.to) tx = { ...tx, to: evmTx.to };
    if (!!evmTx.data) tx = { ...tx, data: evmTx.data };
    if (!!evmTx.value) tx = { ...tx, value: evmTx.value };
    if (!!evmTx.nonce) tx = { ...tx, nonce: evmTx.nonce };
    if (!!evmTx.gasLimit) tx = { ...tx, gasLimit: evmTx.gasLimit };
    if (!!evmTx.gasPrice)
      tx = {
        ...tx,
        gasPrice: '0x' + parseInt(evmTx.gasPrice).toString(16),
      };
    if (!!evmTx.maxFeePerGas) tx = { ...tx, maxFeePerGas: evmTx.maxFeePerGas };
    if (!!evmTx.maxPriorityFeePerGas)
      tx = { ...tx, maxPriorityFeePerGas: evmTx.maxPriorityFeePerGas };
    return tx;
  }
}
