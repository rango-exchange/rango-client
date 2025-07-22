import { type ProviderInfo } from '@arlert-dev/wallets-core';
import { LegacyNetworks } from '@arlert-dev/wallets-core/legacy';
import { Networks } from '@arlert-dev/wallets-shared';
import {
  type BlockchainMeta,
  type EvmBlockchainMeta,
  isEvmBlockchain,
  solanaBlockchain,
  type SuiBlockchainMeta,
  TransactionType,
  type TransferBlockchainMeta,
} from 'rango-types';

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
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter(
                (chain): chain is EvmBlockchainMeta =>
                  isEvmBlockchain(chain) &&
                  EVM_SUPPORTED_CHAINS.includes(chain.name as Networks)
              ),
          },
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              solanaBlockchain(allBlockchains),
          },
          {
            label: 'BTC',
            value: 'UTXO',
            id: 'BTC',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter(
                (chain): chain is TransferBlockchainMeta =>
                  chain.name === Networks.BTC
              ),
          },
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
      },
    },
  ],
};
