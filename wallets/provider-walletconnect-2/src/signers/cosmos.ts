import { SignClient } from '@walletconnect/sign-client/dist/types/client';
import { SessionTypes } from '@walletconnect/types';
import { AccountId, ChainId } from 'caip';
import type { GenericSigner } from 'rango-types';
import { SignerError, CosmosTransaction, SignerErrorCode } from 'rango-types';
import { CosmosRPCMethods, NAMESPACES } from '../constants';
import { getsignedTx, manipulateMsg } from '@rango-dev/signer-cosmos';
import {
  AminoSignResponse,
  BroadcastMode,
  makeSignDoc,
} from '@cosmjs/launchpad';
import { sendTx } from './helper';
import { supportedChains } from './mock';
import { uint8ArrayToHex } from '@rango-dev/wallets-shared';
import { cosmos } from '@keplr-wallet/cosmos';
import { formatDirectSignDoc, stringifySignDocValues } from 'cosmos-wallet';

const NAMESPACE_NAME = NAMESPACES.COSMOS;
type DirectSignResponse = {
  signature: {
    pub_key: {
      type: string;
      value: string;
    };
    signature: string;
  };
  signed: {
    chainId: string;
    accountNumber: string;
    authInfoBytes: string;
    bodyBytes: string;
  };
};
class COSMOSSigner implements GenericSigner<CosmosTransaction> {
  private client: SignClient;
  private session: SessionTypes.Struct;

  constructor(client: SignClient, session: SessionTypes.Struct) {
    this.client = client;
    this.session = session;
  }

  public async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(
    tx: CosmosTransaction,
    address: string,
    chainId: string | null
  ): Promise<{ hash: string }> {
    console.log({ tx, address, chainId });

    const requestedFor = this.isNetworkAndAccountExistInSession({
      address,
      chainId,
    });
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
          signResponse = await this.client.request<AminoSignResponse>({
            topic: this.session.topic,
            chainId: requestedFor.caipChainId,
            request: {
              method: CosmosRPCMethods.SIGN_AMINO,
              params: {
                signDoc,
                signerAddress: tx.fromWalletAddress,
              },
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
          supportedChains
        );
        return { hash: uint8ArrayToHex(result) };
      } else if (signType === 'DIRECT') {
        let getAccounts;
        try {
          getAccounts = await this.client.request<
            Array<{
              address: string;
              algo: string;
              pubkey: string;
            }>
          >({
            topic: this.session.topic,
            chainId: requestedFor.caipChainId,
            request: {
              method: CosmosRPCMethods.GET_ACCOUNTS,
              params: {},
            },
          });
        } catch (err) {
          throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, err);
        }
        const pubkey =
          getAccounts?.find(
            (account) => account.address === tx.fromWalletAddress
          )?.pubkey || '';

        const bodyBytes = cosmos.tx.v1beta1.TxBody.encode({
          messages: tx.data.protoMsgs.map((m) => ({
            type_url: m.type_url,
            value: new Uint8Array(m.value),
          })),
          memo,
        }).finish();
        console.log({ tx, bodyBytes });

        const signDoc = formatDirectSignDoc(
          fee?.amount || [],
          pubkey,
          parseInt(fee?.gas as string),
          account_number,
          parseInt(sequence),
          uint8ArrayToHex(bodyBytes),
          chainId
        );
        let signResponse;
        try {
          signResponse = await this.client.request<DirectSignResponse>({
            topic: this.session.topic,
            chainId: requestedFor.caipChainId,
            request: {
              method: CosmosRPCMethods.SIGN_DIRECT,
              params: {
                signDoc: stringifySignDocValues(signDoc),
                signerAddress: tx.fromWalletAddress,
              },
            },
          });
        } catch (err) {
          throw new SignerError(SignerErrorCode.SIGN_TX_ERROR, undefined, err);
        }
        console.log({ signResponse });
        const result = await sendTx(
          chainId,
          signResponse,
          BroadcastMode.Async,
          supportedChains
        );

        console.log({ result });

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

  private isNetworkAndAccountExistInSession(requestedFor: {
    address: string;
    chainId: string | null;
  }) {
    const { address, chainId } = requestedFor;

    if (!chainId) {
      throw new Error(
        'You need to set your chain for signing message/transaction.'
      );
    }

    const caipAddress = new AccountId({
      chainId: {
        namespace: NAMESPACE_NAME,
        reference: chainId,
      },
      address,
    });
    const addresses = this.session.namespaces[NAMESPACE_NAME]?.accounts.map(
      (address) => address.toLowerCase()
    );

    if (!addresses || !addresses.includes(caipAddress.toString())) {
      console.warn(
        'Available adresses and requested address:',
        addresses,
        caipAddress.toString()
      );
      throw new Error(
        `Your requested address doesn't exist on your wallect connect session. Please reconnect your wallet.`
      );
    }

    const caipChainId = new ChainId({
      namespace: NAMESPACE_NAME,
      reference: chainId,
    });

    return { chainId, address, caipChainId: caipChainId.toString() };
  }
}

export default COSMOSSigner;
