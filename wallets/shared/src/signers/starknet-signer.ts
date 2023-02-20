import { WalletError, WalletErrorCode } from '../errors';
import { getNetworkInstance } from '../providers';
import { Network, StarknetTransaction } from '../rango';

export async function executeStarknetTransaction(
  tx: StarknetTransaction,
  provider: any
): Promise<string> {
  try {
    const starknetProvider = getNetworkInstance(provider, Network.STARKNET);
    const { transaction_hash } = await starknetProvider.account.execute(
      tx.calls
    );
    return transaction_hash;
  } catch (error) {
    throw new WalletError(WalletErrorCode.SEND_TX_ERROR, undefined, error);
  }
}
