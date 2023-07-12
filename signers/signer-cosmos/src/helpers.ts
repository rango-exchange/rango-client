import Long from 'long';
import { SigningStargateClient } from '@cosmjs/stargate';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx.js';
import {
  BroadcastMode,
  Keplr,
  KeplrSignOptions,
  StdSignDoc,
} from '@keplr-wallet/types';
import type { CosmosTransaction } from 'rango-types';
import { SignerError, SignerErrorCode } from 'rango-types';
import {
  AuthInfo,
  Fee,
  TxBody,
  TxRaw,
} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { PubKey } from '@keplr-wallet/proto-types/cosmos/crypto/secp256k1/keys';
import { escapeHTML, sortObjectByKey } from '@keplr-wallet/common';

// todo: unhardcode this.
// sifchain has some gas price apis. but gaslimits might be hardcoded still
// hardcoded based on
// https://github.com/Sifchain/sifchain-ui/blob/develop/ui/core/src/clients/bridges/IBCBridge/IBCBridge.ts#L236
// https://github.com/Sifchain/sifchain-ui/blob/7dad360eaa8a6b8e71e0ff818896f0c7d062b53c/ui/core/src/clients/bridges/IBCBridge/IBCBridge.ts#L229
// https://github.com/Sifchain/sifchain-ui/blob/develop/ui/core/src/clients/wallets/cosmos/CosmosWalletProvider.ts#L93
// https://github.com/Sifchain/sifchain-ui/blob/f8ac705c625af72521785c4cb61206173ed2080f/ui/core/src/clients/bridges/IBCBridge/IBCBridge.ts#L359 // 500000 for ibc
const STARGATE_CLIENT_OPTIONS = {
  gasLimits: {
    send: 80000,
    ibcTransfer: 500000,
    // transfer: 360000,
    transfer: 250000,
    delegate: 250000,
    undelegate: 250000,
    redelegate: 250000,
    withdrawRewards: 140000,
    govVote: 250000,
  },
};

const uint8ArrayToHex = (buffer: Uint8Array): string => {
  return Buffer.from(buffer).toString('hex');
};

export const executeCosmosTransaction = async (
  cosmosTx: CosmosTransaction,
  cosmosProvider: Keplr
): Promise<string> => {
  if (!cosmosProvider) throw SignerError.AssertionFailed('wallet is null!');
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

    if (signType === 'AMINO') {
      const signDocRaw: StdSignDoc = {
        chain_id: chainId,
        account_number: account_number?.toString(),
        sequence: sequence,
        fee: fee as any,
        msgs: msgsWithoutType,
        memo: escapeHTML(memo || ''),
      };
      const signDoc = sortObjectByKey(signDocRaw);

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
      let signedTx;

      if (cosmosTx.data.protoMsgs.length > 0) {
        // based on this link:
        // https://github.com/chainapsis/keplr-wallet/blob/40211c8dd75ccbdc4c868db9dc22599f4cb952e9/packages/stores/src/account/cosmos.ts#L508
        signedTx = TxRaw.encode({
          bodyBytes: TxBody.encode(
            TxBody.fromPartial({
              messages: cosmosTx.data.protoMsgs.map((m) => ({
                typeUrl: m.type_url,
                value: new Uint8Array(m.value),
              })),
              memo: signResponse.signed.memo,
            })
          ).finish(),
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
                sequence: Long.fromString(signResponse.signed.sequence),
              },
            ],
            fee: Fee.fromPartial({
              amount: signResponse.signed.fee.amount.map((a) => ({
                denom: a.denom,
                amount: a.amount,
              })),
              gasLimit: signResponse.signed.fee.gas,
            }),
          }).finish(),
          signatures: [Buffer.from(signResponse.signature.signature, 'base64')],
        }).finish();
      } else {
        throw new Error('protoMsgs is required in Amino messages');
      }
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

      const isIbcTx =
        cosmosTx.data.msgs.filter(
          (k) =>
            k.__type === 'DirectCosmosIBCTransferMessage' ||
            k.__type === 'CosmosIBCTransferMessage'
        ).length > 0;
      const tmpGas = isIbcTx
        ? STARGATE_CLIENT_OPTIONS.gasLimits.ibcTransfer
        : STARGATE_CLIENT_OPTIONS.gasLimits.transfer;
      let gasLimit = tmpGas.toString();
      if (
        (cosmosTx.data.chainId === 'kaiyo-1' || isIbcTx) &&
        typeof cosmosTx.data.fee?.gas == 'string'
      ) {
        // if gasLimit is defined in server, use that instead of default for ibc transactions
        gasLimit = Long.fromString(cosmosTx.data.fee?.gas).toString();
      }

      if (!!chainId && chainId?.toLowerCase()?.startsWith('juno-')) {
        gasLimit = fee?.gas
          ? fee?.gas
          : STARGATE_CLIENT_OPTIONS.gasLimits.transfer.toString();
      }
      const msgsWithoutType1 = msgs.map((m) => ({
        ...manipulateMsgForDirectIBC(m),
      }));
      const broadcastTxRes = await sendingStargateClient.signAndBroadcast(
        cosmosTx.fromWalletAddress,
        msgsWithoutType1,
        {
          // ...sendingStargateClient.fees.transfer,
          gas: gasLimit,
          amount: feeArray,
        }
      );
      return broadcastTxRes.transactionHash;
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
};

function manipulateMsg(m: any): any {
  if (!m.__type) return m;
  if (m.__type === 'DirectCosmosIBCTransferMessage') {
    const result = { ...m };
    if (result.value.timeoutTimestamp)
      result.value.timeoutTimestamp = Long.fromString(
        result.value.timeoutTimestamp
      );
    if (!!result.value.timeoutHeight?.revisionHeight)
      result.value.timeoutHeight.revisionHeight = Long.fromString(
        result.value.timeoutHeight.revisionHeight
      );
    if (!!result.value.timeoutHeight?.revisionNumber)
      result.value.timeoutHeight.revisionNumber = Long.fromString(
        result.value.timeoutHeight.revisionNumber
      );
    return result;
  }
  return { ...m };
}

function manipulateMsgForDirectIBC(m: any): any {
  if (m.__type === 'CosmosIBCTransferMessage') {
    const x = m['@type'];
    const sourcePort = m['value']['source_port'];
    const sourceChannel = m['value']['source_channel'];
    const timeoutTimestamp = m['value']['timeout_timestamp'];
    const revisionNumber = m['value']['timeout_height']['revision_number'];
    const revisionHeight = m['value']['timeout_height']['revision_height'];
    delete m['@type'];
    delete m['type'];
    delete m['value']['source_port'];
    delete m['value']['source_channel'];
    delete m['value']['timeout_timestamp'];
    delete m['value']['timeout_height'];
    const result = { ...m };
    result.typeUrl = x;
    result.value.timeoutTimestamp = timeoutTimestamp;
    result.value.sourceChannel = sourceChannel;
    result.value.sourcePort = sourcePort;
    result.value.timeoutHeight = {
      revisionNumber,
      revisionHeight,
    };
    result.__type = 'DirectCosmosIBCTransferMessage';
    return result;
  }
  return { ...m };
}
