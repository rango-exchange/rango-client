import {
  type StandardConnectFeature,
  type StandardDisconnectFeature,
  type StandardEventsFeature,
  type SuiFeatures,
  type WalletWithFeatures,
} from '@mysten/wallet-standard';
import { getInstanceOrThrow } from '@arlert-dev/wallets-core/namespaces/sui';

import { WALLET_NAME_IN_WALLET_STANDARD } from './constants.js';

type SuiWalletStandard = WalletWithFeatures<
  StandardConnectFeature &
    StandardEventsFeature &
    SuiFeatures &
    StandardDisconnectFeature
>;

export function suiWalletInstance(): SuiWalletStandard | null {
  try {
    return getInstanceOrThrow(
      WALLET_NAME_IN_WALLET_STANDARD
    ) as SuiWalletStandard;
  } catch {
    return null;
  }
}
