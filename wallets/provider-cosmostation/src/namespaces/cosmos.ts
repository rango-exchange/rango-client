import { keplrCosmosActions } from '@rango-dev/provider-keplr/lib';
import { ActionBuilder, NamespaceBuilder } from '@rango-dev/wallets-core';
import {
  builders as commonBuilders,
  standardizeAndThrowError,
} from '@rango-dev/wallets-core/namespaces/common';
import {
  builders,
  type CosmosActions,
} from '@rango-dev/wallets-core/namespaces/cosmos';

import { cosmosActions } from '../actions/cosmos.js';
import { WALLET_ID } from '../constants.js';
import { cosmosCosmostation } from '../utils.js';

const connect = builders
  .connect()
  .action(keplrCosmosActions.connect(cosmosCosmostation))
  .or(standardizeAndThrowError)

  .build();

const suggest = new ActionBuilder<CosmosActions, 'suggest'>('suggest')
  .action(keplrCosmosActions.suggest(cosmosCosmostation))
  .or(standardizeAndThrowError)
  .build();

const canEagerConnect = new ActionBuilder<CosmosActions, 'canEagerConnect'>(
  'canEagerConnect'
)
  .action(cosmosActions.canEagerConnect)
  .build();

const disconnect = commonBuilders.disconnect<CosmosActions>().build();

const cosmos = new NamespaceBuilder<CosmosActions>('Cosmos', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(suggest)
  .action(canEagerConnect)
  .build();

export { cosmos };
