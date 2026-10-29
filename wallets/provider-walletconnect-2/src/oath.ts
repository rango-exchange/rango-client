import type { DirectConnectionUi, Environments } from './types.js';
import type { ProviderMetadata } from '@hub3js/core';

import { ProviderBuilder } from '@hub3js/core';
import { isEvmNamespace } from '@hub3js/evm';
import { ChainId } from 'caip';
import { isEvmBlockchain } from 'rango-types';

import { WalletConnectAdapter } from './adapter/adapter.js';
import { createEvmNamespace } from './namespaces/evm/namespace.js';
import { OATH_ICON } from './oath-icon.js';
import getSigners from './signer.js';
import { WC_STORAGE_PREFIX } from './wcConstants.js';

export const OATH_WALLET_ID = 'oath-wallet';
export const OATH_APP_STORE = 'https://apps.apple.com/app/id6780187283';
export { OATH_ICON };

/*
 * Oath's WalletConnect transaction policy: mainnet EVMSendNetwork entries,
 * excluding Arc's separate gas/signing path. Other namespaces are not advertised.
 */
export const OATH_EVM_CHAINS = new Set([
  '1',
  '42161',
  '43114',
  '8453',
  '56',
  '250',
  '14',
  '5031',
  '1514',
  '100',
  '59144',
  '10',
  '137',
  '88888',
  '42220',
  '143',
  '130',
  '999',
  '4663',
  '534352',
  '167000',
  '40',
  '196',
  '314',
  '1329',
  '16661',
  '4689',
]);

export const oathConnectionLink = (uri: string) =>
  `oathwallet://wc?uri=${encodeURIComponent(uri)}`;

export interface OathEnvironments extends Environments {
  DIRECT_CONNECTION_UI: DirectConnectionUi;
}

export function buildOathProvider() {
  let adapter: WalletConnectAdapter | undefined;
  const getAdapter = () => {
    if (!adapter) {
      throw new Error('Oath Wallet provider has not been initialized.');
    }
    return adapter;
  };
  const metadata: ProviderMetadata = {
    name: 'Oath Wallet',
    icon: OATH_ICON,
    extensions: { homepage: 'https://oathwallet.org/' },
    properties: [
      {
        name: 'namespaces',
        value: {
          selection: 'single',
          data: [
            {
              label: 'EVM',
              value: 'EVM',
              id: 'ETH',
              isChainSupported: (chain) =>
                isEvmNamespace(chain) &&
                OATH_EVM_CHAINS.has(ChainId.parse(chain).reference),
            },
          ],
        },
      },
      {
        name: 'signers',
        value: { getSigners: async () => getSigners(getAdapter()) },
      },
      { name: 'details', value: { mobileWallet: true, showOnMobile: true } },
    ],
  };
  return new ProviderBuilder(OATH_WALLET_ID)
    .init(function (context, environments: OathEnvironments) {
      if (!environments.WC_PROJECT_ID || !environments.DIRECT_CONNECTION_UI) {
        throw new Error(
          'Oath requires a WalletConnect project ID and a direct connection view.'
        );
      }
      adapter = new WalletConnectAdapter({
        projectId: environments.WC_PROJECT_ID,
        storagePrefix: `${WC_STORAGE_PREFIX}:oath`,
        meta: (environments.meta ?? []).filter(
          (chain) =>
            isEvmBlockchain(chain) &&
            OATH_EVM_CHAINS.has(String(Number(chain.chainId)))
        ),
        directConnectionUi: environments.DIRECT_CONNECTION_UI,
      });
      const [, setState] = context.state();
      setState('installed', true);
    })
    .config('metadata', metadata)
    .add('evm', createEvmNamespace(OATH_WALLET_ID, getAdapter))
    .build();
}
