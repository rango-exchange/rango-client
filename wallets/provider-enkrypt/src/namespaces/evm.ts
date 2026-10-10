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
import { evmEnkrypt } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(evmEnkrypt);
const connect = builders
  .connect()
  .action(actions.connect(evmEnkrypt))
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
  .action(actions.canEagerConnect(evmEnkrypt))
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmEnkrypt))
  .build();

const getAllowance = builders
  .getAllowance()
  .action(actions.getAllowance(evmEnkrypt))
  .build();

const getTransactionReceipt = builders
  .getTransactionReceipt()
  .action(actions.getTransactionReceipt(evmEnkrypt))
  .build();

const waitForTransactionReceipt = builders
  .waitForTransactionReceipt()
  .action(actions.waitForTransactionReceipt(evmEnkrypt))
  .build();

const buildEvm = (rpcUrl: string) =>
  new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
    .action(connect)
    .action(disconnect)
    .action(canEagerConnect)
    .action(canSwitchNetwork)
    .action(getChainId)
    .action(getAllowance)
    .action(getTransactionReceipt)
    .action(waitForTransactionReceipt)
    .action(viemWalletAdapter(evmEnkrypt))
    .action(viemPublicAdapter(rpcUrl))
    .build();

export { buildEvm };
