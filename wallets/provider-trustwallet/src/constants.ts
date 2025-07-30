import { type ProviderInfo } from '@arlert-dev/wallets-core';
import {
  type BlockchainMeta,
  evmBlockchains,
  solanaBlockchain,
} from 'rango-types';

export const WALLET_ID = 'trust-wallet';

export const info: ProviderInfo = {
  name: 'Trust Wallet',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/trustwallet/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
    brave:
      'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
    homepage: 'https://trustwallet.com/browser-extension/',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'multiple',
        data: [
          {
            label: 'EVM',
            value: 'EVM',
            id: 'ETH',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              evmBlockchains(allBlockchains),
          },
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              solanaBlockchain(allBlockchains),
          },
        ],
      },
    },
  ],
};
