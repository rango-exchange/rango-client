import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@yeager-dev/wallets-shared';
import type { BlockchainMeta, SignerFactory } from 'rango-types';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
  getBlockChainNameFromId,
  getEvmAccounts,
  getSolanaAccounts,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
  XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
} from '@yeager-dev/wallets-shared';

import { SUPPORTED_ETH_CHAINS } from './constants';
import { getNonEvmAccounts, xdefi as xdefi_instances } from './helpers';
import signer from './signer';

const DEFAULT_NETWORK = Networks.ETHEREUM;
const WALLET = WalletTypes.XDEFI;

export const config = {
  type: WALLET,
  defaultNetwork: DEFAULT_NETWORK,
};

export const getInstance = xdefi_instances;

export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Networks.ETHEREUM);
  const solInstance = chooseInstance(instance, meta, Networks.SOLANA);
  if (!ethInstance || !ethInstance.__XDEFI) {
    throw new Error("Please 'Prioritise' XDEFI and refresh the page.");
  }

  const evmResult = await getEvmAccounts(ethInstance);
  const nonEvmResults = await getNonEvmAccounts(instance);
  const solanaAccounts = await getSolanaAccounts({
    instance: solInstance,
    meta,
  });

  return [evmResult, ...nonEvmResults, solanaAccounts as ProviderConnectResult];
};

export const subscribe: Subscribe = ({
  instance,
  meta,
  updateChainId,
  connect,
}) => {
  const handleChainChanged = (chainId: string) => {
    const network = getBlockChainNameFromId(chainId, meta) || Networks.Unknown;
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
  };
  const eth = chooseInstance(instance, meta, Networks.ETHEREUM);
  eth?.on('chainChanged', handleChainChanged);

  return () => {
    eth?.off('chainChanged', handleChainChanged);
  };
};

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => SignerFactory = signer;

export const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  if (evm_instance) {
    return canEagerlyConnectToEvm({ instance: evm_instance, meta });
  }
  return Promise.resolve(false);
};
export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => ({
  name: 'XDefi',
  img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/xdefi/icon.svg',
  installLink: {
    CHROME:
      'https://chrome.google.com/webstore/detail/xdefi-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    BRAVE:
      'https://chrome.google.com/webstore/detail/xdefi-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
    DEFAULT: 'https://xdefi.io/',
  },
  color: '#0646c7',
  supportedChains: allBlockChains.filter((blockchainMeta) =>
    [
      ...SUPPORTED_ETH_CHAINS,
      ...XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
      Networks.SOLANA,
    ].includes(blockchainMeta.name as Networks)
  ),
});
