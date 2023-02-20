import { WalletError, WalletErrorCode } from '../errors';
import { getNetworkInstance } from '../providers';
import { Network, TronTransaction } from '../rango';

export async function executeTronTransaction(
  tx: TronTransaction,
  provider: any
): Promise<string> {
  try {
    const tronProvider = getNetworkInstance(provider, Network.TRON);
    let finalTx = {};
    if (!!tx.raw_data) finalTx = { ...finalTx, raw_data: tx.raw_data };
    if (!!tx.raw_data_hex)
      finalTx = { ...finalTx, raw_data_hex: tx.raw_data_hex };
    if (!!tx.txID) finalTx = { ...finalTx, txID: tx.txID };
    if (tx.visible !== undefined) finalTx = { ...finalTx, visible: tx.visible };
    if (!!tx.__payload__) finalTx = { ...finalTx, __payload__: tx.__payload__ };
    const signedTxn = await tronProvider.tronWeb.trx.sign(finalTx);
    const receipt = await provider.tronWeb.trx.sendRawTransaction(signedTxn);
    return receipt?.transaction?.txID;
  } catch (error: any) {
    throw new WalletError(WalletErrorCode.SEND_TX_ERROR, undefined, error);
  }
}
