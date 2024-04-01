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
import * as mathwallet from '@rango-dev/provider-math-wallet';
import * as metamask from '@rango-dev/provider-metamask';
import * as okx from '@rango-dev/provider-okx';
import { versions as phantom } from '@rango-dev/provider-phantom';
import * as safe from '@rango-dev/provider-safe';
import * as safepal from '@rango-dev/provider-safepal';
import * as taho from '@rango-dev/provider-taho';
import * as tokenpocket from '@rango-dev/provider-tokenpocket';
import * as tronLink from '@rango-dev/provider-tron-link';
import * as trustwallet from '@rango-dev/provider-trustwallet';
import * as walletconnect2 from '@rango-dev/provider-walletconnect-2';
import * as xdefi from '@rango-dev/provider-xdefi';
import {
  legacyProviderImportsToVersionsInterface,
  type Versions,
  type VLegacy,
} from '@rango-dev/wallets-core';

type Enviroments = Record<string, Record<string, string>>;

export const allProviders = (enviroments?: Enviroments): Versions[] => {
  walletconnect2.init(enviroments?.walletconnect2 || {});

  return [
    legacyProviderImportsToVersionsInterface(safe satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(defaultInjected satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(metamask satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(walletconnect2 satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(keplr satisfies VLegacy),
    phantom,
    legacyProviderImportsToVersionsInterface(argentx satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(tronLink satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(trustwallet satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(bitget satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(enkrypt satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(xdefi satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(clover satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(safepal satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(brave satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(coin98 satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(coinbase satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(cosmostation satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(exodus satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(mathwallet satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(okx satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(tokenpocket satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(halo satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(leapCosmos satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(frontier satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(taho satisfies VLegacy),
    legacyProviderImportsToVersionsInterface(braavos satisfies VLegacy),
  ];
};
