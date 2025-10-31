import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import {
  ActionBuilder,
  type Context,
  NamespaceBuilder,
} from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  connectAndUpdateStateForMultiNetworks,
  intoConnecting,
  intoConnectionFinished,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  actions,
  builders,
  utils,
} from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmMetamask } from '../utils.js';

type Token = {
  address: string;
  symbol: string;
  decimals: number;
  image: string;
};

type MetamaskActions = EvmActions & {
  watchAsset: (token: Token) => Promise<boolean>;
};

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(evmMetamask)
  /*
   * Metamask returns an array of connected accounts with the active one first.
   * Since we only need the active account, we take the first element as a workaround.
   */
  .format(async (instance, accounts) => {
    const chainId = await instance.request({ method: 'eth_chainId' });
    return utils.formatAccountsToCAIP([accounts[0]], chainId);
  })
  .build();

const connect = new ActionBuilder<MetamaskActions, 'connect'>('connect')
  .action(actions.connect(evmMetamask))
  /*
   * Metamask Wallet's `connect` returns a list where the currently selected account
   * is always the first item. We're directly taking this first item as the active account.
   *
   * ***NOTE***: Please keep it synced with `wallets/core/src/namespaces/solana/builders.ts`.
   *
   */
  .and((_, connectResult) => ({
    ...connectResult,
    accounts: [connectResult.accounts[0]],
  }))
  .and(connectAndUpdateStateForMultiNetworks)
  .before(intoConnecting)
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .after(intoConnectionFinished)
  .build();

const canEagerConnect = new ActionBuilder<MetamaskActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(actions.canEagerConnect(evmMetamask))
  .build();

const disconnect = commonBuilders
  .disconnect<MetamaskActions>()
  .after(changeAccountCleanup)
  .build();

const canSwitchNetwork = new ActionBuilder<MetamaskActions, 'canSwitchNetwork'>(
  'canSwitchNetwork'
)
  .action(actions.canSwitchNetwork())
  .build();

const getChainId = new ActionBuilder<MetamaskActions, 'getChainId'>(
  'getChainId'
)
  .action(actions.getChainId(evmMetamask))
  .build();

/*
 * Requests that the user track the specified token in MetaMask.
 * Returns a boolean indicating if the token was successfully added.
 * @link https://docs.metamask.io/wallet/reference/json-rpc-methods/wallet_watchasset
 */
const watchAsset = new ActionBuilder<MetamaskActions, 'watchAsset'>(
  'watchAsset'
)
  .action(async (_context: Context<MetamaskActions>, token: Token) => {
    const instance = evmMetamask();
    const isAdded = await instance.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.image,
        },
      },
    });
    return isAdded;
  })
  .build();

const evm = new NamespaceBuilder<MetamaskActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canSwitchNetwork)
  .action(canEagerConnect)
  .action(getChainId)
  .action(watchAsset)
  .build();

export { evm };
