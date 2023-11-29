import type { AminoSignResponse, StdSignDoc } from '@cosmjs/amino';
import type { DirectSignResponse } from '@cosmjs/proto-signing';
import type { DeliverTxResponse } from '@cosmjs/stargate';
import type { CosmosTransaction } from 'rango-types';

import { makeSignDoc } from '@cosmjs/amino';
import { getSignedTx } from '@rango-dev/signer-cosmos';
import { SignerError, SignerErrorCode } from 'rango-types';

export const DEFAULT_SNAP_ID = 'npm:@cosmsnap/snap';

const signAmino = async (
  chain_id: string,
  signer: string,
  sign_doc: StdSignDoc,
  provider: any
): Promise<AminoSignResponse> => {
  const result = await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: 'signAmino',
        params: {
          chain_id,
          sign_doc,
          signer,
        },
      },
    },
  });
  return result.data;
};

interface SnapResponse<T> {
  data: T;
  success: boolean;
  statusCode: number;
}

export const signDirect = async (
  chain_id: string,
  signer: string,
  sign_doc: {
    bodyBytes?: Uint8Array | null;
    authInfoBytes?: Uint8Array | null;
    chainId?: string | null;
    accountNumber?: Long | null;
  },
  provider: any
): Promise<DirectSignResponse> => {
  const result: SnapResponse<DirectSignResponse> = await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: 'signDirect',
        params: {
          chain_id,
          sign_doc,
          signer,
        },
      },
    },
  });
  return result.data;
};

const sendTx = async (
  chain_id: string,
  tx: Uint8Array,
  provider: any
): Promise<DeliverTxResponse> => {
  const result = await provider.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: DEFAULT_SNAP_ID,
      request: {
        method: 'sendTx',
        params: {
          chain_id,
          tx: JSON.stringify(tx),
        },
      },
    },
  });
  return result.data;
};

export const executeTransaction = async (
  cosmosTx: CosmosTransaction,
  provider: any
): Promise<string> => {
  if (!provider) {
    throw SignerError.AssertionFailed('wallet is null!');
  }
  try {
    const { sequence, account_number, chainId, msgs, fee, memo, signType } =
      cosmosTx.data;
    const msgsWithoutType = msgs.map((m) => ({
      ...m,
      __type: undefined,
      '@type': undefined,
    }));
    if (!chainId) {
      throw SignerError.AssertionFailed('chainId is undefined from server');
    }
    if (!account_number) {
      throw SignerError.AssertionFailed(
        'account_number is undefined from server'
      );
    }
    if (!sequence) {
      throw SignerError.AssertionFailed('sequence is undefined from server');
    }
    if (signType === 'AMINO') {
      const signDoc = makeSignDoc(
        msgsWithoutType as any,
        fee as any,
        chainId,
        memo || undefined,
        account_number,
        sequence
      );

      let signResponse;
      try {
        signResponse = await signAmino(
          chainId,
          cosmosTx.fromWalletAddress,
          signDoc,
          provider
        );
      } catch (err) {
        throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, err);
      }
      const signedTx = getSignedTx(cosmosTx, signResponse);

      const result = await sendTx(chainId, signedTx, provider);
      console.log({ result });
    } else if (signType === 'DIRECT') {
      console.log('Direct');
    }

    throw new SignerError(
      SignerErrorCode.OPERATION_UNSUPPORTED,
      `Sign type for cosmos not supported, type: ${signType}`
    );
  } catch (err) {
    console.log({ err });
    if (SignerError.isSignerError(err)) {
      throw err;
    } else {
      throw new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, err);
    }
  }
};
