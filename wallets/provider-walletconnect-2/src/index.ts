import { makeConnection, supportsForSwitchNetworkRequest } from './helpers';
import {
  WalletType,
  CanSwitchNetwork,
  Connect,
  Disconnect,
  GetInstance,
  Subscribe,
  SwitchNetwork,
  WalletConfig,
  convertEvmBlockchainMetaToEvmChainInfo,
  canSwitchNetworkToEvm,
  switchOrAddNetworkForMetamaskCompatibleWallets,
  WalletInfo,
  getBlockChainNameFromId,
  Network,
  chooseInstance,
} from '@rango-dev/wallets-shared';
import { formatJsonRpcRequest } from '@walletconnect/jsonrpc-utils';
import signer from './signer';
import {
  SignerFactory,
  EvmBlockchainMeta,
  BlockchainMeta,
  evmBlockchains,
} from 'rango-types';

const WALLET = WalletType.WALLET_CONNECT_2;

export const config: WalletConfig = {
  type: WALLET,
  checkInstallation: false,
  isAsyncInstance: true,
};

export const getInstance: GetInstance = async ({
  network,
  currentProvider,
  meta,
}) => {
  // If `network` is provided, trying to get chainId
  const evm_chain_info = convertEvmBlockchainMetaToEvmChainInfo(
    meta as EvmBlockchainMeta[]
  );
  const info = network ? evm_chain_info[network] : undefined;
  const requestedChainId = info?.chainId ? parseInt(info?.chainId) : undefined;

  const nextInstance = await makeConnection({
    provider: currentProvider,
    chainId: requestedChainId,
  });
  return nextInstance;
};

export const connect: Connect = async ({ instance }) => {
  const accounts = instance.accounts;
  const chainId = instance.chainId;

  return {
    accounts,
    chainId,
  };
};

export const subscribe: Subscribe = async ({
  instance,
  updateChainId,
  updateAccounts,
  disconnect,
  meta,
}) => {
  instance?.on('chainChanged', (chainId: string) => {
    const network = getBlockChainNameFromId(chainId, meta) || Network.Unknown;
    const targetInstance = chooseInstance(instance, meta, network);
    targetInstance
      .request({ method: 'eth_requestAccounts' })
      .then(() => console.log(77777777777))
      .catch((err: unknown) => {
        console.log({ err });
      });

    updateChainId(chainId);
    connect(network as any);
  });
  // Subscribe to connection events
  instance.on('connect', (error: any, payload: any) => {
    if (error) {
      throw error;
    }

    console.log('payload'); // Get provided accounts and chainId
    console.log(payload); // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];

    updateAccounts(accounts);
    updateChainId(chainId);
  });

  instance.on('session_update', (error: any, payload: any) => {
    if (error) {
      throw error;
    }
    console.log('ssssddd'); // Get provided accounts and chainId
    console.log(payload);

    // Get updated accounts and chainId
    const { accounts, chainId } = payload.params[0];
    updateAccounts(accounts);
    updateChainId(chainId);
  });

  instance.on('disconnect', (error: any, _payload: any) => {
    if (error) {
      throw error;
    }

    console.log('_payload');
    console.log(_payload);

    disconnect();
  });
};

export const switchNetwork: SwitchNetwork = async ({
  instance,
  meta,
  network,
  newInstance,
}) => {
  const evm_chain_info = convertEvmBlockchainMetaToEvmChainInfo(
    meta as EvmBlockchainMeta[]
  );

  if (supportsForSwitchNetworkRequest(instance)) {
    const simulatedWeb3Instance = {
      request: (payload: any): Promise<any> => {
        const rpcRequest = formatJsonRpcRequest(payload.method, payload.params);
        return instance.sendCustomRequest(rpcRequest);
      },
    };

    await switchOrAddNetworkForMetamaskCompatibleWallets(
      simulatedWeb3Instance,
      network,
      evm_chain_info
    );
  } else {
    if (!!newInstance) {
      await newInstance({ force: true, network });
    }
  }
};

export const canSwitchNetworkTo: CanSwitchNetwork = canSwitchNetworkToEvm;

export const disconnect: Disconnect = async ({ instance, destroyInstance }) => {
  if (instance && instance.session) {
    await instance.disconnect();
    destroyInstance();
  }
};

export const getSigners: (provider: any) => SignerFactory = signer;

export const getWalletInfo: (allBlockChains: BlockchainMeta[]) => WalletInfo = (
  allBlockChains
) => {
  const evms = evmBlockchains(allBlockChains);
  return {
    name: 'WalletConnect',
    img: 'https://raw.githubusercontent.com/rango-exchange/rango-types/main/assets/icons/wallets/walletconnect.svg',
    installLink: '',
    color: '#b2dbff',
    supportedChains: evms,
    showOnMobile: true,
  };
};
