import type { DerivationPathTemplate } from './DerivationPath.helpers';

import { describe, expect, it } from 'vitest';

import {
  CUSTOM_DERIVATION_PATH,
  getDerivationPaths,
} from './DerivationPath.helpers';

const LEDGER: DerivationPathTemplate[] = [
  {
    id: 'metamask',
    label: `Metamask (m/44'/60'/0'/0/index)`,
    namespace: 'EVM',
    generateDerivationPath: (index) => `44'/60'/0'/0/${index}`,
  },
  {
    id: 'ledgerLive',
    label: `LedgerLive (m/44'/60'/index'/0/0)`,
    namespace: 'EVM',
    generateDerivationPath: (index) => `44'/60'/${index}'/0/0`,
  },
  {
    id: 'legacy',
    label: `Legacy (m/44'/60'/0'/index)`,
    namespace: 'EVM',
    generateDerivationPath: (index) => `44'/60'/0'/${index}`,
  },
  {
    id: `(m/44'/501'/index')`,
    label: `(m/44'/501'/index')`,
    namespace: 'Solana',
    generateDerivationPath: (index) => `44'/501'/${index}'`,
  },
  {
    id: `(m/44'/501'/0'/index)`,
    label: `(m/44'/501'/0'/index)`,
    namespace: 'Solana',
    generateDerivationPath: (index) => `44'/501'/0'/${index}`,
  },
];

const TREZOR_UTXO: DerivationPathTemplate[] = [
  {
    id: 'bitcoin-native-segwit',
    label: `Native SegWit (m/84'/0'/index')`,
    namespace: 'UTXO',
    generateDerivationPath: (index) => `84'/0'/${index}'/0/0`,
  },
  {
    id: 'bitcoin-taproot',
    label: `Taproot (m/86'/0'/index')`,
    namespace: 'UTXO',
    generateDerivationPath: (index) => `86'/0'/${index}'/0/0`,
  },
];

describe('getDerivationPaths', () => {
  it('returns only the templates of the selected namespace', () => {
    expect(getDerivationPaths(LEDGER, 'EVM').map((path) => path.id)).toEqual([
      'metamask',
      'ledgerLive',
      'legacy',
      CUSTOM_DERIVATION_PATH.id,
    ]);

    expect(getDerivationPaths(LEDGER, 'Solana').map((path) => path.id)).toEqual(
      [
        `(m/44'/501'/index')`,
        `(m/44'/501'/0'/index)`,
        CUSTOM_DERIVATION_PATH.id,
      ]
    );
  });

  it('appends the custom template so a user can enter a full path', () => {
    const paths = getDerivationPaths(TREZOR_UTXO, 'UTXO');

    expect(paths.at(-1)).toBe(CUSTOM_DERIVATION_PATH);
    expect(CUSTOM_DERIVATION_PATH.generateDerivationPath(`84'/0'/3'/0/0`)).toBe(
      `84'/0'/3'/0/0`
    );
  });

  it('generates the path the wallet expects for the picked index', () => {
    const evm = getDerivationPaths(LEDGER, 'EVM');
    const utxo = getDerivationPaths(TREZOR_UTXO, 'UTXO');

    expect(evm[0]?.generateDerivationPath('2')).toBe(`44'/60'/0'/0/2`);
    expect(evm[1]?.generateDerivationPath('2')).toBe(`44'/60'/2'/0/0`);
    expect(utxo[0]?.generateDerivationPath('2')).toBe(`84'/0'/2'/0/0`);
  });

  it('returns nothing when the provider declares no template for the namespace', () => {
    expect(getDerivationPaths(LEDGER, 'UTXO')).toEqual([]);
    expect(getDerivationPaths([], 'EVM')).toEqual([]);
  });
});
