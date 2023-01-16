import { getNetworkInstance } from '../providers';
import { Network, TronTransaction } from '../rango';

export async function executeTronTransaction(
  tx: TronTransaction,
  provider: any
): Promise<string> {
  const tronProvider = getNetworkInstance(provider, Network.TRON);
  const signedTxn = await tronProvider.tronWeb.trx.sign({
    raw_data: tx.raw_data,
    raw_data_hex: tx.raw_data_hex,
    txID: tx.txID,
    visible: tx.visible,
  });
  const receipt = await provider.tronWeb.trx.sendRawTransaction(signedTxn);
  return receipt?.transaction?.txID;
}
