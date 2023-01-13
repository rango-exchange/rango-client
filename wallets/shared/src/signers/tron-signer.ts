import { getNetworkInstance } from '../providers';
import { Network, TronTransaction } from '../rango';

export async function executeTronTransaction(
  tx: TronTransaction,
  provider: any
): Promise<string> {
  const tronProvider = getNetworkInstance(provider, Network.TRON);
  console.log({ tronProvider, tx });
  // const { transaction_hash } = await starknetProvider.account.execute(tx.calls);
  return 'transaction_hash';
}
