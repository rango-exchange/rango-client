import type { BlockchainMeta } from 'rango-types';

import { usePrivy, useWallets as usePrivyWallets } from '@privy-io/react-auth';
import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { getEvmAccounts } from '@rango-dev/wallets-shared';
import { type ProviderInterface } from '@rango-dev/widget-embedded';
import {
  DefaultSignerFactory,
  evmBlockchains,
  isEvmBlockchain,
  TransactionType,
} from 'rango-types';
import { useCallback, useEffect, useRef } from 'react';

const USER_CHECK_INTERVAL = 500;

export function usePrivyProvider(): ProviderInterface {
  const { user, login, logout, ready } = usePrivy();
  const { wallets: privyWallets } = usePrivyWallets();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceRef = useRef<Map<string, any | null>>();

  const updateInstance = async () => {
    if (!readyRef.current) {
      return;
    }

    const instances = new Map();
    const wallet = await privyWallets?.[0]?.getEthereumProvider();

    instances.set('ETH', wallet);
    instanceRef.current = instances;
  };

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
    void updateInstance();
  }, [user]);
  const readyRef = useRef(ready);
  useEffect(() => {
    readyRef.current = ready;
    void updateInstance();
  }, [ready]);
  useEffect(() => {
    void updateInstance();
  }, [privyWallets]);
  const loginRef = useRef(login);
  useEffect(() => {
    loginRef.current = login;
  }, [login]);

  const getInstance = () => {
    return instanceRef.current;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connect = async (): Promise<any> => {
    if (!!instanceRef.current?.get('ETH')) {
      const provider = instanceRef.current?.get('ETH');
      const { accounts, chainId } = await getEvmAccounts(provider);

      return {
        accounts,
        chainId,
      };
    }
    await loginRef.current();
    const getUserPromise = new Promise((resolve) => {
      const intervalId = setInterval(async () => {
        if (!!instanceRef.current?.get('ETH')) {
          clearInterval(intervalId);
          const provider = instanceRef.current?.get('ETH');
          const { accounts, chainId } = await getEvmAccounts(provider);

          resolve({ accounts, chainId });
        }
      }, USER_CHECK_INTERVAL);
    });
    const result = await getUserPromise;

    return result;
  };

  const canEagerConnect = async () => {
    try {
      if (!!instanceRef.current?.get('ETH')) {
        const provider = instanceRef.current.get('ETH');
        const accounts: string[] = await provider?.request({
          method: 'eth_accounts',
        });

        if (accounts.length) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };

  const switchNetwork = useCallback(
    async ({
      network,
      meta,
    }: {
      network: string;
      meta: BlockchainMeta[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }): Promise<any> => {
      const chainId = meta.find((chain) => chain.name === network)?.chainId;
      if (!!chainId && !!instanceRef.current?.get('ETH')) {
        const provider = instanceRef.current.get('ETH');
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        });
      }
    },
    []
  );

  const disconnect = async () => {
    await logout();
  };

  const getSigners = async () => {
    const signers = new DefaultSignerFactory();
    const provider = instanceRef.current?.get('ETH');
    signers.registerSigner(TransactionType.EVM, new DefaultEvmSigner(provider));

    return signers;
  };

  const canSwitchNetworkTo = useCallback(
    ({ network, meta }: { network: string; meta: BlockchainMeta[] }) => {
      return meta
        .filter(isEvmBlockchain)
        .map((blockchain) => blockchain.name)
        .includes(network);
    },
    []
  );

  return {
    config: {
      type: 'privy',
    },
    connect,
    disconnect,
    getInstance,
    canEagerConnect,
    switchNetwork,
    getSigners,
    canSwitchNetworkTo,
    // switchNetwork,
    getWalletInfo: (allBlockChains: BlockchainMeta[]) => {
      const evms = evmBlockchains(allBlockChains);
      return {
        name: 'Privy',
        img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/privy/icon.svg',
        installLink: {
          DEFAULT: 'https://www.privy.io/',
        },
        color: '#dac7ae',
        supportedChains: evms,
      };
    },
  };
}
