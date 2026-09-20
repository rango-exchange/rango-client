import type { WithConnectTrigger } from '../../libs/connectLogging';
import type { WalletType } from '@hub3js/core';
import type {
  ConnectResult,
  NamespaceInputForConnect,
} from '@rango-dev/wallets-react';

import { useWallets } from '@rango-dev/wallets-react';

import { runConnectWithLogging } from '../../libs/connectLogging';

type ConnectWithLogging = (
  walletType: WalletType,
  namespaces?: NamespaceInputForConnect[],
  options?: WithConnectTrigger
) => Promise<ConnectResult[]>;

/**
 * `connect` from `useWallets`, logging the attempts that fail. Without a
 * trigger it's `connect` itself: nothing is logged and no timer runs.
 */
export function useConnectWithLogging(): ConnectWithLogging {
  const { connect } = useWallets();

  return async (walletType, namespaces, options) => {
    const trigger = options?.trigger;
    if (!trigger) {
      return connect(walletType, namespaces);
    }

    return runConnectWithLogging(
      { walletType, trigger, requestedNamespaces: namespaces ?? [] },
      async () => connect(walletType, namespaces)
    );
  };
}
