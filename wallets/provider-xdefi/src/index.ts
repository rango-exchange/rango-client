import type {
  CanEagerConnect,
  CanSwitchNetwork,
  Connect,
  ProviderConnectResult,
  Subscribe,
  SwitchNetwork,
  WalletInfo,
} from '@arlert-dev/wallets-shared';

import {
  canEagerlyConnectToEvm,
  canSwitchNetworkToEvm,
  chooseInstance,
  getBlockChainNameFromId,
  getCosmosAccounts,
  getEvmAccounts,
  getSolanaAccounts,
  Networks,
  switchNetworkForEvm,
  WalletTypes,
  XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
} from '@arlert-dev/wallets-shared';
import { type BlockchainMeta, type SignerFactory } from 'rango-types';
import { cosmosBlockchains, isCosmosBlockchain } from 'rango-types';

import { SUPPORTED_COSMOS_CHAINS, SUPPORTED_ETH_CHAINS } from './constants.js';
import { getNonEvmAccounts, xdefi as xdefi_instances } from './helpers.js';
import signer from './signer.js';

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
  const cosmosInstance = chooseInstance(instance, meta, Networks.COSMOS);

  const evmResult = await getEvmAccounts(ethInstance);
  const nonEvmResults = await getNonEvmAccounts(instance);
  const solanaAccounts = await getSolanaAccounts({
    instance: solInstance,
    meta,
  });

  const cosmosAccounts: ProviderConnectResult[] = [];
  if (cosmosInstance) {
    const cosmosBlockchainMeta = meta.filter(
      (blockchainMeta: BlockchainMeta) =>
        isCosmosBlockchain(blockchainMeta) &&
        SUPPORTED_COSMOS_CHAINS.includes(blockchainMeta.name as Networks)
    );
    const requestedNetwork = Networks.COSMOS;

    const cosmosResult = await getCosmosAccounts({
      instance: cosmosInstance,
      meta: cosmosBlockchainMeta,
      network: requestedNetwork,
    });
    if (Array.isArray(cosmosResult)) {
      cosmosAccounts.push(...cosmosResult);
    } else {
      cosmosAccounts.push(cosmosResult);
    }
  }

  return [
    evmResult,
    ...nonEvmResults,
    solanaAccounts as ProviderConnectResult,
    ...cosmosAccounts,
  ];
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
  eth?.on?.('chainChanged', handleChainChanged);

  return () => {
    eth?.off?.('chainChanged', handleChainChanged);
  };
};

export const switchNetwork: SwitchNetwork = switchNetworkForEvm;

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const getSigners: (provider: any) => Promise<SignerFactory> = signer;

export const canEagerConnect: CanEagerConnect = async ({ instance, meta }) => {
  const evm_instance = chooseInstance(instance, meta, Networks.ETHEREUM);
  if (evm_instance) {
    return canEagerlyConnectToEvm({ instance: evm_instance, meta });
  }
  return Promise.resolve(false);
};
export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const supportedCosmosChains = cosmosBlockchains(allBlockChains).filter(
    (blockchainMeta: BlockchainMeta) =>
      !!blockchainMeta.info &&
      SUPPORTED_COSMOS_CHAINS.includes(blockchainMeta.name as Networks)
  );

  const supportedChains = [
    ...allBlockChains.filter((blockchainMeta) =>
      [
        ...SUPPORTED_ETH_CHAINS,
        ...XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
        Networks.SOLANA,
      ].includes(blockchainMeta.name as Networks)
    ),
    ...supportedCosmosChains,
  ];
  return {
    name: 'Ctrl',
    img: 'https://raw.githubusercontent.com/rango-exchange/assets/main/wallets/xdefi/icon.svg',
    installLink: {
      CHROME:
        'https://chromewebstore.google.com/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
      BRAVE:
        'https://chromewebstore.google.com/detail/ctrl-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf',
      DEFAULT: 'https://ctrl.xyz/',
    },
    color: '#0646c7',
    supportedChains,
  };
};

// it is required in /examples/queue-manager-demo
export { SUPPORTED_ETH_CHAINS } from './constants.js';
