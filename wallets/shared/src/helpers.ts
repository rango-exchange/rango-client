import type { EvmBlockchainMeta } from 'rango-types';
import {
  EvmNetworksChainInfo,
  AddEthereumChainParameter,
  Network,
  Networks,
  Connect,
  Wallet,
  InstallObjects,
} from './rango';

export { isAddress as isEvmAddress } from 'ethers/lib/utils.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepCopy(obj: any): any {
  let copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || 'object' != typeof obj) return obj;

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
    copy = {} as any;
    for (const attr in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, attr))
        copy[attr] = deepCopy(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

export async function switchOrAddNetworkForMetamaskCompatibleWallets(
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // To resolve this error: Catch clause variable type annotation must be any or unknown if specified
    const error = switchError as { code: number };

    if (!targetChain) {
      throw new Error(
        `It seems you don't have ${network} network on your wallet. Please add it manually.`
      );
    } else if (error.code === 4902 || !error.code) {
      // Note: on WalletConnect `code` is undefined so we have to use !switchError.code as fallback.
      // This error code indicates that the chain has not been added to wallet.
      await instance.request({
        method: 'wallet_addEthereumChain',
        params: [targetChain],
      });
    }
    throw switchError;
  }
}

export function timeout<T = any>(
  forPromise: Promise<any>,
  time: number
): Promise<T> {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject('Timeout!');
    }, time);
  });

  return Promise.race([forPromise, timeoutPromise]);
}

export const convertEvmBlockchainMetaToEvmChainInfo = (
  evmBlockchains: EvmBlockchainMeta[]
) =>
  evmBlockchains.reduce(
    (
      evmNetWorksChainInfo: { [key: string]: AddEthereumChainParameter },
      blockchainMeta
    ) => (
      (evmNetWorksChainInfo[blockchainMeta.name] = {
        chainName: blockchainMeta.info.chainName,
        chainId: blockchainMeta.chainId,
        nativeCurrency: blockchainMeta.info.nativeCurrency,
        rpcUrls: blockchainMeta.info.rpcUrls,
        blockExplorerUrls: blockchainMeta.info.blockExplorerUrls,
      }),
      evmNetWorksChainInfo
    ),
    {}
  );

export const evmChainsToRpcMap = (
  evmNetworkChainInfo: EvmNetworksChainInfo
) => {
  return Object.fromEntries(
    new Map(
      Object.keys(evmNetworkChainInfo).map((chainName) => {
        const info = evmNetworkChainInfo[chainName];

        // This `if` is only used for satisfying typescript,
        // Because we iterating over Object.keys(EVM_NETWORKS_CHAIN_INFO)
        // And obviously it cannot be `undefined` and always has a value.
        if (info) {
          return [parseInt(info.chainId), info.rpcUrls[0]];
        }
        return [0, ''];
      })
    )
  );
};

export const getSolanaAccounts: Connect = async ({ instance }) => {
  // Asking for account from wallet.
  const solanaResponse = await instance.connect();

  const account = solanaResponse.publicKey.toString();
  return {
    accounts: [account],
    chainId: Networks.SOLANA,
  };
};

export function getCoinbaseInstance(
  lookingFor: 'coinbase' | 'metamask' = 'coinbase'
) {
  const { ethereum, coinbaseSolana } = window;
  const instances = new Map();
  if (ethereum) {
    const checker =
      lookingFor === 'metamask' ? 'isMetaMask' : 'isCoinbaseWallet';

    // If only Coinbase Wallet is installed
    if (lookingFor === 'coinbase' && ethereum[checker]) {
      instances.set(Networks.ETHEREUM, ethereum);
    }
    // If Coinbase Wallet and Metamask is installed at the same time.
    else if (ethereum.providers?.length) {
      const ethInstance = ethereum.providers.find((provider: any) => {
        return provider[checker];
      });
      instances.set(Networks.ETHEREUM, ethInstance);
    }
  }
  if (!!coinbaseSolana && lookingFor === 'coinbase')
    instances.set(Networks.SOLANA, coinbaseSolana);

  if (instances.size === 0) return null;

  if (lookingFor === 'metamask') return instances.get(Networks.ETHEREUM);

  return instances;
}

export function sortWalletsBasedOnState(wallets: Wallet[]): Wallet[] {
  return wallets.sort(
    (a, b) =>
      Number(b.connected) - Number(a.connected) ||
      Number(b.extensionAvailable) - Number(a.extensionAvailable)
  );
}

function isBrave() {
  let isBrave = false;
  const nav: any = navigator;
  if (nav.brave && nav.brave.isBrave) {
    nav.brave.isBrave().then((res: boolean) => {
      if (res) isBrave = true;
    });
  }

  return isBrave;
}

export function detectInstallLink(install: InstallObjects | string): string {
  if (typeof install !== 'object') {
    return install;
  } else {
    let link;
    if (isBrave()) {
      link = install.BRAVE;
    } else if (navigator.userAgent?.toLowerCase().indexOf('chrome') !== -1) {
      link = install.CHROME;
    } else if (navigator.userAgent?.toLowerCase().indexOf('firefox') !== -1) {
      link = install.FIREFOX;
    } else if (navigator.userAgent?.toLowerCase().indexOf('edge') !== -1) {
      link = install.EDGE;
    }
    return link || install.DEFAULT;
  }
}

export function detectMobileScreens(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
