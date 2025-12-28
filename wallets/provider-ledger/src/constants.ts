import { type ProviderMetadata } from '@rango-dev/wallets-core';
import { LegacyNetworks } from '@rango-dev/wallets-core/legacy';
import { Networks } from '@rango-dev/wallets-shared';
import { type BlockchainMeta } from 'rango-types';

import getSigners from './signer.js';

export const EVM_SUPPORTED_CHAINS = [
  LegacyNetworks.ETHEREUM,
  LegacyNetworks.POLYGON,
  LegacyNetworks.BASE,
];

export const HEXADECIMAL_BASE = 16;
export const WALLET_ID = 'ledger';

export const metadata: ProviderMetadata = {
  name: 'Ledger',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/ledger/icon.svg',
  extensions: {
    homepage:
      'https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true',
  },
  properties: [
    {
      name: 'namespaces',
      value: {
        selection: 'single',
        data: [
          {
            label: 'Ethereum',
            value: 'EVM',
            id: 'ETH',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter(
                (chain) => chain.name === Networks.ETHEREUM
              ),
          },
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter((chain) => chain.name === Networks.SOLANA),
          },
          {
            label: 'Bitcoin',
            value: 'UTXO',
            id: 'BTC',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter((chain) => chain.name === Networks.BTC),
          },
        ],
      },
    },
    {
      name: 'derivationPath',
      value: {
        data: [
          {
            id: 'metamask',
            label: `Metamask (m/44'/60'/0'/0/index)`,
            namespace: 'EVM',
            generateDerivationPath: (index: string) => `44'/60'/0'/0/${index}`,
          },
          {
            id: 'ledgerLive',
            label: `LedgerLive (m/44'/60'/index'/0/0)`,
            namespace: 'EVM',
            generateDerivationPath: (index: string) => `44'/60'/${index}'/0/0`,
          },
          {
            id: 'legacy',
            label: `Legacy (m/44'/60'/0'/index)`,
            namespace: 'EVM',
            generateDerivationPath: (index: string) => `44'/60'/0'/${index}`,
          },
          {
            id: `(m/44'/501'/index')`,
            label: `(m/44'/501'/index')`,
            namespace: 'Solana',
            generateDerivationPath: (index: string) => `44'/501'/${index}'`,
          },
          {
            id: `(m/44'/501'/0'/index)`,
            label: `(m/44'/501'/0'/index)`,
            namespace: 'Solana',
            generateDerivationPath: (index: string) => `44'/501'/0'/${index}`,
          },
          {
            id: `Native Segwit (m/84'/0'/0'/0/index)`,
            label: `Native Segwit (m/84'/0'/0'/0/index)`,
            namespace: 'UTXO',
            generateDerivationPath: (index: string) => `84'/0'/0'/0/${index}`,
          },
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
  ],
};
