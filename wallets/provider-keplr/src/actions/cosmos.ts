import type { Context, FunctionWithContext } from '@rango-dev/wallets-core';

import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import {
  type CosmosActions,
  type ProviderAPI,
  utils,
} from '@rango-dev/wallets-core/namespaces/cosmos';

import { getCosmosAccounts } from '../utils.js';

function connect(
  instance: () => ProviderAPI
): FunctionWithContext<CosmosActions['connect'], Context> {
  return async (context, options) => {
    // Setting connect args to be used on other actions
    const [, setState] = context.state();
    setState('connectArgs', { options });
    const cosmosInstance = instance();
    if (!cosmosInstance) {
      throw new Error(
        'Do your wallet injected correctly and is cosmos compatible?'
      );
    }
    if (!options?.chainIds) {
      throw new Error(
        'Passing chainIds meta to the connect options is mandatory'
      );
    }

    const providerAccounts = await getCosmosAccounts(
      cosmosInstance,
      options.chainIds,
      options.customChainIds
    );
    return utils.formatAccountsToCAIP(providerAccounts);
  };
}
function suggest(
  instance: () => ProviderAPI
): FunctionWithContext<CosmosActions['suggest'], Context> {
  return async (_context, chain, assetList) => {
    const cosmosInstance = instance();
    if (!cosmosInstance) {
      throw new Error(
        'Is your wallet injected correctly and cosmos compatible?'
      );
    }
    const experimentalChain = chainRegistryChainToKeplr(chain, [assetList]);
    return await cosmosInstance.experimentalSuggestChain(experimentalChain);
  };
}
export const cosmosActions = { connect, suggest };
