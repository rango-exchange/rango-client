import type { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import type { ProviderAPI as EvmProviderApi } from '@rango-dev/wallets-core/namespaces/evm';
import type { WalletWithFeatures as StandardWalletWithFeatures } from '@wallet-standard/base';

import {
  type SolanaSignMessageFeature,
  type SolanaSignTransactionFeature,
} from '@solana/wallet-standard-features';
import {
  type StandardConnectFeature,
  type StandardEventsFeature,
} from '@wallet-standard/features';

export type WalletStandardSolanaInstance = StandardWalletWithFeatures<
  StandardConnectFeature &
    StandardEventsFeature &
    SolanaSignTransactionFeature &
    SolanaSignMessageFeature
>;
export type MetamaskEvmProviderApi = EvmProviderApi & {
  isMetaMask?: boolean;
  isBraveWallet?: boolean;
  _events?: boolean;
  _state?: boolean;
  isApexWallet?: boolean;
  isAvalanche?: boolean;
  isBitKeep?: boolean;
  isBlockWallet?: boolean;
  isCoin98?: boolean;
  isFordefi?: boolean;
  __XDEFI?: boolean;
  isMathWallet?: boolean;
  isOkxWallet?: boolean;
  isOKExWallet?: boolean;
  isOneInchIOSWallet?: boolean;
  isOneInchAndroidWallet?: boolean;
  isOpera?: boolean;
  isPortal?: boolean;
  isRabby?: boolean;
  isDefiant?: boolean;
  isTokenPocket?: boolean;
  isTokenary?: boolean;
  isZeal?: boolean;
  isZerion?: boolean;
  isSafePal?: boolean;
};
export type ProviderObject = {
  [LegacyNetworks.ETHEREUM]: MetamaskEvmProviderApi;
  [LegacyNetworks.SOLANA]: WalletStandardSolanaInstance;
};
export type Provider = Map<
  keyof ProviderObject,
  ProviderObject[keyof ProviderObject]
>;
