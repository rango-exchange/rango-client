import {
  WalletType,
  CosmosTransaction,
  EvmTransaction,
  SolanaTransaction,
  Meta,
  WalletSigners,
  StarknetTransaction,
  TronTransaction,
  BlockchainMeta,
} from '../rango';
import { WalletError } from '../errors';
import { signMessage } from './sign-message';
import { executeEvmTransaction } from './evm-signer';
import { executeCosmosTransaction } from './cosmos-signer';
import { executeSolanaTransaction } from './solana-signer';
import { executeStarknetTransaction } from './starknet-signer';
import { executeTronTransaction } from './tron-signer';

type DefaultSignerProps = {
  provider: any;
  walletType: WalletType;
  supportEvm?: boolean;
  supportCosmos?: boolean;
  supportSolana?: boolean;
  supportStarknet?: boolean;
  supportTron?: boolean;
};

export const defaultSigners = ({
  provider,
  walletType,
  supportEvm,
  supportCosmos,
  supportSolana,
  supportStarknet,
  supportTron,
}: DefaultSignerProps): WalletSigners => {
  return {
    executeSolanaTransaction: (
      tx: SolanaTransaction,
      requestId: string
    ): Promise<string> => {
      if (supportSolana)
        return executeSolanaTransaction(tx, requestId, provider);
      throw WalletError.UnsupportedError(
        'executeSolanaTransaction',
        walletType
      );
    },

    executeCosmosMessage: (
      tx: CosmosTransaction,
      meta: Meta
    ): Promise<string> => {
      if (supportCosmos) return executeCosmosTransaction(tx, meta, provider);
      throw WalletError.UnsupportedError('executeCosmosMessage', walletType);
    },

    executeEvmTransaction: async (
      tx: EvmTransaction,
      meta: Meta
    ): Promise<string> => {
      if (supportEvm) return await executeEvmTransaction(tx, meta, provider);
      throw WalletError.UnsupportedError('executeEvmTransaction', walletType);
    },

    signMessage: async (
      walletAddress: string,
      message: string,
      blockChain: string,
      meta: BlockchainMeta[]
    ): Promise<string> => {
      return await signMessage(
        walletAddress,
        message,
        provider,
        blockChain,
        meta
      );
    },

    executeTransfer: () => {
      throw WalletError.UnsupportedError('executeTransfer', walletType);
    },

    executeStarknetTransaction: (tx: StarknetTransaction): Promise<string> => {
      if (supportStarknet) return executeStarknetTransaction(tx, provider);
      throw WalletError.UnsupportedError(
        'executeStarknetTransaction',
        walletType
      );
    },

    executeTronTransaction: (tx: TronTransaction): Promise<string> => {
      if (supportTron) return executeTronTransaction(tx, provider);
      throw WalletError.UnsupportedError('executeTronTransaction', walletType);
    },
  };
};
