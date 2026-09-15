import type { VersionedProviders } from '@hub3js/core/utils';

import { versions as binance } from '@rango-dev/provider-binance';
import { versions as bitget } from '@rango-dev/provider-bitget';
import { versions as braavos } from '@rango-dev/provider-braavos';
import { versions as brave } from '@rango-dev/provider-brave';
import { versions as coin98 } from '@rango-dev/provider-coin98';
import { versions as coinbase } from '@rango-dev/provider-coinbase';
import { versions as defaultInjected } from '@rango-dev/provider-default';
import { versions as enkrypt } from '@rango-dev/provider-enkrypt';
import { versions as exodus } from '@rango-dev/provider-exodus';
import { versions as freighter } from '@rango-dev/provider-freighter';
import { versions as gemwallet } from '@rango-dev/provider-gemwallet';
import { versions as ledger } from '@rango-dev/provider-ledger';
import { versions as ledgerWallet } from '@rango-dev/provider-ledger-wallet';
import { versions as mathwallet } from '@rango-dev/provider-math-wallet';
import { versions as metamask } from '@rango-dev/provider-metamask';
import { versions as noirWallet } from '@rango-dev/provider-noir-wallet';
import { versions as okx } from '@rango-dev/provider-okx';
import { versions as phantom } from '@rango-dev/provider-phantom';
import { versions as rabby } from '@rango-dev/provider-rabby';
import { versions as ready } from '@rango-dev/provider-ready';
import { versions as safe } from '@rango-dev/provider-safe';
import { versions as safepal } from '@rango-dev/provider-safepal';
import { versions as slush } from '@rango-dev/provider-slush';
import { versions as solflare } from '@rango-dev/provider-solflare';
import { versions as taho } from '@rango-dev/provider-taho';
import { versions as tokenPocket } from '@rango-dev/provider-tokenpocket';
import { versions as tomo } from '@rango-dev/provider-tomo';
import { versions as tonconnect } from '@rango-dev/provider-tonconnect';
import { versions as trezor } from '@rango-dev/provider-trezor';
import { versions as tronLink } from '@rango-dev/provider-tron-link';
import { versions as trustwallet } from '@rango-dev/provider-trustwallet';
import { versions as unisat } from '@rango-dev/provider-unisat';
import { versions as vultisig } from '@rango-dev/provider-vultisig';
import { versions as walletconnect2 } from '@rango-dev/provider-walletconnect-2';
import { versions as xverse } from '@rango-dev/provider-xverse';

export { WalletTypes } from './walletTypes.js';

export const allProviders = (): (() => VersionedProviders)[] => {
  return [
    safe,
    defaultInjected,
    metamask,
    walletconnect2,
    tonconnect,
    phantom,
    ready,
    trustwallet,
    tronLink,
    enkrypt,
    bitget,
    binance,
    xverse,
    safepal,
    brave,
    coin98,
    coinbase,
    freighter,
    exodus,
    mathwallet,
    okx,
    tokenPocket,
    tomo,
    taho,
    braavos,
    ledger,
    ledgerWallet,
    rabby,
    trezor,
    solflare,
    slush,
    unisat,
    vultisig,
    gemwallet,
    noirWallet,
  ];
};
