import type { ConnectedStandardSolanaWallet } from '@privy-io/react-auth/solana';
import type { SolanaWeb3Signer } from '@rango-dev/signer-solana';
import type { Transaction, VersionedTransaction } from '@solana/web3.js';
import type {
  BlockchainMeta,
  GenericSigner,
  SolanaTransaction,
} from 'rango-types';

import { usePrivy, useWallets as usePrivyWallets } from '@privy-io/react-auth';
import {
  useConnectedStandardWallets,
  useExportWallet,
} from '@privy-io/react-auth/solana';
import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import { generalSolanaTransactionExecutor } from '@rango-dev/signer-solana';
import {
  canEagerlyConnectToEvm,
  getEvmAccounts,
} from '@rango-dev/wallets-shared';
import { type ProviderInterface } from '@rango-dev/widget-embedded';
import base58 from 'bs58';
import {
  DefaultSignerFactory,
  evmBlockchains,
  isEvmBlockchain,
  solanaBlockchain,
  TransactionType,
} from 'rango-types';
import { useCallback, useEffect, useRef } from 'react';

const USER_CHECK_INTERVAL = 500;

export function usePrivyProvider(): {
  provider: ProviderInterface;
  exportEvmWallet: () => Promise<void>;
  exportSolanaWallet: () => Promise<void>;
} {
  const { user, login, logout, ready } = usePrivy();
  const { wallets: privyEvmWallets } = usePrivyWallets();
  const { wallets: privySolanaWallets } = useConnectedStandardWallets();

  const { exportWallet: exportEvmWallet } = usePrivy();
  const { exportWallet: exportSolanaWallet } = useExportWallet();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const instanceRef = useRef<Map<string, any | null>>();

  const updateInstance = async () => {
    if (!readyRef.current) {
      return;
    }

    const instances = new Map();
    const evmWallet = await privyEvmWallets?.[0]?.getEthereumProvider();
    const solanaWallet = privySolanaWallets?.[0];

    instances.set('ETH', evmWallet);
    instances.set('Solana', solanaWallet);
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
  }, [privyEvmWallets, privySolanaWallets]);
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
      const evmProvider = instanceRef.current?.get('ETH');
      const solanaProvider = instanceRef.current?.get('Solana');
      const result = [];
      if (evmProvider) {
        const evmResult = await getEvmAccounts(evmProvider);
        result.push(evmResult);
      }
      if (solanaProvider && solanaProvider.address) {
        result.push({
          accounts: [solanaProvider.address],
          chainId: 'SOLANA',
        });
      }

      return result;
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

  const canEagerConnect = async ({ meta }: { meta: BlockchainMeta[] }) => {
    try {
      if (!!instanceRef.current?.get('ETH')) {
        const instance = instanceRef.current.get('ETH');
        return await canEagerlyConnectToEvm({ instance, meta });
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
    const evmProvider = instanceRef.current?.get('ETH');
    const solanaProvider = instanceRef.current?.get('Solana');
    signers.registerSigner(
      TransactionType.EVM,
      new DefaultEvmSigner(evmProvider)
    );
    signers.registerSigner(
      TransactionType.SOLANA,
      new SolanaSigner(solanaProvider)
    );

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
    exportEvmWallet,
    exportSolanaWallet,
    provider: {
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
        const solana = solanaBlockchain(allBlockChains);
        return {
          name: 'Privy',
          img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/privy/icon.svg',
          installLink: {
            DEFAULT: 'https://www.privy.io/',
          },
          color: '#dac7ae',
          supportedChains: [...evms, ...solana],
        };
      },
    },
  };
}

export class SolanaSigner implements GenericSigner<SolanaTransaction> {
  private provider: ConnectedStandardSolanaWallet;
  constructor(provider: ConnectedStandardSolanaWallet) {
    this.provider = provider;
  }

  async signMessage(msg: string): Promise<string> {
    const encodedMessage = new TextEncoder().encode(msg);
    const signedMessage = await this.provider.signMessage({
      message: encodedMessage,
    });
    return base58.encode(signedMessage.signedMessage);
  }
  async signAndSendTx(tx: SolanaTransaction): Promise<{ hash: string }> {
    const DefaultSolanaSigner: SolanaWeb3Signer = async (
      solanaWeb3Transaction: Transaction | VersionedTransaction
    ) => {
      const signature = await this.provider.signTransaction({
        transaction: solanaWeb3Transaction.serialize(),
      });
      return signature.signedTransaction;
    };
    const hash = await generalSolanaTransactionExecutor(
      tx,
      DefaultSolanaSigner
    );
    return { hash };
  }
}
