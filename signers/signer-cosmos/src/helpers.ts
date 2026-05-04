import type { AminoSignResponse } from '@cosmjs/launchpad';
import type { Keplr, KeplrSignOptions } from '@keplr-wallet/types';
import type { CosmosTransaction } from 'rango-types';

import { BroadcastMode, makeSignDoc } from '@cosmjs/launchpad';
import { SigningStargateClient } from '@cosmjs/stargate';
import { PubKey } from '@keplr-wallet/proto-types/cosmos/crypto/secp256k1/keys.js';
import { SignMode } from '@keplr-wallet/proto-types/cosmos/tx/signing/v1beta1/signing.js';
import {
  AuthInfo,
  TxBody,
  TxRaw,
} from '@keplr-wallet/proto-types/cosmos/tx/v1beta1/tx.js';
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        msgsWithoutType as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      const signedTx = getsignedTx(cosmosTx, signResponse);
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

export function getsignedTx(
  cosmosTx: CosmosTransaction,
  signResponse: AminoSignResponse
) {
  let signedTx;

  if (cosmosTx.data.protoMsgs.length > 0) {
    /*
     * based on this link:
     * https://github.com/chainapsis/keplr-wallet/blob/40211c8dd75ccbdc4c868db9dc22599f4cb952e9/packages/stores/src/account/cosmos.ts#L508
     */
    signedTx = TxRaw.encode({
      bodyBytes: TxBody.encode({
        messages: cosmosTx.data.protoMsgs.map((m) => ({
          typeUrl: m.type_url,
          value: new Uint8Array(m.value),
        })),
        timeoutHeight: '0',
        extensionOptions: [],
        nonCriticalExtensionOptions: [],
        memo: signResponse.signed.memo,
      }).finish(),
      authInfoBytes: AuthInfo.encode({
        signerInfos: [
          {
            publicKey: {
              typeUrl: '/cosmos.crypto.secp256k1.PubKey',
              value: PubKey.encode({
                key: Buffer.from(
                  signResponse.signature.pub_key.value,
                  'base64'
                ),
              }).finish(),
            },
            modeInfo: {
              single: {
                mode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
              },
              multi: undefined,
            },
            sequence: signResponse.signed.sequence,
          },
        ],
        fee: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          amount: signResponse.signed.fee.amount as any[],
          gasLimit: signResponse.signed.fee.gas,
          payer: '',
          granter: '',
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
