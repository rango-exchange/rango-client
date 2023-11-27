import { DEFAULT_SNAP_ID } from '../helpers';

export async function sendTransaction(
  provider: any,
  contractAddress: string,
  contractFuncName: string,
  contractCallData: string,
  senderAddress: string,
  chainId: string | null,
  maxFee?: string
) {
  try {
    const response = await provider.request({
      method: 'wallet_invokeSnap',
      params: {
        snapId: DEFAULT_SNAP_ID,
        request: {
          method: 'starkNet_sendTransaction',
          params: {
            contractAddress,
            contractFuncName,
            contractCallData,
            senderAddress,
            maxFee,
            chainId,
          },
        },
      },
    });
    return response;
  } catch (err) {
    //eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
}
