import {
  getBlockChainNameFromId,
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletSigners,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  switchNetworkForEvm,
  getSolanaAccounts,
  XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
  BlockchainMeta,
  WalletInfo,
} from '@rango-dev/wallets-shared';
import { SUPPORTED_ETH_CHAINS } from './constants';

import { getNonEvmAccounts, xdefi as xdefi_instances } from './helpers';
import signer from './test';

const DEFAULT_NETWORK = Network.ETHEREUM;
const WALLET = WalletType.XDEFI;

export const config = {
  type: WALLET,
  defaultNetwork: DEFAULT_NETWORK,
};

export const getInstance = xdefi_instances;

export const connect: Connect = async ({ instance, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Network.ETHEREUM);
  const solInstance = chooseInstance(instance, meta, Network.SOLANA);
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
  const eth = chooseInstance(instance, meta, Network.ETHEREUM);
  eth?.on('chainChanged', (chainId: string) => {
    const network = getBlockChainNameFromId(chainId, meta) || Network.Unknown;
    /*
      TODO:
      We are calling `connect` here because signer can't detect
      currect network, I guess the bug is in our signer and it 
      gets the wrong network by calling a wrong method or something.
      Anyways, this works for now, maybe we can reconsider it in future
      Whenever we refactored the signer code as well.  
    */

    //  we need to update `network` first, if not, it will goes through
    // the switching network and will open unneccessary pop ups.
    updateChainId(chainId);
    connect(network);
  });
};

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => ({
  name: 'XDefi',
  img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/xdefi.png',
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
      Network.SOLANA,
    ].includes(blockchainMeta.name as Network)
  ),
});
