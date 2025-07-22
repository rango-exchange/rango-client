import type { Environments } from './types.js';
import type {
  Connect,
  ProviderConnectResult,
  WalletInfo,
} from '@arlert-dev/wallets-shared';

import { Networks, WalletTypes } from '@arlert-dev/wallets-shared';
import { type BlockchainMeta, type SignerFactory } from 'rango-types';

import {
  getEthereumAccounts,
  getTrezorInstance,
  getTrezorModule,
  getTrezorNormalizedDerivationPath,
} from './helpers.js';
import signer from './signer.js';
import { setDerivationPath } from './state.js';

let trezorManifest: Environments['manifest'] = {
  appUrl: '',
  email: '',
};
export const config = {
  type: WalletTypes.TREZOR,
};

export type { Environments };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Provider = any;

export const init = (environments: Environments) => {
  trezorManifest = environments.manifest;
};

export const getInstance = getTrezorInstance;

let isTrezorInitialized = false;
export const connect: Connect = async ({ namespaces }) => {
  const results: ProviderConnectResult[] = [];

  const TrezorConnect = await getTrezorModule();

  const evmNamespace = namespaces?.find(
    (namespaceItem) => namespaceItem.namespace === 'EVM'
  );

  if (evmNamespace) {
    if (evmNamespace.derivationPath) {
      setDerivationPath(
        getTrezorNormalizedDerivationPath(evmNamespace.derivationPath)
      );

      if (!isTrezorInitialized) {
        await TrezorConnect.init({
          lazyLoad: true, // this param will prevent iframe injection until TrezorConnect.method will be called
          manifest: trezorManifest,
        });

        isTrezorInitialized = true;
      }

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

export const getSigners: (provider: Provider) => Promise<SignerFactory> =
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

  return {
    name: 'Trezor',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/trezor/icon.svg',
    installLink: {
      DEFAULT: 'https://trezor.io/learn/a/download-verify-trezor-suite',
    },
    color: 'black',
    supportedChains,
    showOnMobile: false,

    needsNamespace: {
      selection: 'single',
      data: [
        {
          id: 'ETH',
          value: 'EVM',
          label: 'Ethereum',
          getSupportedChains: (allBlockchains: BlockchainMeta[]) =>
            allBlockchains.filter((chain) => chain.name === Networks.ETHEREUM),
        },
      ],
    },
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
  };
};
