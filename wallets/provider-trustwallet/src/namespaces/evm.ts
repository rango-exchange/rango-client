import type { EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders, hooks } from '@hub3js/evm';
import * as commonBuilders from '@hub3js/std/builders';

import { WALLET_ID } from '../constants.js';
import { commonHooks } from '../hooks/common.js';
import { evmTrustWallet } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber(evmTrustWallet);

const connect = builders
  .connect()
  .action(actions.connect(evmTrustWallet))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(commonHooks.reclassifyTrustWalletConnectionError)
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
  .action(actions.getChainId(evmTrustWallet))
  .build();

const getAllowance = builders
  .getAllowance()
  .action(actions.getAllowance(evmTrustWallet))
  .build();

const getTransactionReceipt = builders
  .getTransactionReceipt()
  .action(actions.getTransactionReceipt(evmTrustWallet))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canSwitchNetwork)
  .action(getChainId)
  .action(getAllowance)
  .action(getTransactionReceipt)
  .build();

export { evm };
