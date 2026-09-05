import type {
  OnWalletConnectHandler,
  OnWalletDisconnectHandler,
} from './Wallets.types';
import type { Network } from '@rango-dev/internal-blockchains';
import type { LastConnectedWallet } from '@rango-dev/queue-manager-rango-preset';
import type { EventHandler } from '@rango-dev/wallets-react';

import { Events } from '@rango-dev/wallets-react';
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
    blockchains,
  } = useAppStore();

  const { onConnectWalletHandler, onDisconnectWalletHandler } = params;
  const evmBasedChainNames = blockchains()
    .filter(isEvmBlockchain)
    .map((chain) => chain.name);

  const onAccountsEvent = (
    event: Parameters<EventHandler>,
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
      void newWalletConnected(data, info.namespace, state.derivationPath, {
        walletName: type,
      });
    }
  };

  const handler: EventHandler = (type, event, value, state, info) => {
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

  return {
    handler,
  };
}
