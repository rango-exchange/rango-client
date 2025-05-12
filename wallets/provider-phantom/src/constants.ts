import { type ProviderInfo } from '@rango-dev/wallets-core';
import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { chains as evmChains } from '@rango-dev/wallets-core/namespaces/evm';
import { chains as solanaChains } from '@rango-dev/wallets-core/namespaces/solana';
import { chains as suiChains } from '@rango-dev/wallets-core/namespaces/sui';
import { chains as utxoChains } from '@rango-dev/wallets-core/namespaces/utxo';

export const EVM_SUPPORTED_CHAINS = [
  LegacyNetworks.ETHEREUM,
  LegacyNetworks.POLYGON,
  LegacyNetworks.BASE,
];

export const WALLET_ID = 'phantom';
export const WALLET_NAME_IN_WALLET_STANDARD = 'Phantom';

export const info: ProviderInfo = {
  name: 'Phantom',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/phantom/icon.svg',
  extensions: {
    chrome:
      'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
    homepage: 'https://phantom.app/',
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
            chains: [evmChains.ethereum, evmChains.base, evmChains.polygon],
          },
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            chains: [solanaChains.solana],
          },
          {
            label: 'BTC',
            value: 'UTXO',
            id: 'BTC',
            chains: [utxoChains.bitcoin],
          },
          {
            label: 'Sui',
            value: 'Sui',
            id: 'SUI',
            chains: [suiChains.sui],
          },
        ],
      },
    },
  ],
};
