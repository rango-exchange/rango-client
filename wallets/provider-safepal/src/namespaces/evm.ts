import type { EvmActions } from '@hub3js/evm';

import { ActionBuilder, NamespaceBuilder } from '@hub3js/core';
import { actions, builders } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import {
  connectAndUpdateStateForMultiNetworks,
  intoConnecting,
  intoConnectionFinished,
  standardizeAndThrowError,
} from '@hub3js/std/operators';

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
