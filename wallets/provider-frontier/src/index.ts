import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletSigners,
  BlockchainMeta,
  WalletInfo,
  solanaBlockchain,
  ProviderConnectResult,
  chooseInstance,
  getEvmAccounts,
  isEvmBlockchain,
} from '@rangodev/wallets-shared';
import { frontier as phantom_instance } from './helpers';
import signer from './signer';

const WALLET = WalletType.FRONTIER;

export const config = {
  type: WALLET,
};

export const getInstance = phantom_instance;
export const connect: Connect = async ({ instance, meta }) => {
  console.log('instance');
  console.log(instance);
  let results: ProviderConnectResult[] = [];

  const evm_instance = chooseInstance(instance, meta, Network.ETHEREUM);

  if (evm_instance) {
    const evm = await getEvmAccounts(evm_instance);
    results.push(evm);
  }

  // const solanaResults = await getSolanaAccounts(instance);

  // results = [...results, ...solanaResults];

  return results;
};
export const subscribe: Subscribe = ({ instance, updateAccounts, meta }) => {
  const ethInstance = chooseInstance(instance, meta, Network.ETHEREUM);
  console.log('ethInstance');
  console.log(ethInstance);
  ethInstance?.on('accountsChanged', async (addresses: string[]) => {
    const eth_chainId = meta
      .filter(isEvmBlockchain)
      .find((blockchain) => blockchain.name === Network.ETHEREUM)?.chainId;

    updateAccounts(addresses, eth_chainId);
    // const [{ accounts, chainId }] = await getSolanaAccounts(instance);
    // updateAccounts(accounts, chainId);
  });
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const solana = solanaBlockchain(allBlockChains);
  return {
    name: 'Frontier',
    img: 'https://app.rango.exchange/wallets/phantom.svg',
    installLink:
      'https://chrome.google.com/webstore/detail/frontier-wallet/kppfdiipphfccemcignhifpjkapfbihd',
    color: '#4d40c6',
    supportedChains: solana,
  };
};
