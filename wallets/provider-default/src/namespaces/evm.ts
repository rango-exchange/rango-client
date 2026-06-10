import type { EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders, hooks } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import {
  intoConnectionFinished,
  standardizeAndThrowError,
} from '@hub3js/std/operators';
import { intoConnecting } from '@rango-dev/wallets-core/namespaces/common';

import { WALLET_ID } from '../constants.js';
import { evmDefault } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(evmDefault);

const connect = builders
  .connect()
  .action(actions.connect(evmDefault))
  .before(intoConnecting)
  .before(changeAccountSubscriber)
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

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmDefault))
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmDefault))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .action(canSwitchNetwork)
  .action(getChainId)
  .build();

export { evm };
