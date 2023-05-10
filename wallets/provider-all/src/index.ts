import * as binance from '@rango-dev/provider-binance-chain-wallet';
import * as xdefi from '@rango-dev/provider-xdefi';
import * as brave from '@rango-dev/provider-brave';
import * as clover from '@rango-dev/provider-clover';
import * as coin98 from '@rango-dev/provider-coin98';
import * as coinbase from '@rango-dev/provider-coinbase';
import * as cosmostation from '@rango-dev/provider-cosmostation';
import * as exodus from '@rango-dev/provider-exodus';
import * as keplr from '@rango-dev/provider-keplr';
import * as mathwallet from '@rango-dev/provider-math-wallet';
import * as metamask from '@rango-dev/provider-metamask';
import * as okx from '@rango-dev/provider-okx';
import * as phantom from '@rango-dev/provider-phantom';
import * as safepal from '@rango-dev/provider-safepal';
import * as tokenpocket from '@rango-dev/provider-tokenpocket';
import * as trustwallet from '@rango-dev/provider-trustwallet';
import * as walletconnect from '@rango-dev/provider-walletconnect';
import * as argentx from '@rango-dev/provider-argentx';
import * as tronLink from '@rango-dev/provider-tron-link';
import * as kucoin from '@rango-dev/provider-kucoin-wallet';
import * as leapCosmos from '@rango-dev/provider-leap-cosmos';
import * as frontier from '@rango-dev/provider-frontier';
import * as station from '@rango-dev/provider-station';
// import * as walletconnect2 from '@rango-dev/provider-walletconnect-2';

export const allProviders = () => [
  binance,
  xdefi,
  brave,
  clover,
  coin98,
  coinbase,
  cosmostation,
  exodus,
  keplr,
  mathwallet,
  metamask,
  okx,
  phantom,
  safepal,
  tokenpocket,
  trustwallet,
  walletconnect,
  argentx,
  tronLink,
  kucoin,
  leapCosmos,
  frontier,
  station,
  // walletconnect2
];
