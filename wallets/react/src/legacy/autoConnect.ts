import type { WalletActions, WalletProviders } from './types.js';
import type { LegacyWallet as Wallet } from '@arlert-dev/wallets-core/legacy';
import type { WalletConfig, WalletType } from '@arlert-dev/wallets-shared';

import { LastConnectedWalletsFromStorage } from '../hub/lastConnectedWallets.js';

import { LEGACY_LAST_CONNECTED_WALLETS } from './mod.js';

/*
 *If a wallet has multiple providers and one of them can be eagerly connected,
 *then the whole wallet will support it at that point and we try to connect to that wallet as usual in eagerConnect method.
 */
export async function autoConnect(
  wallets: WalletProviders,
  getWalletInstance: (wallet: {
    actions: WalletActions;
    config: WalletConfig;
  }) => Wallet<any>
) {
  const lastConnectedWalletsFromStorage = new LastConnectedWalletsFromStorage(
    LEGACY_LAST_CONNECTED_WALLETS
  );

  const lastConnectedWallets = lastConnectedWalletsFromStorage.list();
  const walletIds = Object.keys(lastConnectedWallets);

  if (walletIds.length) {
    const eagerConnectQueue: {
      walletType: WalletType;
      eagerConnect: () => Promise<any>;
    }[] = [];

    walletIds.forEach((walletType) => {
      const wallet = wallets.get(walletType);

      if (!!wallet) {
        const walletInstance = getWalletInstance(wallet);
        eagerConnectQueue.push({
          walletType,
          eagerConnect: walletInstance.eagerConnect.bind(walletInstance),
        });
      }
    });

    const result = await Promise.allSettled(
      eagerConnectQueue.map(async ({ eagerConnect }) => eagerConnect())
    );

    const walletsToRemoveFromPersistance: WalletType[] = [];
    result.forEach((settleResult, index) => {
      const { status } = settleResult;

      if (status === 'rejected') {
        walletsToRemoveFromPersistance.push(
          eagerConnectQueue[index].walletType
        );
      }
    });

    if (walletsToRemoveFromPersistance.length) {
      lastConnectedWalletsFromStorage.removeWallets(
        walletsToRemoveFromPersistance
      );
    }
  }
}
