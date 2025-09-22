import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';

import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Provider = Record<string, any>;

export function metamask(): Provider | null {
  const { ethereum } = window;

  if (!ethereum || !isEthereumMetamaskProvider(ethereum)) {
    return null;
  }

  const instances: Provider = new Map();

  if (ethereum) {
    instances.set(LegacyNetworks.ETHEREUM, ethereum);
  }

  return instances;
}
function isEthereumMetamaskProvider(ethereum: Provider): boolean {
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
  if (ethereum.isPhantom) {
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
export function getInstanceOrThrow(): Provider {
  const instances = metamask();

  if (!instances) {
    throw new Error('MetaMask is not injected. Please check your wallet.');
  }

  return instances;
}
