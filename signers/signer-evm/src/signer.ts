import { TransactionRequest } from '@ethersproject/abstract-provider';
import { ISigner, SignerFactory } from 'rango-types';
import { EvmTransaction, TransactionType } from 'rango-types/lib/api/main';
import { Signer as EthersSigner } from 'ethers';

export interface IEvmSigner extends ISigner<EvmTransaction, EthersSigner> {}

export class EvmSigner implements IEvmSigner {
  async signMessage(signer: EthersSigner, msg: string): Promise<string> {
    return await signer.signMessage(msg);
  }

  async signAndSendTx(
    signer: EthersSigner,
    tx: EvmTransaction
  ): Promise<string> {
    const transaction = EvmSigner.buildTx(tx);
    return (await signer.sendTransaction(transaction)).hash;
  }

  private static buildTx(evmTx: EvmTransaction): TransactionRequest {
    let tx: TransactionRequest = {};
    if (!!evmTx.from) tx = { ...tx, from: evmTx.from };
    if (!!evmTx.to) tx = { ...tx, to: evmTx.to };
    if (!!evmTx.data) tx = { ...tx, data: evmTx.data };
    if (!!evmTx.value) tx = { ...tx, value: evmTx.value };
    if (!!evmTx.gasLimit) tx = { ...tx, gasLimit: evmTx.gasLimit };
    if (!!evmTx.nonce) tx = { ...tx, nonce: evmTx.nonce };
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

function getSignerFactory(): SignerFactory {
  const factory = new SignerFactory();
  const evmSigner = new EvmSigner();
  factory.registerSigner(TransactionType.EVM, evmSigner);
  return factory;
}
