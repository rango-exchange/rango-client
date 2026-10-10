import type { Provider } from '@hub3js/core';
import type { NamespacesRPCUrls } from '@hub3js/namespaces';

import { buildProvider as binance } from '@rango-dev/provider-binance';
import { buildProvider as bitget } from '@rango-dev/provider-bitget';
import { buildProvider as braavos } from '@rango-dev/provider-braavos';
import { buildProvider as brave } from '@rango-dev/provider-brave';
import { buildProvider as coin98 } from '@rango-dev/provider-coin98';
import { buildProvider as coinbase } from '@rango-dev/provider-coinbase';
import { buildProvider as defaultInjected } from '@rango-dev/provider-default';
import { buildProvider as enkrypt } from '@rango-dev/provider-enkrypt';
import { buildProvider as exodus } from '@rango-dev/provider-exodus';
import { buildProvider as freighter } from '@rango-dev/provider-freighter';
import { buildProvider as gemwallet } from '@rango-dev/provider-gemwallet';
import { buildProvider as ledger } from '@rango-dev/provider-ledger';
import { buildProvider as ledgerWallet } from '@rango-dev/provider-ledger-wallet';
import { buildProvider as mathwallet } from '@rango-dev/provider-math-wallet';
import { buildProvider as metamask } from '@rango-dev/provider-metamask';
import { buildProvider as noirWallet } from '@rango-dev/provider-noir-wallet';
import { buildProvider as okx } from '@rango-dev/provider-okx';
import { buildProvider as phantom } from '@rango-dev/provider-phantom';
import { buildProvider as rabby } from '@rango-dev/provider-rabby';
import { buildProvider as ready } from '@rango-dev/provider-ready';
import { buildProvider as safe } from '@rango-dev/provider-safe';
import { buildProvider as safepal } from '@rango-dev/provider-safepal';
import { buildProvider as slush } from '@rango-dev/provider-slush';
import { buildProvider as solflare } from '@rango-dev/provider-solflare';
import { buildProvider as taho } from '@rango-dev/provider-taho';
import { buildProvider as tokenPocket } from '@rango-dev/provider-tokenpocket';
import { buildProvider as tomo } from '@rango-dev/provider-tomo';
import { buildProvider as tonconnect } from '@rango-dev/provider-tonconnect';
import { buildProvider as trezor } from '@rango-dev/provider-trezor';
import { buildProvider as tronLink } from '@rango-dev/provider-tron-link';
import { buildProvider as trustwallet } from '@rango-dev/provider-trustwallet';
import { buildProvider as unisat } from '@rango-dev/provider-unisat';
import { buildProvider as vultisig } from '@rango-dev/provider-vultisig';
import { buildProvider as walletconnect2 } from '@rango-dev/provider-walletconnect-2';
import { buildProvider as xverse } from '@rango-dev/provider-xverse';

export { WalletTypes } from './walletTypes.js';

/**
 * The RPC endpoints every provider is built with, declared once for all of
 * them. Namespaces read their own entry, e.g. the EVM namespace's public viem
 * actions go to `evm`.
 */
export const RPC_URLS: NamespacesRPCUrls = {
  evm: 'https://rpc.ankr.com/eth/8d43f5e842676d766141cb1943b9b4e12821f463665e180c209bd3dab9639df2',
};

// Providers register different namespaces, so the list is typed loosely instead of `Provider<unknown>`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BuildProvider = (rpcURLs: NamespacesRPCUrls) => Provider<any>;

export const allProviders = (): BuildProvider[] => {
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
