import type {
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  Networks,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { evmBlockchains, isEvmBlockchain, tronBlockchain } from 'rango-types';

import { tronLinkInstances } from './helpers';
import signer from './signer';

/*
 * https://docs.tronlink.org/dapp/start-developing
 * https://developers.tron.network/docs/tronlink-events
 */
const WALLET = WalletTypes.TRON_LINK;

export const config = {
  type: WALLET,
  defaultNetwork: Networks.TRON,
};

export const getInstance = tronLinkInstances;

export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const tronInstance = chooseInstance(instance, meta, Networks.TRON);

  const results: ProviderConnectResult[] = [];

  if (ethInstance) {
    const evmResult = await getEvmAccounts(ethInstance);
    results.push(evmResult);
  }

  if (tronInstance && !tronInstance.ready) {
    const res = await tronInstance.request({ method: 'tron_requestAccounts' });
    if (!res) {
      throw new Error('Please unlock your TronLink extension first.');
    }
    if (!!res?.code && !!res.message) {
      throw new Error(res.message);
    }

    // TODO check connected network
    const address = tronInstance.tronWeb.address.fromHex(
      (await instance.tronWeb.trx.getAccount()).address.toString()
    );
    results.push({
      accounts: address ? [address] : [],
      chainId: Networks.TRON,
    });
  }

  return results;
};

export const subscribe: Subscribe = ({
  instance,
  state,
  updateChainId,
  updateAccounts,
  meta,
  disconnect,
}) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);

  ethInstance?.on('accountsChanged', (addresses: string[]) => {
    const eth_chainId = meta
      .filter(isEvmBlockchain)
      .find((blockchain) => blockchain.name === Networks.ETHEREUM)?.chainId;
    if (state.connected) {
      if (state.network != Networks.ETHEREUM && eth_chainId) {
        updateChainId(eth_chainId);
      }
      updateAccounts(addresses);
    }
  });

  window.addEventListener('message', (e) => {
    if (
      e.data.isTronLink &&
      e.data.message &&
      e.data.message.action == 'accountsChanged'
    ) {
      const account = e?.data?.message?.data?.address;
      if (account) {
        updateAccounts([account]);
      } else {
        disconnect();
      }
    }
  });
};
export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const tron = tronBlockchain(allBlockChains);
  return {
    name: 'TronLink',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/tronlink/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
      BRAVE:
        'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
      DEFAULT: 'https://www.tronlink.org',
    },
    color: '#96e7ed',
    supportedChains: [...evms, ...tron],
  };
};
