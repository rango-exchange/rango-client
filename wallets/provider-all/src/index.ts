import type { Environments as TonConnectEnvironments } from '@rango-dev/provider-tonconnect';
import type { Environments as TrezorEnvironments } from '@rango-dev/provider-trezor';
import type { Environments as WalletConnectEnvironments } from '@rango-dev/provider-walletconnect-2';
import type { ProviderInterface } from '@rango-dev/wallets-react';

import * as argentx from '@rango-dev/provider-argentx';
import * as bitget from '@rango-dev/provider-bitget';
import * as braavos from '@rango-dev/provider-braavos';
import * as brave from '@rango-dev/provider-brave';
import * as clover from '@rango-dev/provider-clover';
import * as coin98 from '@rango-dev/provider-coin98';
import * as coinbase from '@rango-dev/provider-coinbase';
import * as cosmostation from '@rango-dev/provider-cosmostation';
import * as defaultInjected from '@rango-dev/provider-default';
import * as enkrypt from '@rango-dev/provider-enkrypt';
import * as exodus from '@rango-dev/provider-exodus';
import * as frontier from '@rango-dev/provider-frontier';
import * as halo from '@rango-dev/provider-halo';
import * as keplr from '@rango-dev/provider-keplr';
import * as leapCosmos from '@rango-dev/provider-leap-cosmos';
import * as ledger from '@rango-dev/provider-ledger';
import * as mathwallet from '@rango-dev/provider-math-wallet';
import * as metamask from '@rango-dev/provider-metamask';
import * as mytonwallet from '@rango-dev/provider-mytonwallet';
import * as okx from '@rango-dev/provider-okx';
import { versions as phantom } from '@rango-dev/provider-phantom';
import { versions as pontem } from '@rango-dev/provider-pontem';
import * as rabby from '@rango-dev/provider-rabby';
import * as safe from '@rango-dev/provider-safe';
import * as safepal from '@rango-dev/provider-safepal';
import * as solflare from '@rango-dev/provider-solflare';
import * as solflareSnap from '@rango-dev/provider-solflare-snap';
import * as taho from '@rango-dev/provider-taho';
import * as tokenpocket from '@rango-dev/provider-tokenpocket';
import * as tomo from '@rango-dev/provider-tomo';
import * as tonconnect from '@rango-dev/provider-tonconnect';
import * as trezor from '@rango-dev/provider-trezor';
import * as tronLink from '@rango-dev/provider-tron-link';
import * as trustwallet from '@rango-dev/provider-trustwallet';
import * as walletconnect2 from '@rango-dev/provider-walletconnect-2';
import * as xdefi from '@rango-dev/provider-xdefi';
import {
  legacyProviderImportsToVersionsInterface,
  type VersionedProviders,
} from '@rango-dev/wallets-core/utils';
import { type WalletType, WalletTypes } from '@rango-dev/wallets-shared';

import { isWalletExcluded } from './helpers.js';

interface Options {
  walletconnect2: WalletConnectEnvironments;
  selectedProviders?: (WalletType | ProviderInterface)[];
  trezor?: TrezorEnvironments;
  tonConnect?: TonConnectEnvironments;
}

export const allProviders = (options?: Options): VersionedProviders[] => {
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
      type: WalletTypes.MY_TON_WALLET,
      name: 'mytonwallet',
    })
  ) {
    if (!!options?.tonConnect?.manifestUrl) {
      mytonwallet.init(options.tonConnect);
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
    legacyProviderImportsToVersionsInterface(safe),
    legacyProviderImportsToVersionsInterface(defaultInjected),
    legacyProviderImportsToVersionsInterface(metamask),
    legacyProviderImportsToVersionsInterface(solflareSnap),
    legacyProviderImportsToVersionsInterface(walletconnect2),
    legacyProviderImportsToVersionsInterface(tonconnect),
    legacyProviderImportsToVersionsInterface(keplr),
    phantom,
    pontem,
    legacyProviderImportsToVersionsInterface(argentx),
    legacyProviderImportsToVersionsInterface(tronLink),
    legacyProviderImportsToVersionsInterface(trustwallet),
    legacyProviderImportsToVersionsInterface(bitget),
    legacyProviderImportsToVersionsInterface(enkrypt),
    legacyProviderImportsToVersionsInterface(xdefi),
    legacyProviderImportsToVersionsInterface(clover),
    legacyProviderImportsToVersionsInterface(safepal),
    legacyProviderImportsToVersionsInterface(brave),
    legacyProviderImportsToVersionsInterface(coin98),
    legacyProviderImportsToVersionsInterface(coinbase),
    legacyProviderImportsToVersionsInterface(cosmostation),
    legacyProviderImportsToVersionsInterface(exodus),
    legacyProviderImportsToVersionsInterface(mathwallet),
    legacyProviderImportsToVersionsInterface(okx),
    legacyProviderImportsToVersionsInterface(tokenpocket),
    legacyProviderImportsToVersionsInterface(tomo),
    legacyProviderImportsToVersionsInterface(halo),
    legacyProviderImportsToVersionsInterface(leapCosmos),
    legacyProviderImportsToVersionsInterface(frontier),
    legacyProviderImportsToVersionsInterface(taho),
    legacyProviderImportsToVersionsInterface(braavos),
    legacyProviderImportsToVersionsInterface(ledger),
    legacyProviderImportsToVersionsInterface(rabby),
    legacyProviderImportsToVersionsInterface(trezor),
    legacyProviderImportsToVersionsInterface(solflare),
    legacyProviderImportsToVersionsInterface(mytonwallet),
  ];
};
