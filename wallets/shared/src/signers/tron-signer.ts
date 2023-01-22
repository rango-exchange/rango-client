import { getNetworkInstance } from '../providers';
import { Network, TronTransaction } from '../rango';

export async function executeTronTransaction(
  tx: TronTransaction,
  provider: any
): Promise<string> {
  const tronProvider = getNetworkInstance(provider, Network.TRON);
  let finalTx = {};
  if (!!tx.raw_data) finalTx = { ...finalTx, to: tx.raw_data };
  if (!!tx.raw_data_hex) finalTx = { ...finalTx, to: tx.raw_data_hex };
  if (!!tx.txID) finalTx = { ...finalTx, to: tx.txID };
  if (tx.visible !== undefined) finalTx = { ...finalTx, to: tx.visible };
  if (!!tx.__payload__) finalTx = { ...finalTx, to: tx.__payload__ };
  const signedTxn = await tronProvider.tronWeb.trx.sign(finalTx);
  const receipt = await provider.tronWeb.trx.sendRawTransaction(signedTxn);
  return receipt?.transaction?.txID;
}
