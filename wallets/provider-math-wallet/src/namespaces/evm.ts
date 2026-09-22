import type { EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders } from '@hub3js/evm';
import { EVM_NAMESPACE } from '@hub3js/namespaces';
import * as commonBuilders from '@hub3js/std/builders';
import { throwConnectionError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { evmMathWallet } from '../utils.js';

const connect = builders
  .connect()
  .action(actions.connect(evmMathWallet))
  .or(throwConnectionError({ walletType: WALLET_ID, namespace: EVM_NAMESPACE }))
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(evmMathWallet))
  .build();

const disconnect = commonBuilders.disconnect<EvmActions>().build();

const canSwitchNetwork = builders
  .canSwitchNetwork()
  // Math wallet doesn't support switch network.
  .action(() => false)
  .build();

const getChainId = builders
  .getChainId()
  .action(actions.getChainId(evmMathWallet))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canSwitchNetwork)
  .action(canEagerConnect)
  .action(getChainId)
  .build();

export { evm };
