import type { LegacyProviderInterface } from '@rango-dev/wallets-core/legacy';
import type {
  Connect,
  Disconnect,
  ProviderConnectResult,
  WalletInfo,
} from '@rango-dev/wallets-shared';

import { Networks, WalletTypes } from '@rango-dev/wallets-shared';
import { type BlockchainMeta, type SignerFactory } from 'rango-types';

import { setDerivationPath } from '../state.js';
import {
  getEthereumAccounts,
  ledger as getLedgerInstance,
  getSolanaAccounts,
  transportDisconnect,
} from '../utils.js';

import signer from './signer.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InstanceType = any;

export const config = {
  type: WalletTypes.LEDGER,
};

export const getInstance = getLedgerInstance;
export const connect: Connect = async ({ namespaces }) => {
  const results: ProviderConnectResult[] = [];

  const solanaNamespace = namespaces?.find(
    (namespaceItem) => namespaceItem.namespace === 'Solana'
  );
  const evmNamespace = namespaces?.find(
    (namespaceItem) => namespaceItem.namespace === 'EVM'
  );

  if (solanaNamespace) {
    if (solanaNamespace.derivationPath) {
      setDerivationPath(solanaNamespace.derivationPath);
      const accounts = await getSolanaAccounts();
      results.push(accounts);
    } else {
      throw new Error('Derivation Path can not be empty.');
    }
  } else if (evmNamespace) {
    if (evmNamespace.derivationPath) {
      setDerivationPath(evmNamespace.derivationPath);
      const accounts = await getEthereumAccounts();
      results.push(accounts);
    } else {
      throw new Error('Derivation Path can not be empty.');
    }
  } else {
    throw new Error(
      `It appears that you have selected a namespace that is not yet supported by our system. Your namespaces: ${namespaces?.map(
        (namespaceItem) => namespaceItem.namespace
      )}`
    );
  }

  return results;
};

export const disconnect: Disconnect = async () => {
  void transportDisconnect();
};

export const getSigners: (provider: InstanceType) => Promise<SignerFactory> =
  signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const supportedChains: BlockchainMeta[] = [];

  const ethereumBlockchain = allBlockChains.find(
    (chain) => chain.name === Networks.ETHEREUM
  );
  if (ethereumBlockchain) {
    supportedChains.push(ethereumBlockchain);
  }

  const solanaBlockchain = allBlockChains.find(
    (chain) => chain.name === Networks.SOLANA
  );
  if (solanaBlockchain) {
    supportedChains.push(solanaBlockchain);
  }

  return {
    name: 'Ledger',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/ledger/icon.svg',
    installLink: {
      DEFAULT:
        'https://support.ledger.com/hc/en-us/articles/4404389606417-Download-and-install-Ledger-Live?docs=true',
    },
    color: 'black',
    supportedChains,
    showOnMobile: false,
    needsDerivationPath: {
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

    needsNamespace: {
      selection: 'single',
      data: [
        {
          label: 'EVM',
          value: 'EVM',
          id: 'ETH',
          getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
            allBlockchains.filter((chain) => chain.name === Networks.ETHEREUM),
        },
        {
          label: 'Solana',
          value: 'Solana',
          id: 'SOLANA',
          getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
            allBlockchains.filter((chain) => chain.name === Networks.SOLANA),
        },
      ],
    },
  };
};

const buildLegacyProvider: () => LegacyProviderInterface = () => ({
  config,
  getInstance,
  connect,
  getSigners,
  getWalletInfo,
});

export { buildLegacyProvider };
