import type { Environments as TonConnectEnvironments } from '@rango-dev/provider-tonconnect';
import type { Environments as TrezorEnvironments } from '@rango-dev/provider-trezor';
import type { Environments as WalletConnectEnvironments } from '@rango-dev/provider-walletconnect-2';
import type { Provider } from '@rango-dev/wallets-core';
import type { ProviderInterface } from '@rango-dev/wallets-react';

import * as bitget from '@rango-dev/provider-bitget';
import * as braavos from '@rango-dev/provider-braavos';
import * as brave from '@rango-dev/provider-brave';
import * as clover from '@rango-dev/provider-clover';
import * as coin98 from '@rango-dev/provider-coin98';
import { versions as coinbase } from '@rango-dev/provider-coinbase';
import * as cosmostation from '@rango-dev/provider-cosmostation';
import * as defaultInjected from '@rango-dev/provider-default';
import * as enkrypt from '@rango-dev/provider-enkrypt';
import * as exodus from '@rango-dev/provider-exodus';
import * as frontier from '@rango-dev/provider-frontier';
import * as halo from '@rango-dev/provider-halo';
import * as keplr from '@rango-dev/provider-keplr';
import * as leapCosmos from '@rango-dev/provider-leap-cosmos';
import { versions as ledger } from '@rango-dev/provider-ledger';
import * as mathwallet from '@rango-dev/provider-math-wallet';
import { versions as metamask } from '@rango-dev/provider-metamask';
import { versions as okx } from '@rango-dev/provider-okx';
import { versions as phantom } from '@rango-dev/provider-phantom';
import { versions as rabby } from '@rango-dev/provider-rabby';
import * as ready from '@rango-dev/provider-ready';
import * as safe from '@rango-dev/provider-safe';
import { versions as safepal } from '@rango-dev/provider-safepal';
import { versions as slush } from '@rango-dev/provider-slush';
import * as solflare from '@rango-dev/provider-solflare';
import * as taho from '@rango-dev/provider-taho';
import * as tokenpocket from '@rango-dev/provider-tokenpocket';
import * as tomo from '@rango-dev/provider-tomo';
import * as tonconnect from '@rango-dev/provider-tonconnect';
import * as trezor from '@rango-dev/provider-trezor';
import * as tronLink from '@rango-dev/provider-tron-link';
import { versions as trustwallet } from '@rango-dev/provider-trustwallet';
import { versions as unisat } from '@rango-dev/provider-unisat';
import * as walletconnect2 from '@rango-dev/provider-walletconnect-2';
import * as xdefi from '@rango-dev/provider-xdefi';
import { versions as xverse } from '@rango-dev/provider-xverse';
import {
  legacyProviderImportsToVersionsInterface,
  type VersionedProviders,
} from '@rango-dev/wallets-core/utils';
import { type WalletType, WalletTypes } from '@rango-dev/wallets-shared';

import { isWalletExcluded, lazyProvider } from './helpers.js';

interface Options {
  walletconnect2: WalletConnectEnvironments;
  selectedProviders?: (WalletType | ProviderInterface | Provider)[];
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
    metamask,
    lazyProvider(legacyProviderImportsToVersionsInterface(walletconnect2)),
    lazyProvider(legacyProviderImportsToVersionsInterface(tonconnect)),
    lazyProvider(legacyProviderImportsToVersionsInterface(keplr)),
    phantom,
    lazyProvider(legacyProviderImportsToVersionsInterface(ready)),
    lazyProvider(legacyProviderImportsToVersionsInterface(tronLink)),
    trustwallet,
    lazyProvider(legacyProviderImportsToVersionsInterface(bitget)),
    lazyProvider(legacyProviderImportsToVersionsInterface(enkrypt)),
    lazyProvider(legacyProviderImportsToVersionsInterface(xdefi)),
    xverse,
    lazyProvider(legacyProviderImportsToVersionsInterface(clover)),
    safepal,
    lazyProvider(legacyProviderImportsToVersionsInterface(brave)),
    lazyProvider(legacyProviderImportsToVersionsInterface(coin98)),
    coinbase,
    lazyProvider(legacyProviderImportsToVersionsInterface(cosmostation)),
    lazyProvider(legacyProviderImportsToVersionsInterface(exodus)),
    lazyProvider(legacyProviderImportsToVersionsInterface(mathwallet)),
    okx,
    lazyProvider(legacyProviderImportsToVersionsInterface(tokenpocket)),
    lazyProvider(legacyProviderImportsToVersionsInterface(tomo)),
    lazyProvider(legacyProviderImportsToVersionsInterface(halo)),
    lazyProvider(legacyProviderImportsToVersionsInterface(leapCosmos)),
    lazyProvider(legacyProviderImportsToVersionsInterface(frontier)),
    lazyProvider(legacyProviderImportsToVersionsInterface(taho)),
    lazyProvider(legacyProviderImportsToVersionsInterface(braavos)),
    ledger,
    rabby,
    lazyProvider(legacyProviderImportsToVersionsInterface(trezor)),
    lazyProvider(legacyProviderImportsToVersionsInterface(solflare)),
    slush,
    unisat,
  ];
};
