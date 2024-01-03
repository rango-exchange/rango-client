import * as argentx from '@yeager-dev/provider-argentx';
import * as bitget from '@yeager-dev/provider-bitget';
import * as braavos from '@yeager-dev/provider-braavos';
import * as brave from '@yeager-dev/provider-brave';
import * as clover from '@yeager-dev/provider-clover';
import * as coin98 from '@yeager-dev/provider-coin98';
import * as coinbase from '@yeager-dev/provider-coinbase';
import * as cosmostation from '@yeager-dev/provider-cosmostation';
import * as defaultInjected from '@yeager-dev/provider-default';
import * as enkrypt from '@yeager-dev/provider-enkrypt';
import * as exodus from '@yeager-dev/provider-exodus';
import * as frontier from '@yeager-dev/provider-frontier';
import * as halo from '@yeager-dev/provider-halo';
import * as keplr from '@yeager-dev/provider-keplr';
import * as leapCosmos from '@yeager-dev/provider-leap-cosmos';
import * as mathwallet from '@yeager-dev/provider-math-wallet';
import * as metamask from '@yeager-dev/provider-metamask';
import * as okx from '@yeager-dev/provider-okx';
import * as phantom from '@yeager-dev/provider-phantom';
import * as safe from '@yeager-dev/provider-safe';
import * as safepal from '@yeager-dev/provider-safepal';
import * as taho from '@yeager-dev/provider-taho';
import * as tokenpocket from '@yeager-dev/provider-tokenpocket';
import * as tronLink from '@yeager-dev/provider-tron-link';
import * as trustwallet from '@yeager-dev/provider-trustwallet';
import * as walletconnect2 from '@yeager-dev/provider-walletconnect-2';
import * as xdefi from '@yeager-dev/provider-xdefi';

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
