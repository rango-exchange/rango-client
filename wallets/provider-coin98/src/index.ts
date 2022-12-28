import {
  getBlockChainNameFromId,
  Network,
  WalletType,
  canSwitchNetworkToEvm,
  chooseInstance,
  getEvmAccounts,
  switchNetworkForEvm,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  SwitchNetwork,
  WalletSigners,
  BlockchainMeta,
  WalletInfo,
  evmBlockchains,
  solanaBlockchain,
} from '@rangodev/wallets-shared';
import { coin98 as coin98_instances } from './helpers';
import { getSolanaAccounts } from './helpers';
import signer from './signer';

const WALLET = WalletType.COIN98;

export const config = {
  type: WALLET,
  // TODO: Get from evm networks
  defaultNetwork: Network.ETHEREUM,
};
export const getInstance = coin98_instances;

export const connect: Connect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Network.ETHEREUM);
  const sol_instance = chooseInstance(instance, meta, Network.SOLANA);
  const evm = await getEvmAccounts(evm_instance);
  const { accounts: solanaAccounts } = await getSolanaAccounts(sol_instance);

  return [
    evm,
    {
      accounts: solanaAccounts,
      chainId: Network.SOLANA,
    },
  ];
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
    const targetInstance = chooseInstance(instance, meta, network);
    targetInstance
      .request({ method: 'eth_requestAccounts' })
      .then(() => undefined)
      .catch((err: unknown) => {
        console.log({ err });
      });
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

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Coin98',
    img: 'https://avatars.githubusercontent.com/u/82671669?s=200&v=4',
    installLink:
      'https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
    color: '#1d1c25',
    supportedChains: [...evms, ...solana],
  };
};
