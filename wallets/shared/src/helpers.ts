import type { Network, Wallet } from './rango.js';
import type { EvmNetworksChainInfo } from '@rango-dev/wallets-blockchains';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepCopy(obj: any): any {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || 'object' != typeof obj) {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    copy = {} as any;
    for (const attr in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, attr)) {
        copy[attr] = deepCopy(obj[attr]);
      }
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

export async function switchOrAddNetworkForMetamaskCompatibleWallets(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: any,
  network: Network,
  evmNetworksChainInfo: EvmNetworksChainInfo
) {
  const targetChain = evmNetworksChainInfo[network];

  try {
    await instance.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChain?.chainId }],
    });
  } catch (switchError) {
    /*
     * @ts-ignore
     * To resolve this error: Catch clause variable type annotation must be any or unknown if specified
     */
    const error = switchError as { code: number };

    if (!targetChain) {
      throw new Error(
        `It seems you don't have ${network} network on your wallet. Please add it manually.`
      );
      /* eslint-disable @typescript-eslint/no-magic-numbers */
    } else if (error.code === 4902 || !error.code) {
      /*
       * Note: on WalletConnect `code` is undefined so we have to use !switchError.code as fallback.
       * This error code indicates that the chain has not been added to wallet.
       */
      await instance.request({
        method: 'wallet_addEthereumChain',
        params: [targetChain],
      });
      // Return if target chain has been added successfully
      return;
    }
    throw switchError;
  }
}

export const evmChainsToRpcMap = (
  evmNetworkChainInfo: EvmNetworksChainInfo
) => {
  return Object.fromEntries(
    new Map(
      Object.keys(evmNetworkChainInfo).map((chainName) => {
        const info = evmNetworkChainInfo[chainName];

        /*
         * This `if` is only used for satisfying typescript,
         * Because we iterating over Object.keys(EVM_NETWORKS_CHAIN_INFO)
         * And obviously it cannot be `undefined` and always has a value.
         */
        if (info) {
          return [parseInt(info.chainId), info.rpcUrls[0]];
        }
        return [0, ''];
      })
    )
  );
};

export function sortWalletsBasedOnState(wallets: Wallet[]): Wallet[] {
  return wallets.sort(
    (a, b) =>
      Number(b.connected) - Number(a.connected) ||
      Number(b.extensionAvailable) - Number(a.extensionAvailable)
  );
}
