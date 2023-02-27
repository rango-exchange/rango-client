import { xdefiTransfer } from './helpers';
import {
  CosmosTransaction,
  TransferTransaction,
  WalletType,
  XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS,
  Network,
  WalletSigners,
  WalletError,
  getNetworkInstance,
  defaultSigners,
} from '@rango-dev/wallets-shared';

export default function getSigners(provider: any): WalletSigners {
  return {
    ...defaultSigners({
      walletType: WalletType.XDEFI,
      provider,
      supportEvm: true,
      supportSolana: true,
    }),

    executeTransfer: async (tx: TransferTransaction): Promise<string> => {
      const { blockchain } = tx.asset;

      // Everything except ETH
      if (!XDEFI_WALLET_SUPPORTED_NATIVE_CHAINS.includes(blockchain as Network))
        throw new Error(
          `blockchain: ${blockchain} transfer not implemented yet.`
        );
      const transferProvider = getNetworkInstance(
        provider,
        blockchain as Network
      );

      const {
        method,
        memo,
        recipientAddress,
        decimals,
        amount,
        fromWalletAddress: from,
        asset,
      } = tx;

      return xdefiTransfer(
        blockchain,
        asset.ticker,
        from,
        amount,
        decimals,
        recipientAddress,
        transferProvider,
        method,
        memo
      );
    },
    executeCosmosMessage: async (tx: CosmosTransaction): Promise<string> => {
      const cosmosProvider = getNetworkInstance(provider, Network.BINANCE);
      if (tx.rawTransfer === null)
        throw WalletError.AssertionFailed('rawTransfer obj can not be null');

      const from = tx.fromWalletAddress;
      const { method, memo, recipient, decimals, amount, asset } =
        tx.rawTransfer;
      const blockchain = tx.blockChain;
      return xdefiTransfer(
        blockchain,
        asset.ticker,
        from,
        amount,
        decimals,
        recipient,
        cosmosProvider,
        method,
        memo
      );
    },
  };
}
