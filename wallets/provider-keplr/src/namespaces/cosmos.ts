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
import { cosmosBuilders } from '../builders/cosmos.js';
import { WALLET_ID } from '../constants.js';
import { cosmosKeplr } from '../utils.js';

const [changeAccountSubscriber, changeAccountCleanup] = cosmosBuilders
  .changeAccountSubscriber(cosmosKeplr)
  .build();

const connect = builders
  .connect()
  .action(cosmosActions.connect(cosmosKeplr))
  .or(standardizeAndThrowError)
  .or(changeAccountCleanup)
  .before(changeAccountSubscriber)
  .build();

const suggest = new ActionBuilder<CosmosActions, 'suggest'>('suggest')
  .action(cosmosActions.suggest(cosmosKeplr))
  .or(standardizeAndThrowError)
  .build();

const disconnect = commonBuilders
  .disconnect<CosmosActions>()
  .before(changeAccountCleanup)
  .build();

const cosmos = new NamespaceBuilder<CosmosActions>('Cosmos', WALLET_ID)
  .action(connect)
  .action(disconnect)
  .action(suggest)
  .build();

export { cosmos };
