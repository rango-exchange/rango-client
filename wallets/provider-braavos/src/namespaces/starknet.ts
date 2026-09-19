import type { StarknetActions } from '@hub3js/starknet';

import { NamespaceBuilder } from '@hub3js/core';
import { STARKNET_NAMESPACE } from '@hub3js/namespaces';
import { actions, builders } from '@hub3js/starknet';
import * as commonBuilders from '@hub3js/std/builders';
import { throwWalletConnectionError } from '@hub3js/std/operators';

import { starknetActions } from '../actions/starknet.js';
import { starknetBuilders } from '../builders/starknet.js';
import { WALLET_ID } from '../constants.js';
import { starknetBraavos } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = starknetBuilders
  .changeAccountSubscriber(starknetBraavos)
  .build();
const connect = builders
  .connect()
  .action(starknetActions.connect(starknetBraavos))
  .before(changeAccountSubscriber)
  .or(changeAccountCleanup)
  .or(throwWalletConnectionError(STARKNET_NAMESPACE))
  .build();

const disconnect = commonBuilders
  .disconnect<StarknetActions>()
  .after(changeAccountCleanup)
  .build();

const canEagerConnect = builders
  .canEagerConnect()
  .action(actions.canEagerConnect(starknetBraavos))
  .build();

const starknet = new NamespaceBuilder<StarknetActions>('Starknet', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { starknet };
