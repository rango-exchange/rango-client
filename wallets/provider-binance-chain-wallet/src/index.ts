import {
  Network,
  WalletType,
  CanSwitchNetwork,
  Connect,
  Subscribe,
  WalletSigners,
  getEvmAccounts,
  isEvmBlockchain,
  WalletInfo,
  BlockchainMeta,
} from '@rangodev/wallets-shared';
import {
  accountsForActiveWallet,
  binance as binance_instance,
  BINANCE_CHAIN_WALLET_SUPPORTED_CHAINS,
} from './helpers';
import signer from './signer';

const WALLET = WalletType.BINANCE_CHAIN;

export const config = {
  type: WALLET,
  // TODO: Get from instance
  defaultNetwork: Network.ETHEREUM,
};

export const getInstance = binance_instance;
export const connect: Connect = async ({ instance }) => {
  // Note: We need to get `chainId` here, because for the first time
  // after opening the browser, wallet is locked, and don't give us accounts and chainId
  // on `check` phase, so `network` will be null. For this case we need to get chainId
  // whenever we are requesting accounts.
  const evm = await getEvmAccounts(instance);
  const accounts = await accountsForActiveWallet(instance, evm.accounts[0]);

  return accounts;
};

export const subscribe: Subscribe = ({
  instance,
  state,
  meta,
  updateChainId,
  updateAccounts,
}) => {
  instance?.on('accountsChanged', async (addresses: string[]) => {
    if (state.connected) {
      const accounts = await accountsForActiveWallet(instance, addresses[0]);

      for (const account of accounts) {
        const chainId = meta
          .filter(isEvmBlockchain)
          .find((blockchain) => blockchain.name === account.chainId)?.chainId;
        const finalChainId = chainId || account.chainId; // use network instead of chain id when it's null
        if (finalChainId && account.accounts) {
          updateAccounts(account.accounts, finalChainId);
        }
      }
    }
  });
  instance?.on('chainChanged', (chainId: string) => {
    updateChainId(chainId);
  });
};

export const canSwitchNetworkTo: CanSwitchNetwork = () => false;

export const getSigners: (provider: any) => WalletSigners = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => ({
  name: 'Binance',
  img: 'https://avatars.githubusercontent.com/u/69836600?s=200&v=4',
  installLink:
    'https://chrome.google.com/webstore/detail/binance-chain-wallet/fhbohimaelbohpjbbldcngcnapndodjp',
  color: '#2b2e35',
  supportedChains: allBlockChains.filter((blockchainMeta) =>
    BINANCE_CHAIN_WALLET_SUPPORTED_CHAINS.includes(
      blockchainMeta.name as Network
    )
  ),
});
