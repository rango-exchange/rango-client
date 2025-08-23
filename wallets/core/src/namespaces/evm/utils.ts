import type { Chain, ChainId, ProviderAPI } from './types.js';
import type { CaipAccount } from '../../types/accounts.js';

import { AccountId } from 'caip';
import { type BlockchainMeta, evmBlockchains } from 'rango-types';

import { CAIP_NAMESPACE } from './constants.js';

const CHAIN_ID_RADIX = 16;

export async function getAccounts(provider: ProviderAPI) {
  const [accounts, chainId] = await Promise.all([
    provider.request({ method: 'eth_requestAccounts' }),
    provider.request({ method: 'eth_chainId' }),
  ]);
  /*
   * Trust Wallet Compatibility Fix:
   * Trust Wallet's in-app browser has been observed to return the `chainId` as a
   * number (e.g., 1) rather than the standard hexadecimal string (e.g., "0x1").
   * This code block standardizes the `chainId` to the required hex format to
   * prevent downstream errors.
   */
  let standardChainId = chainId;
  if (typeof standardChainId === 'number') {
    standardChainId = `0x${Number(chainId).toString(CHAIN_ID_RADIX)}`;
  }

  return {
    accounts,
    chainId: standardChainId,
  };
}

export async function suggestNetwork(instance: ProviderAPI, chain: Chain) {
  return await instance.request({
    method: 'wallet_addEthereumChain',
    params: [chain],
  });
}

export async function switchNetwork(instance: ProviderAPI, chainId: ChainId) {
  return await instance.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainId }],
  });
}
export function filterAndGetEvmBlockchainNames(meta: BlockchainMeta[]) {
  return evmBlockchains(meta).map((blockchain) => blockchain.name);
}
export async function switchOrAddNetwork(
  instance: ProviderAPI,
  chain: ChainId | Chain
) {
  try {
    const chainId = typeof chain === 'string' ? chain : chain.chainId;
    await switchNetwork(instance, chainId);
  } catch (switchError) {
    const error = switchError as { code: number };

    /*
     * Error code 4902 is used by MetaMask to indicate that the requested chain has not been added to the wallet.
     * This code is not part of the official EIP-1193 spec (https://eips.ethereum.org/EIPS/eip-1193#supported-rpc-methods),
     * so other providers may use a different code or behavior for the same condition.
     */
    const NOT_FOUND_CHAIN_ERROR_CODE = 4902;
    if (
      typeof chain !== 'string' &&
      (error.code === NOT_FOUND_CHAIN_ERROR_CODE || !error.code)
    ) {
      /*
       * Note: on WalletConnect `code` is undefined so we have to use !switchError.code as fallback.
       * This error code indicates that the chain has not been added to wallet.
       */
      await suggestNetwork(instance, chain);
      return;
    }
    throw switchError;
  }
}

const EIP_1193_USER_REJECTION_ERROR_CODE = 4001;
export function isUserRejectionError(error: unknown): boolean {
  // EIP-1193 user rejection error can be in error.code or error.cause.code
  if (typeof error === 'object' && error !== null) {
    const code = (error as { code?: number }).code;
    const causeCode = (error as { cause?: { code?: number } }).cause?.code;
    return (
      code === EIP_1193_USER_REJECTION_ERROR_CODE ||
      causeCode === EIP_1193_USER_REJECTION_ERROR_CODE
    );
  }
  return false;
}

export function formatAccountsToCAIP(accounts: string[], chainId: string) {
  return accounts.map(
    (account) =>
      AccountId.format({
        address: account,
        chainId: {
          namespace: CAIP_NAMESPACE,
          reference: chainId,
        },
      }) as CaipAccount
  );
}
