import type { Namespace } from '@hub3js/namespaces';

export type DerivationPath = {
  id: string;
  label: string;
  generateDerivationPath: (index: string) => string;
};

export const DERIVATION_PATHS_BY_NAMESPACE: Partial<
  Record<Namespace, DerivationPath[]>
> = {
  EVM: [
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
  Solana: [
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
  UTXO: [
    {
      id: 'bitcoin-native-segwit',
      label: `Native SegWit (m/84'/0'/index')`,
      generateDerivationPath: (index: string) => `84'/0'/${index}'/0/0`,
    },
    {
      id: 'bitcoin-nested-segwit',
      label: `Nested SegWit (m/49'/0'/index')`,
      generateDerivationPath: (index: string) => `49'/0'/${index}'/0/0`,
    },
    {
      id: 'bitcoin-legacy',
      label: `Legacy (m/44'/0'/index')`,
      generateDerivationPath: (index: string) => `44'/0'/${index}'/0/0`,
    },
    {
      id: 'bitcoin-taproot',
      label: `Taproot (m/86'/0'/index')`,
      generateDerivationPath: (index: string) => `86'/0'/${index}'/0/0`,
    },
  ],
};
