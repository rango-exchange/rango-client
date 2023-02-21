/* eslint-disable @typescript-eslint/no-explicit-any */
import { providers } from 'ethers';
import {
  getBlockChainNameFromId,
  Network,
  EvmTransaction,
  Meta,
} from '../rango';
// import { EvmTransaction } from '../../../../api/models/TransactionModels';
// import { Meta } from '../../../../state/MetaSlice';
import { WalletError, WalletErrorCode } from '../errors';
import { getNetworkInstance } from '../providers';

export async function executeEvmTransaction(
  evmTransaction: EvmTransaction,
  meta: Meta,
  provider: any
): Promise<string> {
  const ethProvider = getNetworkInstance(provider, Network.ETHEREUM);
  const web3Provider = new providers.Web3Provider(ethProvider);
  const signer = web3Provider.getSigner();
  const chainId = await signer.getChainId();
  const txBlockchainName = evmTransaction.blockChain.toLowerCase();
  // safety check to avoid sending the transaction in a wrong chain
  if (chainId) {
    const blockchainsArray = Object.entries(meta.blockchains).map(
      ([, blockchainMeta]) => blockchainMeta
    );
    const blockchain = getBlockChainNameFromId(chainId, blockchainsArray);
    if (!blockchain || blockchain.toLowerCase() !== txBlockchainName)
      throw new WalletError(
        WalletErrorCode.UNEXPECTED_BEHAVIOUR,
        `Provider chainId: '${chainId}' doesn't match with required network: '${txBlockchainName}' for tx.`
      );
  } else {
    throw new WalletError(
      WalletErrorCode.UNEXPECTED_BEHAVIOUR,
      `ChainId ${chainId} is null!`
    );
  }
  try {
    let tx = {};
    if (!!evmTransaction.from) tx = { ...tx, from: evmTransaction.from };
    if (!!evmTransaction.to) tx = { ...tx, to: evmTransaction.to };
    if (!!evmTransaction.data) tx = { ...tx, data: evmTransaction.data };
    if (!!evmTransaction.value) tx = { ...tx, value: evmTransaction.value };
    if (!!evmTransaction.gasLimit)
      tx = { ...tx, gasLimit: evmTransaction.gasLimit };
    if (!!evmTransaction.nonce) tx = { ...tx, nonce: evmTransaction.nonce };
    if (!!evmTransaction.gasPrice)
      tx = {
        ...tx,
        gasPrice: '0x' + parseInt(evmTransaction.gasPrice).toString(16),
      };
    if (!!evmTransaction.maxFeePerGas)
      tx = { ...tx, maxFeePerGas: evmTransaction.maxFeePerGas };
    if (!!evmTransaction.maxPriorityFeePerGas)
      tx = { ...tx, maxPriorityFeePerGas: evmTransaction.maxPriorityFeePerGas };
    const tr = await signer.sendTransaction(tx);
    return tr.hash;
    // @ts-ignore
  } catch (error: any) {
    let message = undefined;
    if (error && error && error?.message && error?.code && error?.reason) {
      message = `Error sending the tx (code: ${error?.code})`;
    } else if (
      error &&
      error?.code &&
      error?.code === -32603 &&
      error.message
    ) {
      throw new WalletError(
        WalletErrorCode.SEND_TX_ERROR,
        undefined,
        error.message
      );
    }
    throw new WalletError(WalletErrorCode.SEND_TX_ERROR, message, error);
  }
}

export async function signEvmMessage(
  walletAddress: string,
  message: string,
  provider: any
): Promise<string> {
  try {
    const ethProvider = getNetworkInstance(provider, Network.ETHEREUM);
    const web3Provider = new providers.Web3Provider(ethProvider);
    return await web3Provider.getSigner(walletAddress).signMessage(message);
  } catch (error) {
    throw new WalletError(WalletErrorCode.SIGN_TX_ERROR, undefined, error);
  }
}
