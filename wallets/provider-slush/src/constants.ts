import { type ProviderInfo } from '@arlert-dev/wallets-core';
import {
  type BlockchainMeta,
  type SuiBlockchainMeta,
  TransactionType,
} from 'rango-types';

export const WALLET_ID = 'slush';
export const WALLET_NAME_IN_WALLET_STANDARD = 'Slush';

export const info: ProviderInfo = {
  name: 'Slush',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/slush/icon.svg',
  extensions: {
    chrome:
      'https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
    edge: 'https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
    brave:
      'https://chromewebstore.google.com/detail/slush-%E2%80%94-a-sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
    homepage: 'https://slush.app/download',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        data: [
          {
            label: 'Sui',
            value: 'Sui',
            id: 'SUI',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter(
                (chain): chain is SuiBlockchainMeta =>
                  chain.type === TransactionType.SUI
              ),
          },
        ],
        selection: 'multiple',
      },
    },
  ],
};
