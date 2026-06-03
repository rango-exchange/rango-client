import type { EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders, hooks } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { evmBitget } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(evmBitget);
const connect = builders
  .connect()
  .action(actions.connect(evmBitget))
  .before(changeAccountSubscriber)
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

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmBitget))
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmBitget))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(getChainId)
  .action(canEagerConnect)
  .action(canSwitchNetwork)
  .build();

export { evm };
