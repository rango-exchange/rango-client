import type { StarknetActions } from '@rango-dev/wallets-core/namespaces/starknet';

import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import { actions, builders } from '@rango-dev/wallets-core/namespaces/starknet';

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
  .or(standardizeAndThrowError)
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
