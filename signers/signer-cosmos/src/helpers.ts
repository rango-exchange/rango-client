import type { AminoSignResponse } from '@cosmjs/launchpad';
import type { Keplr, KeplrSignOptions } from '@keplr-wallet/types';
import type { CosmosTransaction } from 'rango-types';

import { BroadcastMode, makeSignDoc } from '@cosmjs/launchpad';
import { SigningStargateClient } from '@cosmjs/stargate';
import { cosmos } from '@keplr-wallet/cosmos';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx.js';
import Long from 'long';
import { SignerError, SignerErrorCode } from 'rango-types';

const STARGATE_CLIENT_OPTIONS = {
  gasLimits: {
    transfer: 250000,
  },
};

const uint8ArrayToHex = (buffer: Uint8Array): string => {
  return Buffer.from(buffer).toString('hex');
};

export const executeCosmosTransaction = async (
  cosmosTx: CosmosTransaction,
  cosmosProvider: Keplr
): Promise<string> => {
  if (!cosmosProvider) {
    throw SignerError.AssertionFailed('wallet is null!');
  }
  try {
    const {
      memo,
      sequence,
      account_number,
      chainId,
      msgs,
      fee,
      signType,
      rpcUrl,
    } = cosmosTx.data;
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
      let signOptions = {};
      if (
        cosmosTx.data.chainId === 'osmosis-1' &&
        fee?.amount[0]?.amount === '0'
      ) {
        signOptions = { preferNoSetFee: true };
      }
      let signResponse;
      try {
        signResponse = await cosmosProvider.signAmino(
          chainId,
          cosmosTx.fromWalletAddress,
          signDoc,
          signOptions as KeplrSignOptions
        );
      } catch (err) {
        throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, err);
      }
      const signedTx = getSignedTx(cosmosTx, signResponse);
      const result = await cosmosProvider.sendTx(
        chainId,
        signedTx,
        BroadcastMode.Async
      );
      return uint8ArrayToHex(result);
    } else if (signType === 'DIRECT') {
      const sendingSigner = cosmosProvider?.getOfflineSigner(chainId);
      const sendingStargateClient =
        await SigningStargateClient?.connectWithSigner(
          rpcUrl,
          sendingSigner,
          {}
        );
      sendingStargateClient.registry.register(
        '/cosmwasm.wasm.v1.MsgExecuteContract',
        MsgExecuteContract
      );
      const feeArray = !!fee?.amount[0]
        ? [{ denom: fee.amount[0].denom, amount: fee?.amount[0].amount }]
        : [];

      const defaultGas = STARGATE_CLIENT_OPTIONS.gasLimits.transfer.toString();
      const gasLimit =
        typeof fee?.gas === 'string'
          ? Long.fromString(fee?.gas).toString()
          : defaultGas;
      const broadcastTxRes = await sendingStargateClient.signAndBroadcast(
        cosmosTx.fromWalletAddress,
        msgsWithoutType,
        {
          gas: gasLimit,
          amount: feeArray,
        }
      );
      return broadcastTxRes.transactionHash;
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

export function getSignedTx(
  cosmosTx: CosmosTransaction,
  signResponse: AminoSignResponse
) {
  let signedTx;

  if (cosmosTx.data.protoMsgs.length > 0) {
    /*
     * based on this link:
     * https://github.com/chainapsis/keplr-wallet/blob/40211c8dd75ccbdc4c868db9dc22599f4cb952e9/packages/stores/src/account/cosmos.ts#L508
     */
    signedTx = cosmos.tx.v1beta1.TxRaw.encode({
      bodyBytes: cosmos.tx.v1beta1.TxBody.encode({
        messages: cosmosTx.data.protoMsgs.map((m) => ({
          type_url: m.type_url,
          value: new Uint8Array(m.value),
        })),
        memo: signResponse.signed.memo,
      }).finish(),
      authInfoBytes: cosmos.tx.v1beta1.AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              type_url: '/cosmos.crypto.secp256k1.PubKey',
              value: cosmos.crypto.secp256k1.PubKey.encode({
                key: Buffer.from(
                  signResponse.signature.pub_key.value,
                  'base64'
                ),
              }).finish(),
            },
            modeInfo: {
              single: {
                mode: cosmos.tx.signing.v1beta1.SignMode
                  .SIGN_MODE_LEGACY_AMINO_JSON,
              },
            },
            sequence: Long.fromString(signResponse.signed.sequence),
          },
        ],
        fee: {
          amount: signResponse.signed.fee.amount as any[],
          gasLimit: Long.fromString(signResponse.signed.fee.gas),
        },
      }).finish(),
      signatures: [Buffer.from(signResponse.signature.signature, 'base64')],
    }).finish();
  } else {
    throw SignerError.AssertionFailed(
      'protoMsgs is required in Amino messages'
    );
  }
  return signedTx;
}
