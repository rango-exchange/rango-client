import type {
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canSwitchNetworkToEvm,
  chooseInstance,
  getBlockChainNameFromId,
  getEvmAccounts,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
} from '@rango-dev/wallets-shared';
import { evmBlockchains, solanaBlockchain } from 'rango-types';

import { coin98 as coin98_instances, getSolanaAccounts } from './helpers';
import signer from './signer';

const WALLET = WalletTypes.COIN98;

export const config = {
  type: WALLET,
  // TODO: Get from evm networks
  defaultNetwork: Networks.ETHEREUM,
};
export const getInstance = coin98_instances;

export const connect: Connect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const sol_instance = chooseInstance(instance, meta, Networks.SOLANA);
  const evm = await getEvmAccounts(evm_instance);
  const { accounts: solanaAccounts } = await getSolanaAccounts(sol_instance);

  return [
    evm,
    {
      accounts: solanaAccounts,
      chainId: Networks.SOLANA,
    },
  ];
};

export const subscribe: Subscribe = ({
  instance,
  meta,
  updateChainId,
  connect,
}) => {
  const eth = chooseInstance(instance, meta, Networks.ETHEREUM);
  eth?.on('chainChanged', (chainId: string) => {
    const network = getBlockChainNameFromId(chainId, meta) || Networks.Unknown;
    const targetInstance = chooseInstance(instance, meta, network);
    targetInstance
      .request({ method: 'eth_requestAccounts' })
      .then(() => undefined)
      .catch((err: unknown) => {
        console.log({ err });
      });
    /*
     *TODO:
     *We are calling `connect` here because signer can't detect
     *currect network, I guess the bug is in our signer and it
     *gets the wrong network by calling a wrong method or something.
     *Anyways, this works for now, maybe we can reconsider it in future
     *Whenever we refactored the signer code as well.
     */

    /*
     *  we need to update `network` first, if not, it will goes through
     * the switching network and will open unneccessary pop ups.
     */
    updateChainId(chainId);
    connect(network);
  });
};

export const switchNetwork: SwitchNetwork = async (options) => {
  const instance = chooseInstance(
    options.instance,
    options.meta,
    options.network
  );
  return switchNetworkForEvm({
    ...options,
    instance,
  });
};

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Coin98',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/coin98/icon.svg',
    installLink: {
      CHROME:
        'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
      BRAVE:
        'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
      DEFAULT: 'https://coin98.com/wallet',
    },
    color: '#1d1c25',
    supportedChains: [...evms, ...solana],
  };
};
