import { TransactionRequest, TransactionResponse } from '@ethersproject/abstract-provider';
import { GenericSigner, SignerError, SignerErrorCode } from 'rango-types';
import { EvmTransaction } from 'rango-types/lib/api/main';
import { providers } from 'ethers';
import { cleanEvmError } from './helper';

export class DefaultEvmSigner implements GenericSigner<EvmTransaction> {
  private signer: providers.JsonRpcSigner;
  private provider: providers.Web3Provider;

  constructor(provider: providers.ExternalProvider) {
    this.provider = new providers.Web3Provider(provider);
    this.signer = this.provider.getSigner();
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
    chainId: string | null,
  ): Promise<{ hash: string; response: TransactionResponse }> {
    try {
      const transaction = DefaultEvmSigner.buildTx(tx);
      const signerChainId = await this.signer.getChainId();
      const signerAddress = await this.signer.getAddress();
      if (
        !!chainId &&
        !!signerChainId &&
        signerChainId.toString().toLowerCase() !== chainId?.toLowerCase()
      ) {
        throw new SignerError(
          SignerErrorCode.UNEXPECTED_BEHAVIOUR,
          `Signer chainId: '${signerChainId}' doesn't match with required chainId: '${chainId}' for tx.`,
        );
      }
      if (!!signerAddress && !!address && signerAddress.toLowerCase() !== address.toLowerCase()) {
        throw new SignerError(
          SignerErrorCode.UNEXPECTED_BEHAVIOUR,
          `Signer address: '${signerAddress.toLowerCase()}' doesn't match with required address: '${address.toLowerCase()}' for tx.`,
        );
      }
      const response = await this.signer.sendTransaction(transaction);
      return { hash: response.hash, response };
    } catch (error) {
      throw cleanEvmError(error);
    }
  }

  async wait(
    txHash: string,
    txResponse?: TransactionResponse,
    confirmations?: number | undefined,
  ): Promise<{ hash: string; response?: TransactionResponse }> {
    try {
      if (txResponse) {
        await txResponse?.wait(confirmations);
        return { hash: txHash };
      }
      if (!this.provider) return { hash: txHash }; // wallet not connected yet
      const tx = await this.provider.getTransaction(txHash);
      if (!tx) throw Error(`Transaction hash '${txHash}' not found in blockchain.`);
      await tx.wait(confirmations);
      return { hash: txHash };
    } catch (err) {
      const error = err as any; // TODO find a proper type
      if (error?.code === 'TRANSACTION_REPLACED' && error?.replacement)
        return { hash: error?.replacement?.hash, response: error?.replacement };
      throw cleanEvmError(error);
    }
  }

  static buildTx(evmTx: EvmTransaction): TransactionRequest {
    let tx: TransactionRequest = {};
    if (evmTx.from) tx = { ...tx, from: evmTx.from };
    if (evmTx.to) tx = { ...tx, to: evmTx.to };
    if (evmTx.data) tx = { ...tx, data: evmTx.data };
    if (evmTx.value) tx = { ...tx, value: evmTx.value };
    if (evmTx.nonce) tx = { ...tx, nonce: evmTx.nonce };
    if (evmTx.gasLimit) tx = { ...tx, gasLimit: evmTx.gasLimit };
    if (evmTx.gasPrice)
      tx = {
        ...tx,
        gasPrice: '0x' + parseInt(evmTx.gasPrice).toString(16),
      };
    if (evmTx.maxFeePerGas) tx = { ...tx, maxFeePerGas: evmTx.maxFeePerGas };
    if (evmTx.maxPriorityFeePerGas)
      tx = { ...tx, maxPriorityFeePerGas: evmTx.maxPriorityFeePerGas };
    return tx;
  }
}
