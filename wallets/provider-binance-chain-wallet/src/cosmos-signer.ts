import type { StdSignMsg } from '@binance-chain/javascript-sdk/lib/types';
import type { CosmosTransaction, GenericSigner } from 'rango-types';

import { BncClient, Transaction } from '@binance-chain/javascript-sdk';
import { getPublicKey } from '@binance-chain/javascript-sdk/lib/crypto/index.js';
import { SignerError, SignerErrorCode } from 'rango-types';

import { cosmosMessageToBCSendMsg } from './helpers';

export const executeCosmosMessage = async (
  cosmosProvider: any,
  tx: CosmosTransaction
): Promise<string> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async function (resolve, reject) {
    try {
      const bncClient = new BncClient('https://dex.binance.org');
      bncClient.chooseNetwork('mainnet');
      await bncClient.initChain();
      bncClient.useDefaultSigningDelegate();
      bncClient.useDefaultBroadcastDelegate();

      const { chainId, account_number, sequence, memo, source } = tx.data;
      if (!chainId) {
        throw Error('ChainId is undefined from server');
      }
      if (!account_number) {
        throw Error('account_number is undefined from server');
      }
      if (!sequence) {
        throw Error('Sequence is undefined from server');
      }
      if (!memo) {
        throw Error('Memo is undefined from server');
      }
      if (!source) {
        throw Error('Source is undefined from server');
      }

      const sendmsg = cosmosMessageToBCSendMsg(tx.data.msgs[0]);
      const data: StdSignMsg = {
        chainId,
        accountNumber: account_number,
        sequence: parseInt(sequence),
        memo,
        source,
        msg: sendmsg.getMsg(),
      };

      const newTx = new Transaction(data);
      const r = await cosmosProvider.bbcSignTx({
        tx: newTx,
        signMsg: sendmsg.getSignMsg(),
      });

      const pubkey = getPublicKey(r.pubKey);
      newTx.addSignature(pubkey, Buffer.from(r.signature, 'hex'));

      const res = await bncClient.sendRawTransaction(newTx.serialize(), true);

      const txHash = res.result[0].hash;
      resolve(txHash);
    } catch (error) {
      reject(new SignerError(SignerErrorCode.SEND_TX_ERROR, undefined, error));
    }
  });
};

/*
 * TODO - replace with real type
 * tslint:disable-next-line: no-any
 */
type CosmosExternalProvider = any;

export class CustomCosmosSigner implements GenericSigner<CosmosTransaction> {
  private provider: CosmosExternalProvider;
  constructor(provider: CosmosExternalProvider) {
    this.provider = provider;
  }

  async signMessage(): Promise<string> {
    throw SignerError.UnimplementedError('signMessage');
  }

  async signAndSendTx(tx: CosmosTransaction): Promise<{ hash: string }> {
    const hash = await executeCosmosMessage(this.provider, tx);
    return { hash };
  }
}
