import type { EvmActions } from '@rango-dev/wallets-core/namespaces/evm';

import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  connectAndUpdateStateForMultiNetworks,
  intoConnecting,
  intoConnectionFinished,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/evm';

import { WALLET_ID } from '../constants.js';
import { evmSafepal, isValidEvmAddress } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(evmSafepal)
  .build();

/**
 * Important: Keep this implementation in sync with wallets/core/src/namespaces/evm/builders
 */
const connect = new ActionBuilder<EvmActions, 'connect'>('connect')
  .action(actions.connect(evmSafepal))
  .before(changeAccountSubscriber)
  .before(intoConnecting)
  /*
   * Validate all accounts are valid EVM addresses
   * Sometimes wallets may return non-EVM addresses - this check prevents that
   */
  .and((_, args) => {
    if (args.accounts.some((account: string) => !isValidEvmAddress(account))) {
      throw new Error('Non valid EVM address returned from wallet');
    }

    return args;
  })
  .and(connectAndUpdateStateForMultiNetworks)
  .after(intoConnectionFinished)
  .or(changeAccountCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<EvmActions>()
  .after(changeAccountCleanup)
  .build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  .action(actions.canSwitchNetwork())
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmSafepal))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canSwitchNetwork)
  .action(getChainId)
  .build();

export { evm };
