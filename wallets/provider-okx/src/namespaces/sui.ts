import type { SuiActions } from '@hub3js/sui';

import { NamespaceBuilder } from '@hub3js/core';
import * as commonBuilders from '@hub3js/std/builders';
import { standardizeAndThrowError } from '@hub3js/std/operators';
import { actions, builders, hooks } from '@hub3js/sui';

import { WALLET_ID, WALLET_NAME_IN_WALLET_STANDARD } from '../constants.js';
import { suiHooks } from '../hooks/sui.js';
import { suiWalletInstanceOrThrow } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] =
  hooks.changeAccountSubscriber({
    name: WALLET_NAME_IN_WALLET_STANDARD,
  });

const [disconnectSubscriber, disconnectCleanup] = suiHooks.disconnectSubscriber(
  suiWalletInstanceOrThrow
);

const canEagerConnect = builders
  .canEagerConnect()
  .action(
    actions.canEagerConnect({
      name: WALLET_NAME_IN_WALLET_STANDARD,
    })
  )
  .build();

const connect = builders
  .connect({
    name: WALLET_NAME_IN_WALLET_STANDARD,
  })
  .before(changeAccountSubscriber)
  .before(disconnectSubscriber)
  .or(changeAccountCleanup)
  .or(disconnectCleanup)
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<SuiActions>()
  .after(changeAccountCleanup)
  .after(disconnectCleanup)
  .build();

const sui = new NamespaceBuilder<SuiActions>('Sui', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(canEagerConnect)
  .build();

export { sui };
