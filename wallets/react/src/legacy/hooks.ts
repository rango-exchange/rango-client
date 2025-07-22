import type { ProviderContext, WalletActions, WalletConfig } from './types.js';
import type { LegacyEventHandler as WalletEventHandler } from '@arlert-dev/wallets-core/legacy';

import { LegacyWallet as Wallet } from '@arlert-dev/wallets-core/legacy';
import { useContext, useRef } from 'react';

import { WalletContext } from './context.js';

export type GetWalletInstance = (wallet: {
  actions: WalletActions;
  config: WalletConfig;
}) => Wallet;

export function useInitializers(
  onChangeState: WalletEventHandler
): GetWalletInstance {
  const availableWallets = useRef<{
    [key: string]: Wallet | undefined;
  }>({});

  /*
   * If `wallet` hasn't been added to `availableWallets`,
   * Get a instance of `Wallet` and save the refrence in `availableWallets`.
   * Otherwise, return the already created instance.
   */
  function updater(wallet: {
    actions: WalletActions;
    config: WalletConfig;
  }): Wallet {
    const type = wallet.config.type;
    // We only update, if there is no instance available.
    if (typeof availableWallets.current[type] === 'undefined') {
      availableWallets.current[type] = new Wallet(
        {
          config: wallet.config,
          handler: onChangeState,
        },
        wallet.actions
      );
    }

    return availableWallets.current[type]!;
  }

  return updater;
}

export function useWallets(): ProviderContext {
  const context = useContext(WalletContext);
  if (!context) {
    throw Error('useWallet can only be used within the Provider component');
  }
  return context;
}
