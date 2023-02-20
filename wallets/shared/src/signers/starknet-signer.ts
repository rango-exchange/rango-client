import { getNetworkInstance } from '../providers';
import { Network, StarknetTransaction } from '../rango';

export async function executeStarknetTransaction(
  tx: StarknetTransaction,
  provider: any
): Promise<string> {
  const starknetProvider = getNetworkInstance(provider, Network.STARKNET);
  const { transaction_hash } = await starknetProvider.account.execute(tx.calls);
  return transaction_hash;
}
