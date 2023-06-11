import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { DefaultEvmSigner } from '@rango-dev/signer-evm';
import {
  Networks,
  getNetworkInstance,
  evmChainsToRpcMap,
  convertEvmBlockchainMetaToEvmChainInfo,
} from '@rango-dev/wallets-shared';
import {
  BlockchainMeta,
  DefaultSignerFactory,
  isEvmBlockchain,
  SignerFactory,
  TransactionType as TxType,
} from 'rango-types';

export default function getSigners(
  provider: any,
  supportedChains: BlockchainMeta[]
): SignerFactory {
  const evmBlockchains = supportedChains.filter(isEvmBlockchain);
  const rpcUrls = evmChainsToRpcMap(
    convertEvmBlockchainMetaToEvmChainInfo(evmBlockchains)
  );
  const compatibleProvider = new WalletConnectProvider({
    qrcode: false,
    rpc: rpcUrls,
    connector: provider,
    chainId: provider.chainId,
  });
  const ethProvider = getNetworkInstance(compatibleProvider, Networks.ETHEREUM);
  const signers = new DefaultSignerFactory();
  signers.registerSigner(TxType.EVM, new DefaultEvmSigner(ethProvider));
  return signers;
}
