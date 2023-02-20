/* eslint-disable @typescript-eslint/no-explicit-any */
import Long from 'long';
import { BroadcastMode, makeSignDoc, makeStdTx } from '@cosmjs/launchpad';
import { SigningStargateClient } from '@cosmjs/stargate';
import { cosmos } from '@keplr-wallet/cosmos';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { KeplrSignOptions } from '@keplr-wallet/types';
import {
  CosmosTransaction,
  getBlockchainChainIdByName,
  DirectCosmosIBCTransferMessage,
  Network,
  Meta,
  uint8ArrayToHex,
} from '../rango';
import { getNetworkInstance } from '../providers';
import { WalletError, WalletErrorCode } from '../errors';

// todo: unhardcode this. sifchain has some gas price apis. but gaslimits might be hardcoded still
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
    // The gas multiplication per rewards.
    withdrawRewards: 140000,
    govVote: 250000,
  },
};

export const executeCosmosTransaction = async (
  cosmosTx: CosmosTransaction,
  meta: Meta,
  provider: any
): Promise<string> => {
  if (!provider) throw WalletError.AssertionFailed('keplr wallet null!');

  const cosmosProvider = getNetworkInstance(provider, Network.COSMOS);

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
    if (!chainId) throw Error('ChainId is undefined from server');
    if (!account_number) throw Error('account_number is undefined from server');
    if (!sequence) throw Error('Sequence is undefined from server');

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
        throw new WalletError(WalletErrorCode.SIGN_TX_ERROR, undefined, err);
      }
      let signedTx;
      if (cosmosTx.data.protoMsgs.length > 0) {
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
        try {
          signedTx = makeStdTx(signResponse.signed, signResponse.signature);
        } catch (err) {
          throw new WalletError(WalletErrorCode.SIGN_TX_ERROR, undefined, err);
        }
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
      // console.log("tx",cosmos)
      // console.log("sendingStargateClient.fees",sendingStargateClient.fees)

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

      if (
        chainId === getBlockchainChainIdByName(Network.JUNO, meta.blockchains)
      ) {
        gasLimit = fee?.gas
          ? fee?.gas
          : STARGATE_CLIENT_OPTIONS.gasLimits.transfer.toString();
      }
      const msgsWithoutType1 = msgs.map((m) => ({
        ...manipulateMsgForDirectIBC(m),
      }));
      const broadcastTxRes = await sendingStargateClient.signAndBroadcast(
        cosmosTx.fromWalletAddress,
        msgsWithoutType1 as any,
        {
          // ...sendingStargateClient.fees.transfer,
          gas: gasLimit,
          amount: feeArray,
        }
      );
      return broadcastTxRes.transactionHash;
    } else {
      throw new WalletError(
        WalletErrorCode.OPERATION_UNSUPPORTED,
        `Sign type for cosmos not supported, type: ${signType}`
      );
    }
  } catch (err) {
    if (err instanceof WalletError) throw err;
    else throw new WalletError(WalletErrorCode.SEND_TX_ERROR, undefined, err);
  }
};

function manipulateMsg(m: any): any {
  if (!m.__type) return m;
  if (m.__type === 'DirectCosmosIBCTransferMessage') {
    const result = { ...m } as DirectCosmosIBCTransferMessage;
    if (result.value.timeoutTimestamp)
      result.value.timeoutTimestamp = Long.fromString(
        result.value.timeoutTimestamp
      ) as any;
    if (!!result.value.timeoutHeight?.revisionHeight)
      result.value.timeoutHeight.revisionHeight = Long.fromString(
        result.value.timeoutHeight.revisionHeight
      ) as any;
    if (!!result.value.timeoutHeight?.revisionNumber)
      result.value.timeoutHeight.revisionNumber = Long.fromString(
        result.value.timeoutHeight.revisionNumber
      ) as any;
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
    const result = { ...m } as DirectCosmosIBCTransferMessage;
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
