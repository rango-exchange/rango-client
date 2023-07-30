import {
  AminoSignResponse,
  BroadcastMode,
  makeSignDoc,
} from '@cosmjs/launchpad';
import { IUniversalProvider } from '@walletconnect/universal-provider';
import {
  GenericSigner,
  SignerError,
  SignerErrorCode,
  CosmosTransaction,
  BlockchainMeta,
  cosmosBlockchains,
} from 'rango-types';
import { getsignedTx, manipulateMsg } from '@rango-dev/signer-cosmos';
import { TendermintTxTracer } from '@keplr-wallet/cosmos';
import { simpleFetch } from '@keplr-wallet/simple-fetch';
type CosmosExternalProvider = IUniversalProvider;
const uint8ArrayToHex = (buffer: Uint8Array): string => {
  return Buffer.from(buffer).toString('hex');
};
export class CustomCosmosSigner implements GenericSigner<CosmosTransaction> {
  private provider: CosmosExternalProvider;
  private supportedChains: BlockchainMeta[];

  constructor(
    provider: CosmosExternalProvider,
    supportedChains: BlockchainMeta[]
  ) {
    this.provider = provider;
    this.supportedChains = supportedChains;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<{ hash: string }> {
    if (!this.provider) throw SignerError.AssertionFailed('wallet is null!');
    try {
      const { memo, sequence, account_number, chainId, msgs, fee, signType } =
        tx.data;
      const msgsWithoutType = msgs.map((m) => ({
        ...manipulateMsg(m),
        __type: undefined,
        '@type': undefined,
      }));
      if (!chainId)
        throw SignerError.AssertionFailed('chainId is undefined from server');
      if (!account_number)
        throw SignerError.AssertionFailed(
          'account_number is undefined from server'
        );
      if (!sequence)
        throw SignerError.AssertionFailed('sequence is undefined from server');

      const signDoc = makeSignDoc(
        msgsWithoutType as any,
        fee as any,
        chainId,
        memo || undefined,
        account_number,
        sequence
      );
      if (signType === 'AMINO') {
        let signResponse;
        try {
          signResponse = await this.provider.request<AminoSignResponse>({
            method: 'cosmos_signAmino',
            params: {
              signDoc,
              signerAddress: tx.fromWalletAddress,
            },
          });
        } catch (err) {
          throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, err);
        }

        const signedTx = getsignedTx(tx, signResponse);
        const result = await sendTx(
          chainId,
          signedTx,
          BroadcastMode.Async,
          this.supportedChains
        );
        return { hash: uint8ArrayToHex(result) };
      } else {
        throw new SignerError(
          SignerErrorCode.OPERATION_UNSUPPORTED,
          `Sign type for cosmos not supported, type: ${signType}`
        );
      }
    } catch (err) {
      if (SignerError.isSignerError(err)) throw err;
      else throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, err);
    }
  }
}
async function sendTx(
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
