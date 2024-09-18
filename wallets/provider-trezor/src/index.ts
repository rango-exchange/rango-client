import type { Environments } from './types.js';
import type {
  Connect,
  ProviderConnectResult,
  WalletInfo,
} from '@rango-dev/wallets-shared';

import { Namespace, Networks, WalletTypes } from '@rango-dev/wallets-shared';
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

export const init = (environments: Environments) => {
  trezorManifest = environments.manifest;
};

export const getInstance = getTrezorInstance;

let isTrezorInitialized = false;
export const connect: Connect = async ({ namespaces }) => {
  const results: ProviderConnectResult[] = [];

  const TrezorConnect = await getTrezorModule();

  const evmNamespace = namespaces?.find(
    (namespaceItem) => namespaceItem.namespace === Namespace.Evm
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

export const getSigners: (provider: any) => Promise<SignerFactory> = signer;

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
    namespaces: [Namespace.Evm],
    singleNamespace: true,
    showOnMobile: false,
    needsDerivationPath: true,
  };
};
