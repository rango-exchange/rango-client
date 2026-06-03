import type { EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { evmExodus } from '../utils.js';

const connect = builders
  .connect()
  .action(actions.connect(evmExodus))
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders.disconnect<EvmActions>().build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  .action(actions.canSwitchNetwork())
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmExodus))
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmExodus))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .action(getChainId)
  .action(canSwitchNetwork)
  .build();

export { evm };
