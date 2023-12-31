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
import * as phantom from '@rango-dev/provider-phantom';
import * as safe from '@rango-dev/provider-safe';
import * as safepal from '@rango-dev/provider-safepal';
import * as taho from '@rango-dev/provider-taho';
import * as tokenpocket from '@rango-dev/provider-tokenpocket';
import * as tronLink from '@rango-dev/provider-tron-link';
import * as trustwallet from '@rango-dev/provider-trustwallet';
import * as walletconnect2 from '@rango-dev/provider-walletconnect-2';
import * as xdefi from '@rango-dev/provider-xdefi';

type Enviroments = Record<string, Record<string, string>>;

export const allProviders = (enviroments?: Enviroments) => {
  walletconnect2.init(enviroments?.walletconnect2 || {});

  return [
    safe,
    defaultInjected,
    metamask,
    walletconnect2,
    keplr,
    phantom,
    argentx,
    tronLink,
    trustwallet,
    bitget,
    enkrypt,
    xdefi,
    clover,
    safepal,
    brave,
    coin98,
    coinbase,
    cosmostation,
    exodus,
    mathwallet,
    okx,
    tokenpocket,
    halo,
    leapCosmos,
    frontier,
    taho,
    braavos,
  ];
};
