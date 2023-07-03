import { TendermintTxTracer } from '@keplr-wallet/cosmos';
import { simpleFetch } from '@keplr-wallet/simple-fetch';
import { BlockchainMeta, cosmosBlockchains } from 'rango-types';
export async function sendTx(
  chainId: string,
  tx: unknown,
  mode: 'async' | 'sync' | 'block',
  supportedChains: BlockchainMeta[]
): Promise<Uint8Array> {
  console.log({ chainId });

  const cosmos = cosmosBlockchains(supportedChains);
  const chainInfo = cosmos.find((item) => item.chainId === chainId)?.info;
  const isProtoTx = Buffer.isBuffer(tx) || tx instanceof Uint8Array;
  if (!chainInfo) {
    throw 'Chain info is undefined from server';
  }
  const params = isProtoTx
    ? {
        tx_bytes: Buffer.from(tx as any).toString('base64'),
        mode: (() => {
          switch (mode) {
            case 'async':
              return 'BROADCAST_MODE_ASYNC';
            case 'block':
              return 'BROADCAST_MODE_BLOCK';
            case 'sync':
              return 'BROADCAST_MODE_SYNC';
            default:
              return 'BROADCAST_MODE_UNSPECIFIED';
          }
        })(),
      }
    : {
        tx,
        mode: mode,
      };

  try {
    const result = await simpleFetch<any>(
      chainInfo.rest,
      isProtoTx ? '/cosmos/tx/v1beta1/txs' : '/txs',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(params),
      }
    );

    const txResponse = isProtoTx ? result.data['tx_response'] : result.data;

    if (txResponse.code != null && txResponse.code !== 0) {
      throw new Error(txResponse['raw_log']);
    }

    const txHash = Buffer.from(txResponse.txhash, 'hex');

    const txTracer = new TendermintTxTracer(chainInfo.rpc, '/websocket');
    txTracer.traceTx(txHash).then(() => {
      txTracer.close();
    });

    return txHash;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
