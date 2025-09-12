import type {
  StandardConnectFeature,
  StandardEventsFeature,
  SuiFeatures,
  WalletWithFeatures,
} from '@mysten/wallet-standard';

import { getWallets, SUI_MAINNET_CHAIN } from '@mysten/wallet-standard';
import { AccountId } from 'caip';

import { CAIP_NAMESPACE, CAIP_SUI_CHAIN_ID } from './constants.js';

// TODO: StandardFetures doesn't work, so we should add each feature separately
type SuiWalletStandard = WalletWithFeatures<
  StandardConnectFeature & StandardEventsFeature & SuiFeatures
>;

/**
 * @param name each wallet has a name in WalletStandard. you should pass that value
 */
export function getInstance(name: string): SuiWalletStandard | undefined {
  const wallet = getWallets()
    .get()
    .find(
      (wallet) =>
        wallet.name === name && wallet.chains.includes(SUI_MAINNET_CHAIN)
    );

  return wallet as SuiWalletStandard;
}

/**
 * @param name each wallet has a name in WalletStandard. you should pass that value
 */
export function getInstanceOrThrow(name: string): SuiWalletStandard {
  const wallet = getInstance(name);

  if (!wallet) {
    throw new Error(
      "We couldn't find the Sui instance on your wallet. It may be fixed by refreshing the page."
    );
  }

  return wallet;
}
export function formatAccountsToCAIP(accounts: readonly { address: string }[]) {
  return accounts.map((account) => {
    return AccountId.format({
      address: account.address,
      chainId: {
        namespace: CAIP_NAMESPACE,
        reference: CAIP_SUI_CHAIN_ID,
      },
    });
  });
}
