import type {
  OnWalletConnectHandler,
  OnWalletDisconnectHandler,
} from './Wallets.types';
import type { LastConnectedWallet } from '@rango-dev/queue-manager-rango-preset';
import type {
  LegacyEventHandler as EventHandler,
  LegacyEventHandler,
} from '@rango-dev/wallets-core/legacy';

import {
  legacyFormatAddressWithNetwork as formatAddressWithNetwork,
  legacyReadAccountAddress as readAccountAddress,
} from '@rango-dev/wallets-core/legacy';
import { Events } from '@rango-dev/wallets-react';
import { type Network } from '@rango-dev/wallets-shared';
import { isEvmBlockchain } from 'rango-sdk';

import { useAppStore } from '../../store/AppStore';
import {
  prepareAccountsForWalletStore,
  walletAndSupportedChainsNames,
} from '../../utils/wallets';

interface UseUpdatesParams {
  onConnectWalletHandler: React.MutableRefObject<
    OnWalletConnectHandler | undefined
  >;
  onDisconnectWalletHandler: React.MutableRefObject<
    OnWalletDisconnectHandler | undefined
  >;
}
interface UseUpdates {
  handler: EventHandler;
}

export function useUpdates(params: UseUpdatesParams): UseUpdates {
  const {
    newWalletConnected,
    disconnectWallet,
    disconnectNamespaces,
    connectedWallets,
    removeBalancesForWallet,
    blockchains,
  } = useAppStore();

  const { onConnectWalletHandler, onDisconnectWalletHandler } = params;
  const evmBasedChainNames = blockchains()
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  const onAccountsEvent = (
    event: Parameters<LegacyEventHandler>,
    params: {
      supportedChainNames: Network[] | null;
    }
  ) => {
    const [type, , value, state, info] = event;

    const walletFromEvent: LastConnectedWallet = {
      walletType: type,
      network: state.network ?? undefined,
      accounts: value,
    };
    if (!!onConnectWalletHandler.current) {
      onConnectWalletHandler.current(walletFromEvent);
    } else {
      console.warn(`onConnectWallet handler hasn't been set. Are you sure?`);
    }

    const data = prepareAccountsForWalletStore(
      type,
      value,
      evmBasedChainNames,
      params.supportedChainNames,
      info.isContractWallet
    );

    if (data.length) {
      void newWalletConnected(data, info.namespace, state.derivationPath);
    }
  };

  const handleUpdatesForHub: EventHandler = (
    type,
    event,
    value,
    state,
    info
  ) => {
    if (event === Events.ACCOUNTS) {
      const supportedChainNames: Network[] | null =
        walletAndSupportedChainsNames(info.supportedBlockchains);

      // After cleaning up balances, it's time to add new accounts.
      if (value) {
        onAccountsEvent([type, event, value, state, info], {
          supportedChainNames,
        });
      }
    }

    if (event === Events.PROVIDER_DISCONNECTED) {
      disconnectWallet(type);
      if (!!onDisconnectWalletHandler.current) {
        onDisconnectWalletHandler.current(type);
      } else {
        console.warn(
          `onDisconnectWallet handler hasn't been set. Are you sure?`
        );
      }
    }

    if (event === Events.NAMESPACE_DISCONNECTED) {
      disconnectNamespaces(type, value);
    }
  };

  const handleUpdatesForLegacy: EventHandler = (
    type,
    event,
    value,
    state,
    info
  ) => {
    if (event === Events.ACCOUNTS) {
      const supportedChainNames: Network[] | null =
        walletAndSupportedChainsNames(info.supportedBlockchains);

      /*
       * When a wallet is connecting to an evm account, we will consider it as the account exists on other evm-compatible blockchains
       * To get their balances.
       *
       * The logic here is for handling switching account functionality in wallets. when a wallet is switching to another account
       * we need to clean the balances for old accounts.
       *
       * Note: hub will do the cleanup on namespace diconnected event.
       */
      const evmAccounts: string[] = [];
      const nonEvmAccounts: string[] = [];

      value?.forEach((account: string) => {
        const { network } = readAccountAddress(account);
        if (evmBasedChainNames.includes(network)) {
          evmAccounts.push(account);
        } else {
          nonEvmAccounts.push(account);
        }
      });

      const previousAccounts = connectedWallets
        .filter((wallet) => wallet.walletType === type)
        .map((wallet) =>
          formatAddressWithNetwork(wallet.address, wallet.chain)
        );

      if (previousAccounts.length > 0) {
        if (evmAccounts.length > 0) {
          // We use same logic for removing as we use for adding.
          const data = prepareAccountsForWalletStore(
            type,
            evmAccounts,
            evmBasedChainNames,
            supportedChainNames,
            info.isContractWallet
          );

          removeBalancesForWallet(type, {
            chains: data.map((account) => account.chain),
          });
        }

        if (nonEvmAccounts.length > 0) {
          removeBalancesForWallet(type, {
            chains: nonEvmAccounts.map((account) => {
              const { network } = readAccountAddress(account);
              return network;
            }),
          });
        }
      }

      // After cleaning up balances, it's time to add new accounts.
      if (value) {
        onAccountsEvent([type, event, value, state, info], {
          supportedChainNames,
        });
      } else {
        disconnectWallet(type);
        if (!!onDisconnectWalletHandler.current) {
          onDisconnectWalletHandler.current(type);
        } else {
          console.warn(
            `onDisconnectWallet handler hasn't been set. Are you sure?`
          );
        }
      }
    }
  };

  const handleUpdatesForBoth: EventHandler = (
    type,
    event,
    value,
    state,
    _info
  ) => {
    if (event === Events.CONNECTED && value) {
      const walletFromEvent: LastConnectedWallet = {
        walletType: type,
        network: state.network ?? undefined,
        accounts: state.accounts ?? undefined,
      };
      if (!!onConnectWalletHandler.current) {
        onConnectWalletHandler.current(walletFromEvent);
      } else {
        console.warn(`onConnectWallet handler hasn't been set. Are you sure?`);
      }
    }

    if (event === Events.NETWORK && value) {
      const walletFromEvent: LastConnectedWallet = {
        walletType: type,
        network: value,
        accounts: state.accounts ?? undefined,
      };
      if (!!onConnectWalletHandler.current) {
        onConnectWalletHandler.current(walletFromEvent);
      } else {
        console.warn(`onConnectWallet handler hasn't been set. Are you sure?`);
      }
    }
  };

  const handler: EventHandler = (type, event, value, state, info) => {
    if (info.isHub) {
      handleUpdatesForHub(type, event, value, state, info);
    } else {
      handleUpdatesForLegacy(type, event, value, state, info);
    }

    handleUpdatesForBoth(type, event, value, state, info);
  };

  return {
    handler,
  };
}
