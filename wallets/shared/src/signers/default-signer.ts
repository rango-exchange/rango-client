import {
  WalletType,
  CosmosTransaction,
  EvmTransaction,
  SolanaTransaction,
  Meta,
  WalletSigners,
  StarknetTransaction,
} from '../rango';
import { WalletError } from '../errors';
import { executeEvmTransaction, signEvmMessage } from './evm-signer';
import { executeCosmosTransaction } from './cosmos-signer';
import { executeSolanaTransaction } from './solana-signer';
import { executeStarknetTransaction } from './starknet-signer';

type DefaultSignerProps = {
  provider: any;
  walletType: WalletType;
  supportEvm?: boolean;
  supportCosmos?: boolean;
  supportSolana?: boolean;
  supportStarknet?: boolean;
};

export const defaultSigners = ({
  provider,
  walletType,
  supportEvm,
  supportCosmos,
  supportSolana,
  supportStarknet,
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

    signEvmMessage: async (
      walletAddress: string,
      message: string
    ): Promise<string> => {
      if (supportEvm)
        return await signEvmMessage(walletAddress, message, provider);
      throw WalletError.UnsupportedError('signEvmMessage', walletType);
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
  };
};
