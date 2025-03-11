import type {
  StandardConnectFeature,
  StandardEventsFeature,
  SuiFeatures,
  WalletWithFeatures,
} from '@mysten/wallet-standard';

import { getWallets, SUI_MAINNET_CHAIN } from '@mysten/wallet-standard';

// TODO: StandardFetures doesn't work, so we should add each feature separately
type SuiWalletStandard = WalletWithFeatures<
  StandardConnectFeature & StandardEventsFeature & SuiFeatures
>;

/**
 * @param name each wallet has a name in WalletStandard. you should pass that value
 */
export function getInstanceOrThrow(name: string): SuiWalletStandard {
  const wallet = getWallets()
    .get()
    .find(
      (wallet) =>
        wallet.name === name && wallet.chains.includes(SUI_MAINNET_CHAIN)
    );

  if (!wallet) {
    throw new Error(
      "We couldn't find the Sui instance on your wallet. It may be fixed by refreshing the page."
    );
  }

  return wallet as SuiWalletStandard;
}
