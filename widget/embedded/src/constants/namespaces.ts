import type { DerivationPath } from '@rango-dev/wallets-shared';

import { Namespace } from '@rango-dev/wallets-shared';

export const namespaces: Record<
  Namespace,
  { mainBlockchain: string; title: string; derivationPaths?: DerivationPath[] }
> = {
  [Namespace.Evm]: {
    mainBlockchain: 'ETH',
    title: 'Ethereum',
    derivationPaths: [
      {
        id: 'metamask',
        label: `Metamask (m/44'/60'/0'/0/index)`,
        generateDerivationPath: (index: string) => `44'/60'/0'/0/${index}`,
      },
      {
        id: 'ledgerLive',
        label: `LedgerLive (m/44'/60'/index'/0/0)`,
        generateDerivationPath: (index: string) => `44'/60'/${index}'/0/0`,
      },
      {
        id: 'legacy',
        label: `Legacy (m/44'/60'/0'/index)`,
        generateDerivationPath: (index: string) => `44'/60'/0'/${index}`,
      },
    ],
  },
  [Namespace.Solana]: {
    mainBlockchain: 'SOLANA',
    title: 'Solana',
    derivationPaths: [
      {
        id: `(m/44'/501'/index')`,
        label: `(m/44'/501'/index')`,
        generateDerivationPath: (index: string) => `44'/501'/${index}'`,
      },
      {
        id: `(m/44'/501'/0'/index)`,
        label: `(m/44'/501'/0'/index)`,
        generateDerivationPath: (index: string) => `44'/501'/0'/${index}`,
      },
    ],
  },
  [Namespace.Cosmos]: {
    mainBlockchain: 'COSMOS',
    title: 'Cosmos',
  },
  [Namespace.Utxo]: {
    mainBlockchain: 'BTC',
    title: 'Utxo',
  },
  [Namespace.Starknet]: {
    title: 'Starknet',
    mainBlockchain: 'STARKNET',
  },
  [Namespace.Tron]: {
    title: 'Tron',
    mainBlockchain: 'TRON',
  },
};
