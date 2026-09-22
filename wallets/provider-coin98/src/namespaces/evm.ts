import type { EvmActions } from '@hub3js/evm';

import { NamespaceBuilder } from '@hub3js/core';
import { actions, builders } from '@hub3js/evm';
import { EVM_NAMESPACE } from '@hub3js/namespaces';
import * as commonBuilders from '@hub3js/std/builders';
import { throwConnectionError } from '@hub3js/std/operators';

import { WALLET_ID } from '../constants.js';
import { evmCoin98 } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = builders
  .changeAccountSubscriber(evmCoin98)
  .build();

const connect = builders
  .connect()
  .action(actions.connect(evmCoin98))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(throwConnectionError({ walletType: WALLET_ID, namespace: EVM_NAMESPACE }))
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
  .action(actions.getChainId(evmCoin98))
  .build();

const evm = new NamespaceBuilder<EvmActions>('EVM', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canSwitchNetwork)
  .action(getChainId)
  .build();

export { evm };
