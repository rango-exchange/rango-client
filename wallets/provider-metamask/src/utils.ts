import type {
  MetamaskEvmProviderApi,
  Provider,
  WalletStandardSolanaInstance,
} from './types.js';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { getWallets } from '@wallet-standard/app';

import {
  SOLANA_WALLET_STANDARD_MAINNET,
  WALLET_STANDARD_NAME,
} from './constants.js';

export function metamask(): Provider | null {
  const { ethereum } = window;
  const solana = getSolanaWalletInstance();
  if (!ethereum || !isEthereumMetamaskProvider(ethereum)) {
    return null;
  }

  const instances: Provider = new Map();

  if (ethereum) {
    instances.set(LegacyNetworks.ETHEREUM, ethereum);
  }
  if (solana) {
    instances.set(LegacyNetworks.SOLANA, solana);
  }

  return instances;
}
function isEthereumMetamaskProvider(ethereum: MetamaskEvmProviderApi): boolean {
  if (!ethereum?.isMetaMask) {
    return false;
  }
  /*
   * Brave tries to make itself look like MetaMask
   * Could also try RPC `web3_clientVersion` if following is unreliable
   */
  if (ethereum.isBraveWallet && !ethereum._events && !ethereum._state) {
    return false;
  }
  if (ethereum.isApexWallet) {
    return false;
  }
  if (ethereum.isAvalanche) {
    return false;
  }
  if (ethereum.isBitKeep) {
    return false;
  }
  if (ethereum.isBlockWallet) {
    return false;
  }
  if (ethereum.isCoin98) {
    return false;
  }
  if (ethereum.isFordefi) {
    return false;
  }
  if (ethereum.__XDEFI) {
    return false;
  }
  if (ethereum.isMathWallet) {
    return false;
  }
  if (ethereum.isOkxWallet || ethereum.isOKExWallet) {
    return false;
  }
  if (ethereum.isOneInchIOSWallet || ethereum.isOneInchAndroidWallet) {
    return false;
  }
  if (ethereum.isOpera) {
    return false;
  }
  if (ethereum.isPortal) {
    return false;
  }
  if (ethereum.isRabby) {
    return false;
  }
  if (ethereum.isDefiant) {
    return false;
  }
  if (ethereum.isTokenPocket) {
    return false;
  }
  if (ethereum.isTokenary) {
    return false;
  }
  if (ethereum.isZeal) {
    return false;
  }
  if (ethereum.isZerion) {
    return false;
  }
  if (ethereum.isSafePal) {
    return false;
  }
  return true;
}
export function evmMetamask(): EvmProviderApi {
  const instances = metamask();

  const evmInstance = instances?.get(LegacyNetworks.ETHEREUM);

  if (!evmInstance) {
    throw new Error(
      'Metamask not injected or EVM not enabled. Please check your wallet.'
    );
  }

  return evmInstance as EvmProviderApi;
}
export function solanaMetamask(): WalletStandardSolanaInstance {
  const instances = metamask();
  const solanaInstance = instances?.get(LegacyNetworks.SOLANA);
  if (!solanaInstance) {
    throw new Error(
      'Metamask Solana instance is not available. Ensure that Solana support is enabled in your wallet.'
    );
  }
  return solanaInstance as WalletStandardSolanaInstance;
}
export function getInstanceOrThrow(): Provider {
  const instances = metamask();

  if (!instances) {
    throw new Error('MetaMask is not injected. Please check your wallet.');
  }

  return instances;
}
function getSolanaWalletInstance() {
  return getWallets()
    .get()
    .find(
      (wallet) =>
        wallet.name === WALLET_STANDARD_NAME &&
        wallet.chains.includes(SOLANA_WALLET_STANDARD_MAINNET)
    ) as WalletStandardSolanaInstance;
}
