import type { ProviderMetadata } from '@hub3js/core';

import { CAIP_ETHEREUM_CHAIN_ID, isEvmNamespace } from '@hub3js/evm';
import { isSolanaNamespace } from '@hub3js/solana';
import { getChainIdFromCaip2ChainId } from '@hub3js/std/utils';

import getSigners from './signer.js';

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
            isChainSupported: (chainId: string) =>
              isEvmNamespace(chainId) &&
              getChainIdFromCaip2ChainId(chainId) === CAIP_ETHEREUM_CHAIN_ID,
          },
          {
            label: 'Solana',
            value: 'Solana',
            id: 'SOLANA',
            isChainSupported: isSolanaNamespace,
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
        ],
      },
    },
    {
      name: 'signers',
      value: { getSigners: async () => getSigners() },
    },
  ],
};
