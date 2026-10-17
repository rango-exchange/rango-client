import type { EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders, hooks } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { evmBrave } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(evmBrave);
const connect = builders
  .connect()
  .action(actions.connect(evmBrave))
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
  .action(actions.canEagerConnect(evmBrave))
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmBrave))
  .build();

const getAllowance = builders
  .getAllowance()
  .action(actions.getAllowance(evmBrave))
  .build();

const getTransactionReceipt = builders
  .getTransactionReceipt()
  .action(actions.getTransactionReceipt(evmBrave))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .action(canSwitchNetwork)
  .action(getChainId)
  .action(getAllowance)
  .action(getTransactionReceipt)
  .build();

export { evm };
