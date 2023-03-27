import {
  SolanaTransaction,
  Network,
  WalletType,
  WalletSigners,
  getNetworkInstance,
  defaultSigners,
  generalSolanaTransactionExecutor,
  SolanaSigner,
} from '@rango-dev/wallets-shared';
import { PublicKey, Transaction } from '@solana/web3.js';
import bs58 from 'bs58';

export default function getSigners(provider: any): WalletSigners {
  return {
    ...defaultSigners({
      provider,
      walletType: WalletType.COIN98,
      supportEvm: true,
    }),

    executeSolanaTransaction: async (
      tx: SolanaTransaction,
      requestId: string
    ): Promise<string> => {
      const solProvider = getNetworkInstance(provider, Network.SOLANA);

      const solanaSigner: SolanaSigner = async (
        solanaWeb3Transaction: Transaction
      ) => {
        const response: { publicKey: string; signature: string } =
          await solProvider.request({
            method: 'sol_sign',
            params: [solanaWeb3Transaction],
          });
        const publicKey = new PublicKey(response.publicKey);
        const sign = bs58.decode(response.signature);

        solanaWeb3Transaction.addSignature(publicKey, Buffer.from(sign));
        const raw = solanaWeb3Transaction.serialize();
        return raw;
      };
      const hash = await generalSolanaTransactionExecutor(
        requestId,
        tx,
        solanaSigner
      );
      return hash;
    },
  };
}
