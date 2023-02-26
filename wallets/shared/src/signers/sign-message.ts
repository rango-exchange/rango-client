/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BlockchainMeta,
  isCosmosBlockchain,
  isEvmBlockchain,
  isSolanaBlockchain,
} from '../rango';
import { WalletError, WalletErrorCode } from '../errors';
import { signCosmosMessage } from './cosmos-signer';
import { signSolanaMessage } from './solana-signer';
import { signEvmMessage } from './evm-signer';

export async function signMessage(
  address: string,
  message: string,
  provider: any,
  blockChain: string,
  meta: BlockchainMeta[]
): Promise<string> {
  try {
    const netwok = meta?.find(
      (chain) => chain.name === blockChain
    ) as BlockchainMeta;
    let signature;
    if (isCosmosBlockchain(netwok)) {
      signature = signCosmosMessage(address, message, provider, netwok.chainId);
    } else if (isSolanaBlockchain(netwok)) {
      signature = signSolanaMessage(message, provider);
    } else if (isEvmBlockchain(netwok)) {
      signature = signEvmMessage(address, message, provider);
    } else {
      throw new WalletError(WalletErrorCode.NOT_IMPLEMENTED, undefined);
    }

    return signature;
  } catch (error) {
    throw new WalletError(WalletErrorCode.SIGN_TX_ERROR, undefined, error);
  }
}
