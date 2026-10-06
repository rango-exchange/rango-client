import type { EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import {
  actions,
  builders,
  hooks,
  viemPublicAdapter,
  viemWalletAdapter,
} from '@hub3js/evm';
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

const getAllowance = builders
  .getAllowance()
  .action(actions.getAllowance(evmBitget))
  .build();

const getTransactionReceipt = builders
  .getTransactionReceipt()
  .action(actions.getTransactionReceipt(evmBitget))
  .build();

const waitForTransactionReceipt = builders
  .waitForTransactionReceipt()
  .action(actions.waitForTransactionReceipt(evmBitget))
  .build();

const buildEvm = (rpcUrl: string) =>
  new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
    .action(connect)
    .action(disconnect)
    .action(getChainId)
    .action(canEagerConnect)
    .action(canSwitchNetwork)
    .action(getAllowance)
    .action(getTransactionReceipt)
    .action(waitForTransactionReceipt)
    .action(viemWalletAdapter(evmBitget))
    .action(viemPublicAdapter(rpcUrl))
    .build();

export { buildEvm };
