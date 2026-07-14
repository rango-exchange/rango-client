import type { ProviderMetadata } from '@hub3js/core';

import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { type BlockchainMeta, type TransferBlockchainMeta } from 'rango-types';

import getSigners from './signer.js';
import { BITCOIN_ADDRESS_TYPES } from './utxo/config.js';

export const WALLET_ID = WalletTypes.TREZOR;

export const metadata: ProviderMetadata = {
  name: 'Trezor',
  icon: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/trezor/icon.svg',
  extensions: {
    homepage: 'https://trezor.io/learn/a/download-verify-trezor-suite',
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
            label: 'Bitcoin',
            value: 'UTXO',
            id: 'BTC',
            getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
              allBlockchains.filter(
                (chain): chain is TransferBlockchainMeta =>
                  chain.name === Networks.BTC
              ),
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
          /*
           * Bitcoin derivation templates. The BIP-43 purpose (and thus the address
           * type) is what the user picks here; `index` selects the account.
           */
          ...BITCOIN_ADDRESS_TYPES.map((addressType) => ({
            id: `bitcoin-${addressType.id}`,
            label: `${addressType.label} (m/${addressType.purpose}'/0'/index')`,
            namespace: 'UTXO',
            generateDerivationPath: (index: string) =>
              `${addressType.purpose}'/0'/${index}'/0/0`,
          })),
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
  ],
};
