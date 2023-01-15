import { getNetworkInstance } from '../providers';
import { Network, TronTransaction } from '../rango';

export async function executeTronTransaction(
  tx: TronTransaction,
  provider: any
): Promise<string> {
  const tronProvider = getNetworkInstance(provider, Network.TRON);
  const signedTxn = await provider.tronWeb.trx.sign({
    raw_data: tx.rawData,
    raw_data_hex: tx.rawDataHex,
  });
  const receipt = await provider.tronWeb.trx.sendRawTransaction(signedTxn);
  return receipt?.transaction?.txID;
}
