import type { Environments as TonConnectEnvironments } from '@rango-dev/provider-tonconnect';
import type { Environments as TrezorEnvironments } from '@rango-dev/provider-trezor';
import type { Environments as WalletConnectEnvironments } from '@rango-dev/provider-walletconnect-2';
import type { Provider } from '@rango-dev/wallets-core';
import type { ProviderInterface } from '@rango-dev/wallets-react';

import { versions as binance } from '@rango-dev/provider-binance';
import { versions as bitget } from '@rango-dev/provider-bitget';
import { versions as braavos } from '@rango-dev/provider-braavos';
import { versions as brave } from '@rango-dev/provider-brave';
import * as coin98 from '@rango-dev/provider-coin98';
import { versions as coinbase } from '@rango-dev/provider-coinbase';
import { versions as cosmostation } from '@rango-dev/provider-cosmostation';
import * as defaultInjected from '@rango-dev/provider-default';
import { versions as enkrypt } from '@rango-dev/provider-enkrypt';
import { versions as exodus } from '@rango-dev/provider-exodus';
import { versions as keplr } from '@rango-dev/provider-keplr';
import { versions as leap } from '@rango-dev/provider-leap-cosmos';
import { versions as ledger } from '@rango-dev/provider-ledger';
import { versions as mathwallet } from '@rango-dev/provider-math-wallet';
import { versions as metamask } from '@rango-dev/provider-metamask';
import { versions as okx } from '@rango-dev/provider-okx';
import { versions as phantom } from '@rango-dev/provider-phantom';
import { versions as rabby } from '@rango-dev/provider-rabby';
import { versions as ready } from '@rango-dev/provider-ready';
import * as safe from '@rango-dev/provider-safe';
import { versions as safepal } from '@rango-dev/provider-safepal';
import { versions as slush } from '@rango-dev/provider-slush';
import { versions as solflare } from '@rango-dev/provider-solflare';
import { versions as taho } from '@rango-dev/provider-taho';
import { versions as tokenPocket } from '@rango-dev/provider-tokenpocket';
import { versions as tomo } from '@rango-dev/provider-tomo';
import { versions as tonconnect } from '@rango-dev/provider-tonconnect';
import * as trezor from '@rango-dev/provider-trezor';
import { versions as tronLink } from '@rango-dev/provider-tron-link';
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

  return [
    lazyProvider(legacyProviderImportsToVersionsInterface(safe)),
    lazyProvider(legacyProviderImportsToVersionsInterface(defaultInjected)),
    metamask,
    lazyProvider(legacyProviderImportsToVersionsInterface(walletconnect2)),
    tonconnect,
    keplr,
    phantom,
    ready,
    trustwallet,
    tronLink,
    enkrypt,
    bitget,
    binance,
    lazyProvider(legacyProviderImportsToVersionsInterface(xdefi)),
    xverse,
    safepal,
    brave,
    lazyProvider(legacyProviderImportsToVersionsInterface(coin98)),
    coinbase,
    cosmostation,
    exodus,
    mathwallet,
    okx,
    tokenPocket,
    tomo,
    leap,
    taho,
    braavos,
    ledger,
    rabby,
    lazyProvider(legacyProviderImportsToVersionsInterface(trezor)),
    solflare,
    slush,
    unisat,
  ];
};
