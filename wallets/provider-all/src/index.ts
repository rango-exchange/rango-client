import type { Environments as TonConnectEnvironments } from '@arlert-dev/provider-tonconnect';
import type { Environments as TrezorEnvironments } from '@arlert-dev/provider-trezor';
import type { Environments as WalletConnectEnvironments } from '@arlert-dev/provider-walletconnect-2';
import type { ProviderInterface } from '@arlert-dev/wallets-react';

import * as argentx from '@arlert-dev/provider-argentx';
import * as bitget from '@arlert-dev/provider-bitget';
import * as braavos from '@arlert-dev/provider-braavos';
import * as brave from '@arlert-dev/provider-brave';
import * as clover from '@arlert-dev/provider-clover';
import * as coin98 from '@arlert-dev/provider-coin98';
import * as coinbase from '@arlert-dev/provider-coinbase';
import * as cosmostation from '@arlert-dev/provider-cosmostation';
import * as defaultInjected from '@arlert-dev/provider-default';
import * as enkrypt from '@arlert-dev/provider-enkrypt';
import * as exodus from '@arlert-dev/provider-exodus';
import * as frontier from '@arlert-dev/provider-frontier';
import * as halo from '@arlert-dev/provider-halo';
import * as keplr from '@arlert-dev/provider-keplr';
import * as leapCosmos from '@arlert-dev/provider-leap-cosmos';
import * as ledger from '@arlert-dev/provider-ledger';
import * as mathwallet from '@arlert-dev/provider-math-wallet';
import * as metamask from '@arlert-dev/provider-metamask';
import * as okx from '@arlert-dev/provider-okx';
import { versions as phantom } from '@arlert-dev/provider-phantom';
import { versions as rabby } from '@arlert-dev/provider-rabby';
import * as safe from '@arlert-dev/provider-safe';
import * as safepal from '@arlert-dev/provider-safepal';
import { versions as slush } from '@arlert-dev/provider-slush';
import * as solflare from '@arlert-dev/provider-solflare';
import * as taho from '@arlert-dev/provider-taho';
import * as tokenpocket from '@arlert-dev/provider-tokenpocket';
import * as tomo from '@arlert-dev/provider-tomo';
import * as tonconnect from '@arlert-dev/provider-tonconnect';
import * as trezor from '@arlert-dev/provider-trezor';
import * as tronLink from '@arlert-dev/provider-tron-link';
import { versions as trustwallet } from '@arlert-dev/provider-trustwallet';
import { versions as unisat } from '@arlert-dev/provider-unisat';
import * as walletconnect2 from '@arlert-dev/provider-walletconnect-2';
import * as xdefi from '@arlert-dev/provider-xdefi';
import {
  legacyProviderImportsToVersionsInterface,
  type VersionedProviders,
} from '@arlert-dev/wallets-core/utils';
import { type WalletType, WalletTypes } from '@arlert-dev/wallets-shared';

import { isWalletExcluded, lazyProvider } from './helpers.js';

interface Options {
  walletconnect2: WalletConnectEnvironments;
  selectedProviders?: (WalletType | ProviderInterface)[];
  trezor?: TrezorEnvironments;
  tonConnect?: TonConnectEnvironments;
}

export const allProviders = (
  options?: Options
): (() => VersionedProviders)[] => {
  const providers = options?.selectedProviders || [];

  if (
    !isWalletExcluded(providers, {
      type: WalletTypes.WALLET_CONNECT_2,
      name: 'WalletConnect',
    })
  ) {
    if (!!options?.walletconnect2?.WC_PROJECT_ID) {
      walletconnect2.init(options.walletconnect2);
    } else {
      throw new Error(
        'WalletConnect has been included in your providers. Passing a Project ID is required. Make sure you are passing "WC_PROJECT_ID".'
      );
    }
  }

  if (
    !isWalletExcluded(providers, {
      type: WalletTypes.TREZOR,
      name: 'Trezor',
    })
  ) {
    if (!!options?.trezor?.manifest) {
      trezor.init(options.trezor);
    }
  }

  if (
    !isWalletExcluded(providers, {
      type: WalletTypes.TON_CONNECT,
      name: 'tonconnect',
    })
  ) {
    if (!!options?.tonConnect?.manifestUrl) {
      tonconnect.init(options.tonConnect);
    }
  }

  return [
    lazyProvider(legacyProviderImportsToVersionsInterface(safe)),
    lazyProvider(legacyProviderImportsToVersionsInterface(defaultInjected)),
    lazyProvider(legacyProviderImportsToVersionsInterface(metamask)),
    lazyProvider(legacyProviderImportsToVersionsInterface(walletconnect2)),
    lazyProvider(legacyProviderImportsToVersionsInterface(tonconnect)),
    lazyProvider(legacyProviderImportsToVersionsInterface(keplr)),
    phantom,
    lazyProvider(legacyProviderImportsToVersionsInterface(argentx)),
    lazyProvider(legacyProviderImportsToVersionsInterface(tronLink)),
    trustwallet,
    lazyProvider(legacyProviderImportsToVersionsInterface(bitget)),
    lazyProvider(legacyProviderImportsToVersionsInterface(enkrypt)),
    lazyProvider(legacyProviderImportsToVersionsInterface(xdefi)),
    lazyProvider(legacyProviderImportsToVersionsInterface(clover)),
    lazyProvider(legacyProviderImportsToVersionsInterface(safepal)),
    lazyProvider(legacyProviderImportsToVersionsInterface(brave)),
    lazyProvider(legacyProviderImportsToVersionsInterface(coin98)),
    lazyProvider(legacyProviderImportsToVersionsInterface(coinbase)),
    lazyProvider(legacyProviderImportsToVersionsInterface(cosmostation)),
    lazyProvider(legacyProviderImportsToVersionsInterface(exodus)),
    lazyProvider(legacyProviderImportsToVersionsInterface(mathwallet)),
    lazyProvider(legacyProviderImportsToVersionsInterface(okx)),
    lazyProvider(legacyProviderImportsToVersionsInterface(tokenpocket)),
    lazyProvider(legacyProviderImportsToVersionsInterface(tomo)),
    lazyProvider(legacyProviderImportsToVersionsInterface(halo)),
    lazyProvider(legacyProviderImportsToVersionsInterface(leapCosmos)),
    lazyProvider(legacyProviderImportsToVersionsInterface(frontier)),
    lazyProvider(legacyProviderImportsToVersionsInterface(taho)),
    lazyProvider(legacyProviderImportsToVersionsInterface(braavos)),
    lazyProvider(legacyProviderImportsToVersionsInterface(ledger)),
    rabby,
    lazyProvider(legacyProviderImportsToVersionsInterface(trezor)),
    lazyProvider(legacyProviderImportsToVersionsInterface(solflare)),
    slush,
    unisat,
  ];
};
